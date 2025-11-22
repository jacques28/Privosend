'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { importKey, decryptFile, base64ToArrayBuffer } from '@/lib/client-crypto'
import { Button } from '@/components/ui/button'
import { Input as InputField } from '@/components/ui/input'
import { Download, Loader2, Check, AlertCircle } from 'lucide-react'

export default function CloudReceive() {
    const [code, setCode] = useState('')
    const [status, setStatus] = useState<'idle' | 'fetching' | 'decrypting' | 'completed' | 'error'>('idle')
    const [error, setError] = useState('')

    const handleDownload = async () => {
        if (!code || code.length !== 6) return
        setStatus('fetching')
        setError('')

        try {
            // 1. Fetch Metadata & Key
            const { data: fileData, error: dbError } = await supabase
                .from('files')
                .select('*')
                .eq('code', code)
                .single()

            if (dbError || !fileData) throw new Error('File not found or expired')

            // 2. Import Key
            if (!fileData.encryption_key) throw new Error('Encryption key missing for this file')
            const importedKey = await importKey(fileData.encryption_key)

            // 3. Download Encrypted File
            const { data: fileBlob, error: downloadError } = await supabase.storage
                .from('files')
                .download(fileData.file_path)

            if (downloadError || !fileBlob) throw new Error('Failed to download file')

            setStatus('decrypting')

            // 4. Decrypt
            const iv = base64ToArrayBuffer(fileData.encryption_iv)
            const decryptedBlob = await decryptFile(fileBlob, importedKey, new Uint8Array(iv))

            // 5. Trigger Download
            const url = URL.createObjectURL(decryptedBlob)
            const a = document.createElement('a')
            a.href = url
            // Extract original filename from path (assuming path is CODE/FILENAME.enc)
            const originalName = fileData.file_path.split('/')[1].replace('.enc', '')
            a.download = originalName
            a.click()
            URL.revokeObjectURL(url)

            setStatus('completed')

        } catch (err: any) {
            console.error('Download failed:', err)
            setError(err.message || 'Download failed')
            setStatus('error')
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Receive Cloud Drop</h2>

            {status === 'idle' || status === 'error' ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500">Enter the 6-digit code:</label>
                        <div className="flex gap-2">
                            <InputField
                                placeholder="000000"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                className="text-center text-2xl tracking-widest font-mono"
                            />
                        </div>
                        <Button onClick={handleDownload} disabled={code.length !== 6} className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Download File
                        </Button>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                    <div className="text-xs text-center text-zinc-400">
                        Enter the code provided by the sender.
                    </div>
                </div>
            ) : null}

            {(status === 'fetching' || status === 'decrypting') && (
                <div className="text-center space-y-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
                    <p className="text-zinc-500">
                        {status === 'fetching' ? 'Locating file...' : 'Decrypting securely...'}
                    </p>
                </div>
            )}

            {status === 'completed' && (
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium">Download Started</h3>
                    <p className="text-sm text-zinc-500">Your file has been decrypted and saved.</p>
                    <Button onClick={() => {
                        setStatus('idle')
                        setCode('')
                    }} variant="outline">
                        Download Another
                    </Button>
                </div>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { importKey, decryptFile, base64ToArrayBuffer } from '@/lib/client-crypto'
import { Button } from '@/components/ui/button'
import { Loader2, Download, AlertCircle } from 'lucide-react'

export default function CloudDownload() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'idle' | 'fetching' | 'decrypting' | 'completed' | 'error'>('idle')
    const [error, setError] = useState('')
    const [fileMeta, setFileMeta] = useState<any>(null)
    const [key, setKey] = useState<CryptoKey | null>(null)

    useEffect(() => {
        const code = searchParams.get('code')
        const hash = window.location.hash
        const keyParam = new URLSearchParams(hash.substring(1)).get('key')

        if (code && keyParam) {
            handleAutoDownload(code, keyParam)
        }
    }, [searchParams])

    const handleAutoDownload = async (code: string, keyStr: string) => {
        setStatus('fetching')
        try {
            // 1. Import Key
            const importedKey = await importKey(decodeURIComponent(keyStr))
            setKey(importedKey)

            // 2. Fetch Metadata
            const { data: fileData, error: dbError } = await supabase
                .from('files')
                .select('*')
                .eq('code', code)
                .single()

            if (dbError || !fileData) throw new Error('File not found or expired')

            setFileMeta(fileData)

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

            // Increment download count (optional)
            await supabase.rpc('increment_download_count', { file_id: fileData.id })

        } catch (err: any) {
            console.error('Download failed:', err)
            setError(err.message || 'Download failed')
            setStatus('error')
        }
    }

    if (status === 'idle') {
        return (
            <div className="text-center p-8">
                <p className="text-zinc-500">Waiting for download link...</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
            <h2 className="text-xl font-semibold mb-4">Secure Download</h2>

            {(status === 'fetching' || status === 'decrypting') && (
                <div className="space-y-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
                    <p className="text-zinc-500">
                        {status === 'fetching' ? 'Downloading encrypted file...' : 'Decrypting locally...'}
                    </p>
                </div>
            )}

            {status === 'completed' && (
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Download className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium">Download Started</h3>
                    <p className="text-sm text-zinc-500">Your file has been decrypted and saved.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-red-600">Download Failed</h3>
                    <p className="text-sm text-zinc-500">{error}</p>
                </div>
            )}
        </div>
    )
}

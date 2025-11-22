'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { generateKey, exportKey, encryptFile, arrayBufferToBase64 } from '@/lib/client-crypto'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, CloudUpload as CloudIcon } from 'lucide-react'

export default function CloudUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<'idle' | 'encrypting' | 'uploading' | 'completed' | 'error'>('idle')
    const [shareLink, setShareLink] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async () => {
        if (!file) return
        setStatus('encrypting')
        setError('')

        try {
            // 1. Generate Key
            const key = await generateKey()
            const exportedKey = await exportKey(key)

            // 2. Encrypt File
            const { encryptedBlob, iv } = await encryptFile(file, key)
            const ivBase64 = arrayBufferToBase64(iv.buffer as ArrayBuffer)

            setStatus('uploading')

            // 3. Generate unique code and path
            const code = Math.random().toString(36).substring(2, 8).toUpperCase()
            const filePath = `${code}/${file.name}.enc`

            // 4. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('files')
                .upload(filePath, encryptedBlob)

            if (uploadError) throw uploadError

            // 5. Store Metadata
            // Expiration: 24 hours from now
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

            const { error: dbError } = await supabase
                .from('files')
                .insert({
                    code,
                    file_path: filePath,
                    expires_at: expiresAt,
                    encryption_iv: ivBase64,
                })

            if (dbError) throw dbError

            // 6. Generate Share Link (including the key in the hash fragment so it's not sent to server)
            // Format: /download?code=CODE#key=KEY
            const link = `${window.location.origin}/download?code=${code}#key=${encodeURIComponent(exportedKey)}`
            setShareLink(link)
            setStatus('completed')

        } catch (err: any) {
            console.error('Upload failed:', err)
            setError(err.message || 'Upload failed')
            setStatus('error')
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Secure Cloud Drop</h2>

            {status === 'idle' || status === 'error' ? (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="cloud-upload"
                        />
                        <label htmlFor="cloud-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                <CloudIcon className="w-8 h-8" />
                                {file ? (
                                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{file.name}</span>
                                ) : (
                                    <span>Click to select a file</span>
                                )}
                            </div>
                        </label>
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <Button
                        onClick={handleUpload}
                        disabled={!file}
                        className="w-full"
                    >
                        Encrypt & Upload
                    </Button>
                </div>
            ) : null}

            {(status === 'encrypting' || status === 'uploading') && (
                <div className="text-center space-y-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
                    <p className="text-zinc-500">
                        {status === 'encrypting' ? 'Encrypting file...' : 'Uploading to secure storage...'}
                    </p>
                </div>
            )}

            {status === 'completed' && (
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium">File Uploaded!</h3>
                        <p className="text-sm text-zinc-500">Share this link to allow download.</p>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <button onClick={copyLink} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                        </button>
                    </div>

                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                        Note: The encryption key is in the link. Do not lose it! We do not store the key.
                    </div>

                    <Button onClick={() => {
                        setStatus('idle')
                        setFile(null)
                        setShareLink('')
                    }} variant="outline" className="w-full">
                        Upload Another
                    </Button>
                </div>
            )}

            <div className="mt-6 text-xs text-center text-zinc-400">
                Files are encrypted on your device before upload. We cannot see your files.
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input as InputField } from '@/components/ui/input'
import { Download, Link as LinkIcon } from 'lucide-react'

export default function CloudReceive() {
    const [link, setLink] = useState('')

    const handleDownload = () => {
        if (!link) return
        try {
            const url = new URL(link)
            window.location.href = url.toString()
        } catch (e) {
            alert('Invalid URL')
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Receive Cloud Drop</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-zinc-500">Paste the share link here:</label>
                    <div className="flex gap-2">
                        <InputField
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                        <Button onClick={handleDownload} disabled={!link}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="text-xs text-center text-zinc-400">
                    The link contains the secure decryption key.
                </div>
            </div>
        </div>
    )
}

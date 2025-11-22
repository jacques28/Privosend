'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { PeerConnection } from '@/lib/webrtc'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check } from 'lucide-react'
import { RealtimeChannel } from '@supabase/supabase-js'

export default function P2PSender() {
    const [roomCode, setRoomCode] = useState<string>('')
    const [status, setStatus] = useState<'idle' | 'waiting' | 'connected' | 'sending' | 'completed'>('idle')
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [copied, setCopied] = useState(false)

    const peerRef = useRef<PeerConnection | null>(null)
    const channelRef = useRef<RealtimeChannel | null>(null)

    useEffect(() => {
        return () => {
            peerRef.current?.close()
            channelRef.current?.unsubscribe()
        }
    }, [])

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    const startSession = async () => {
        if (!file) return

        const code = generateCode()
        setRoomCode(code)
        setStatus('waiting')

        // Initialize WebRTC Peer
        peerRef.current = new PeerConnection(async (candidate) => {
            if (channelRef.current) {
                await channelRef.current.send({
                    type: 'broadcast',
                    event: 'ice-candidate',
                    payload: candidate,
                })
            }
        })

        // Create Data Channel
        peerRef.current.createDataChannel('file-transfer',
            (message) => {
                // Handle messages from receiver if needed
            },
            () => {
                setStatus('connected')
                sendFile()
            }
        )

        // Initialize Supabase Realtime
        channelRef.current = supabase.channel(`room-${code}`)

        channelRef.current
            .on('broadcast', { event: 'answer' }, async ({ payload }: { payload: RTCSessionDescriptionInit }) => {
                if (peerRef.current) {
                    await peerRef.current.setRemoteDescription(payload)
                }
            })
            .on('broadcast', { event: 'ice-candidate' }, async ({ payload }: { payload: RTCIceCandidateInit }) => {
                if (peerRef.current) {
                    await peerRef.current.addIceCandidate(payload)
                }
            })
            .on('presence', { event: 'join' }, async () => {
                // When receiver joins, create offer
                if (peerRef.current) {
                    const offer = await peerRef.current.createOffer()
                    await channelRef.current?.send({
                        type: 'broadcast',
                        event: 'offer',
                        payload: offer,
                    })
                }
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    // Wait for receiver
                }
            })
    }

    const sendFile = async () => {
        if (!file || !peerRef.current) return
        setStatus('sending')

        const CHUNK_SIZE = 16384 // 16KB
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
        let currentChunk = 0

        // Send metadata first
        peerRef.current.send(JSON.stringify({
            type: 'metadata',
            name: file.name,
            size: file.size,
            mime: file.type
        }))

        const reader = new FileReader()

        const readNextChunk = () => {
            const start = currentChunk * CHUNK_SIZE
            const end = Math.min(start + CHUNK_SIZE, file.size)
            reader.readAsArrayBuffer(file.slice(start, end))
        }

        reader.onload = (e) => {
            if (peerRef.current && e.target?.result) {
                peerRef.current.send(e.target.result)
                currentChunk++
                setProgress(Math.round((currentChunk / totalChunks) * 100))

                if (currentChunk < totalChunks) {
                    // Use setTimeout to avoid blocking UI and allow buffer to clear
                    setTimeout(readNextChunk, 0)
                } else {
                    setStatus('completed')
                    peerRef.current.send(JSON.stringify({ type: 'complete' }))
                }
            }
        }

        readNextChunk()
    }

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Direct P2P Share</h2>

            {status === 'idle' && (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-zinc-500 dark:text-zinc-400">
                                {file ? (
                                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{file.name}</span>
                                ) : (
                                    <span>Click to select a file</span>
                                )}
                            </div>
                        </label>
                    </div>
                    <Button
                        onClick={startSession}
                        disabled={!file}
                        className="w-full"
                    >
                        Generate Share Code
                    </Button>
                </div>
            )}

            {status === 'waiting' && (
                <div className="text-center space-y-4">
                    <div className="text-sm text-zinc-500">Share this code with the receiver</div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="text-4xl font-mono font-bold tracking-wider">{roomCode}</div>
                        <button onClick={copyCode} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-zinc-500" />}
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Waiting for connection...
                    </div>
                </div>
            )}

            {status === 'sending' && (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Sending {file?.name}...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black dark:bg-white transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {status === 'completed' && (
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium">Transfer Complete!</h3>
                    <Button onClick={() => {
                        setStatus('idle')
                        setFile(null)
                        setRoomCode('')
                        setProgress(0)
                    }} variant="outline">
                        Send Another File
                    </Button>
                </div>
            )}

            <div className="mt-6 text-xs text-center text-zinc-400">
                Files are transferred directly between devices and never stored on our servers.
            </div>
        </div>
    )
}

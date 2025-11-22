'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { PeerConnection } from '@/lib/webrtc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Download, Check } from 'lucide-react'
import { RealtimeChannel } from '@supabase/supabase-js'

export default function P2PReceiver() {
    const [roomCode, setRoomCode] = useState('')
    const [status, setStatus] = useState<'idle' | 'connecting' | 'receiving' | 'completed'>('idle')
    const [progress, setProgress] = useState(0)
    const [fileMeta, setFileMeta] = useState<{ name: string, size: number, mime: string } | null>(null)

    const peerRef = useRef<PeerConnection | null>(null)
    const channelRef = useRef<RealtimeChannel | null>(null)
    const receivedChunks = useRef<ArrayBuffer[]>([])
    const receivedSize = useRef(0)

    useEffect(() => {
        return () => {
            peerRef.current?.close()
            channelRef.current?.unsubscribe()
        }
    }, [])

    const joinSession = async () => {
        if (!roomCode) return
        setStatus('connecting')

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

        peerRef.current.peer.ondatachannel = (event: RTCDataChannelEvent) => {
            peerRef.current?.setDataChannel(event.channel, handleDataMessage, () => {
                // Channel open
            })
        }

        // Initialize Supabase Realtime
        channelRef.current = supabase.channel(`room-${roomCode}`)

        channelRef.current
            .on('broadcast', { event: 'offer' }, async ({ payload }: { payload: RTCSessionDescriptionInit }) => {
                if (peerRef.current) {
                    const answer = await peerRef.current.createAnswer(payload)
                    await channelRef.current?.send({
                        type: 'broadcast',
                        event: 'answer',
                        payload: answer,
                    })
                }
            })
            .on('broadcast', { event: 'ice-candidate' }, async ({ payload }: { payload: RTCIceCandidateInit }) => {
                if (peerRef.current) {
                    await peerRef.current.addIceCandidate(payload)
                }
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    // Signal ready to sender
                    await channelRef.current?.send({
                        type: 'broadcast',
                        event: 'ready',
                        payload: {},
                    })
                }
            })
    }

    const handleDataMessage = (data: any) => {
        if (typeof data === 'string') {
            const message = JSON.parse(data)
            if (message.type === 'metadata') {
                setFileMeta({ name: message.name, size: message.size, mime: message.mime })
                setStatus('receiving')
                receivedChunks.current = []
                receivedSize.current = 0
            } else if (message.type === 'complete') {
                saveFile()
                setStatus('completed')
            }
        } else {
            // Binary chunk
            receivedChunks.current.push(data)
            receivedSize.current += data.byteLength
            if (fileMeta) {
                setProgress(Math.round((receivedSize.current / fileMeta.size) * 100))
            }
        }
    }

    const saveFile = () => {
        if (!fileMeta) return
        const blob = new Blob(receivedChunks.current, { type: fileMeta.mime })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileMeta.name
        document.body.appendChild(a) // Append to body
        a.click()
        document.body.removeChild(a) // Remove after click
        URL.revokeObjectURL(url)
    }

    const handleManualDownload = () => {
        saveFile()
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Receive File</h2>

            {status === 'idle' && (
                <div className="space-y-4">
                    <Input
                        placeholder="Enter 6-digit code"
                        value={roomCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest font-mono"
                    />
                    <Button
                        onClick={joinSession}
                        disabled={roomCode.length !== 6}
                        className="w-full"
                    >
                        Connect & Download
                    </Button>
                </div>
            )}

            {status === 'connecting' && (
                <div className="text-center space-y-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
                    <p className="text-zinc-500">Connecting to sender...</p>
                </div>
            )}

            {status === 'receiving' && (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Receiving {fileMeta?.name}...</span>
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
                    <h3 className="text-lg font-medium">Download Complete!</h3>
                    <p className="text-sm text-zinc-500">File has been saved to your device.</p>

                    <Button onClick={handleManualDownload} variant="secondary" className="w-full mb-2">
                        <Download className="w-4 h-4 mr-2" /> Download Again
                    </Button>

                    <Button onClick={() => {
                        setStatus('idle')
                        setRoomCode('')
                        setProgress(0)
                        setFileMeta(null)
                        receivedChunks.current = []
                    }} variant="outline" className="w-full">
                        Receive Another
                    </Button>
                </div>
            )}

            <div className="mt-6 text-xs text-center text-zinc-400">
                Secure P2P connection. No server storage.
            </div>
        </div>
    )
}

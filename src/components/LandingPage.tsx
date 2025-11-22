'use client'

import { useState } from 'react'
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import BlogSection from "@/components/BlogSection"
import Footer from "@/components/Footer"
import ModeSelection from "@/components/ModeSelection"
import ComparisonTable from "@/components/ComparisonTable"
import P2PReceiver from "@/components/P2PReceiver"
import P2PSender from "@/components/P2PSender"
import CloudUpload from "@/components/CloudUpload"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

import CloudReceive from "@/components/CloudReceive"

export default function LandingPage() {
    const [activeMode, setActiveMode] = useState<'p2p' | 'cloud' | null>(null)
    const [p2pRole, setP2pRole] = useState<'send' | 'receive'>('send')
    const [cloudRole, setCloudRole] = useState<'send' | 'receive'>('send')

    const scrollToModeSelection = () => {
        const element = document.getElementById('mode-selection')
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    if (activeMode) {
        return (
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setActiveMode(null)
                            setP2pRole('send')
                            setCloudRole('send')
                        }}
                        className="mb-8 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>

                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        {activeMode === 'p2p' ? (
                            <div className="w-full max-w-md space-y-6">
                                <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <button
                                        onClick={() => setP2pRole('send')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${p2pRole === 'send'
                                            ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        Send File
                                    </button>
                                    <button
                                        onClick={() => setP2pRole('receive')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${p2pRole === 'receive'
                                            ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        Receive File
                                    </button>
                                </div>
                                {p2pRole === 'send' ? <P2PSender /> : <P2PReceiver />}
                            </div>
                        ) : (
                            <div className="w-full max-w-md space-y-6">
                                <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <button
                                        onClick={() => setCloudRole('send')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${cloudRole === 'send'
                                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        onClick={() => setCloudRole('receive')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${cloudRole === 'receive'
                                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        Download File
                                    </button>
                                </div>
                                {cloudRole === 'send' ? <CloudUpload /> : <CloudReceive />}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <Hero onStartClick={scrollToModeSelection} />
                <div id="mode-selection">
                    <ModeSelection onSelectMode={setActiveMode} />
                </div>
                <ComparisonTable />
                <HowItWorks />
                <Features />
                <BlogSection />
            </main>
            <Footer />
        </div>
    )
}

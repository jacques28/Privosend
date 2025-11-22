'use client'

import { useState } from 'react'
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import BlogSection from "@/components/BlogSection"
import Footer from "@/components/Footer"
import ModeSelection from "@/components/ModeSelection"
import ComparisonTable from "@/components/ComparisonTable"
import P2PSender from "@/components/P2PSender"
import CloudUpload from "@/components/CloudUpload"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LandingPage() {
    const [activeMode, setActiveMode] = useState<'p2p' | 'cloud' | null>(null)

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
                        onClick={() => setActiveMode(null)}
                        className="mb-8 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>

                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        {activeMode === 'p2p' ? <P2PSender /> : <CloudUpload />}
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

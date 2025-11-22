"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 max-w-3xl"
                    >
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Secure & Anonymous File Sharing
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Share Files simply. <br />
                            <span className="text-primary">Without a trace.</span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Upload your file, get a secure link, and share. No accounts, no tracking, just privacy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/upload">
                            <Button size="lg" className="h-12 px-8 text-base">
                                Start Sharing <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                Learn More
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-muted-foreground max-w-3xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <span>End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <span>Lightning Fast</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <span>No Logs Kept</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
            </div>
        </section>
    )
}

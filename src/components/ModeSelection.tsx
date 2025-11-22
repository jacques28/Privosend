'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Cloud, Shield, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModeSelectionProps {
    onSelectMode: (mode: 'p2p' | 'cloud') => void
}

export default function ModeSelection({ onSelectMode }: ModeSelectionProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Choose Your Transfer Mode</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
                    Select the method that best fits your needs. Both are secure, private, and free.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* P2P Mode Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden"
                    onClick={() => onSelectMode('p2p')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-32 h-32 text-blue-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6" />
                        </div>

                        <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Direct Send (P2P)</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 h-12">
                            Zero Cloud. Zero Storage. Maximum Privacy. Transfer directly between devices.
                        </p>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Shield className="w-4 h-4 text-blue-500" />
                                <span>No server storage</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span>Real-time transfer</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Lock className="w-4 h-4 text-blue-500" />
                                <span>End-to-end encrypted</span>
                            </li>
                        </ul>

                        <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
                            Start P2P Transfer <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Cloud Mode Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden"
                    onClick={() => onSelectMode('cloud')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Cloud className="w-32 h-32 text-purple-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                            <Cloud className="w-6 h-6" />
                        </div>

                        <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Secure Cloud Drop</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 h-12">
                            Encrypted Storage. Anonymous. Auto-Deleting. Upload once, share link anywhere.
                        </p>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Lock className="w-4 h-4 text-purple-500" />
                                <span>Client-side encryption</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Cloud className="w-4 h-4 text-purple-500" />
                                <span>24-hour auto-deletion</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <Shield className="w-4 h-4 text-purple-500" />
                                <span>Share via link</span>
                            </li>
                        </ul>

                        <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium group-hover:gap-3 transition-all">
                            Start Cloud Upload <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

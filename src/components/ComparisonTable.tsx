'use client'

import { Check, X, Zap, Cloud } from 'lucide-react'

export default function ComparisonTable() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Which Mode is Right for You?</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">Compare our two secure sharing methods.</p>
                </div>

                <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                    <div className="grid grid-cols-3 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="font-semibold text-zinc-500 dark:text-zinc-400">Feature</div>
                        <div className="flex items-center justify-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                            <Zap className="w-5 h-5" /> P2P Direct
                        </div>
                        <div className="flex items-center justify-center gap-2 font-bold text-purple-600 dark:text-purple-400">
                            <Cloud className="w-5 h-5" /> Cloud Drop
                        </div>
                    </div>

                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {[
                            { feature: 'Storage Location', p2p: 'None (Device-to-Device)', cloud: 'Encrypted Cloud Storage' },
                            { feature: 'File Size Limit', p2p: 'Unlimited', cloud: '500MB (Free Tier)' },
                            { feature: 'Privacy', p2p: 'Maximum (No Server)', cloud: 'High (Client-Side Encrypted)' },
                            { feature: 'Transfer Speed', p2p: 'Real-time (Network Dependent)', cloud: 'Fast Upload/Download' },
                            { feature: 'Recipient Online?', p2p: 'Must be online', cloud: 'Can download later' },
                            { feature: 'Expiration', p2p: 'Instant (Session End)', cloud: '24 Hours' },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-3 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">{row.feature}</div>
                                <div className="text-center text-zinc-600 dark:text-zinc-400 text-sm">{row.p2p}</div>
                                <div className="text-center text-zinc-600 dark:text-zinc-400 text-sm">{row.cloud}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

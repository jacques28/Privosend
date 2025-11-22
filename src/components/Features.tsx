"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, Lock, EyeOff, Globe, Server } from "lucide-react"

const features = [
    {
        icon: ShieldCheck,
        title: "Bank-Grade Encryption",
        description: "Your files are encrypted with AES-256 before they even leave your device.",
    },
    {
        icon: EyeOff,
        title: "Complete Anonymity",
        description: "We don't track you. No cookies, no logs, no personal data stored.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized global servers ensure your uploads and downloads are blazing fast.",
    },
    {
        icon: Lock,
        title: "Self-Destructing Links",
        description: "Set your files to automatically delete after download or a set time.",
    },
    {
        icon: Globe,
        title: "Access Anywhere",
        description: "Share files across any device or platform with a simple link.",
    },
    {
        icon: Server,
        title: "Secure Infrastructure",
        description: "Hosted on secure, compliant servers with 24/7 monitoring.",
    },
]

export default function Features() {
    return (
        <section className="py-24">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Why choose PrivoSend?
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        We prioritize your privacy and security above all else.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col space-y-2 p-6 rounded-xl hover:bg-secondary/50 transition-colors"
                        >
                            <feature.icon className="h-10 w-10 text-primary mb-2" />
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

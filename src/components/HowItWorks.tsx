"use client"

import { motion } from "framer-motion"
import { User, Upload, Key } from "lucide-react"

const steps = [
    {
        icon: User,
        title: "Enter Name",
        description: "Start by entering a name. No account creation needed.",
    },
    {
        icon: Upload,
        title: "Upload File",
        description: "Drag and drop your file. We encrypt it instantly.",
    },
    {
        icon: Key,
        title: "Get Code",
        description: "Share the unique code or link with your recipient.",
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-secondary/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        How it works
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Sharing files shouldn't be complicated. We made it as simple as 1-2-3.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center space-y-4 bg-background p-6 rounded-xl shadow-sm border relative z-10"
                        >
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

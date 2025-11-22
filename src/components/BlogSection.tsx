"use client"

import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const articles = [
    {
        title: "Why Privacy Matters in 2024",
        excerpt: "In an age of surveillance, keeping your data private is more important than ever.",
        date: "Oct 12, 2024",
        category: "Privacy",
        slug: "why-privacy-matters",
    },
    {
        title: "How End-to-End Encryption Works",
        excerpt: "A deep dive into the technology that keeps your files safe from prying eyes.",
        date: "Oct 08, 2024",
        category: "Technology",
        slug: "how-encryption-works",
    },
    {
        title: "The Future of File Sharing",
        excerpt: "What's next for secure, anonymous file transfer? Here are our predictions.",
        date: "Sep 25, 2024",
        category: "Trends",
        slug: "future-of-file-sharing",
    },
]

export default function BlogSection() {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            Latest from our blog
                        </h2>
                        <p className="text-muted-foreground max-w-[600px]">
                            Stay updated with the latest news, tips, and insights on privacy and security.
                        </p>
                    </div>
                    <Link href="/blog">
                        <Button variant="outline">
                            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col space-y-4"
                        >
                            <div className="aspect-video rounded-xl bg-muted overflow-hidden">
                                {/* Placeholder for blog image */}
                                <div className="w-full h-full bg-gradient-to-br from-muted to-secondary group-hover:scale-105 transition-transform duration-300"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-primary">{article.category}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {article.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                                </h3>
                                <p className="text-muted-foreground line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}

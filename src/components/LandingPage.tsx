import Hero from "@/components/Hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import BlogSection from "@/components/BlogSection"
import Footer from "@/components/Footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <Hero />
                <HowItWorks />
                <Features />
                <BlogSection />
            </main>
            <Footer />
        </div>
    )
}

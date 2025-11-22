import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BlogPost({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4">
            <h1 className="text-4xl font-bold">Article: {params.slug}</h1>
            <p className="text-muted-foreground">This article is coming soon.</p>
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </Link>
        </div>
    )
}

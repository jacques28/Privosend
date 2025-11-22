import Link from "next/link"

export default function Footer() {
    return (
        <footer className="py-12 border-t bg-secondary/20">
            <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="h-6 w-6 rounded bg-primary"></span>
                        PrivoSend
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} PrivoSend. All rights reserved.
                    </p>
                </div>

                <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Blog
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

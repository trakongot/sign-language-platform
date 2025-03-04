import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SignLingo</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/learn" className="text-sm font-medium transition-colors hover:text-primary">
              Learn
            </Link>
            <Link href="/translate" className="text-sm font-medium transition-colors hover:text-primary">
              Translate
            </Link>
            <Link href="/text-to-sign" className="text-sm font-medium transition-colors hover:text-primary">
              Text to Sign
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild>
            <Link href="/learn">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}


'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogIn, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    // { href: '/learn', label: 'Learn' },
    { href: '/translate', label: 'Translate' },
    // { href: '/text-to-sign', label: 'Text to Sign' },
    { href: '/dictionary', label: 'Dictionary' },
    // { href: '/community', label: 'Community' },
    // { href: '/statistics', label: 'Statistics' },
    // { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">VSL</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.slice(0, 5).map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex gap-2">
            {/* <Button variant="ghost" asChild>
              <Link href="/ai-chat">AI Chat</Link>
            </Button> */}
            {/* <Button variant="outline" asChild>
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Link>
            </Button> */}
            {/* <Button asChild>
              <Link href="/learn">Start Learning</Link>
            </Button> */}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col gap-6 px-2">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-bold text-xl">VSL</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === route.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link href="/learn">Start Learning</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/settings">Settings</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

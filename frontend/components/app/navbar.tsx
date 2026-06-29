import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { OwlCluster } from "@/components/app/owl-cluster";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/profile", label: "Profile" },
  { href: "/analyze", label: "Menu Analysis" },
  { href: "/saved", label: "Saved" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/30 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4 md:gap-4 md:px-6 md:py-4">
        <Link href="/" className="shrink-0 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
          PlateWise
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-lg text-muted-foreground transition hover:text-foreground md:text-xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <OwlCluster compact />
          </div>
          <Button variant="outline" size="sm" asChild className="h-9 px-3 text-sm md:px-4 md:text-lg">
            <Link href="/login">
              <LogIn className="h-4 w-4 md:hidden" />
              <span className="hidden sm:inline">Log in</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="h-9 px-3 text-sm md:px-4 md:text-lg">
            <Link href="/signup">
              <UserPlus className="h-4 w-4 md:hidden" />
              <span className="hidden sm:inline">Sign up</span>
            </Link>
          </Button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 pb-3 sm:px-4 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-border bg-white/75 px-3 py-2 text-sm font-semibold text-muted-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

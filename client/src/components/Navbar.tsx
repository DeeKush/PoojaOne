import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <span className="text-2xl font-bold font-serif" style={{ color: 'hsl(var(--primary))' }}>
              PoojaOne
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" data-testid="link-nav-home">
              <span className="text-sm font-medium hover-elevate px-3 py-2 rounded-md cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/check-availability" data-testid="link-nav-book">
              <Button data-testid="button-nav-cta">Check Availability</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Link href="/check-availability" data-testid="button-nav-cta-mobile">
              <Button size="sm">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

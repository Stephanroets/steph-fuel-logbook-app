import { Button } from "@/components/ui/button"
import { Car, TrendingDown, FileText, Lock } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.04),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FuelLog</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Track Your Fuel Consumption with Precision
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Monitor your vehicle&apos;s fuel efficiency, manage expenses in South African Rand, and keep detailed
              records for SARS tax purposes. Perfect for professionals tracking business mileage.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Start Tracking Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30 py-24 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need</h2>
              <p className="mt-4 text-muted-foreground">
                Comprehensive fuel tracking designed for South African drivers
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fuel Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate km/L consumption tank-to-tank for each vehicle
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Receipt Storage</h3>
                <p className="text-sm text-muted-foreground">Upload and store receipt images for every fuel entry</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">SARS Compliant</h3>
                <p className="text-sm text-muted-foreground">Track work travel separately for tax deduction purposes</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Vehicle</h3>
                <p className="text-sm text-muted-foreground">
                  Manage multiple vehicles with separate tracking for each
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FuelLog. Track smarter, save more.</p>
        </div>
      </footer>
    </div>
  )
}

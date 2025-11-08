import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserNav } from "@/components/user-nav"
import { Car, ArrowLeft, FileDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FuelEntryList } from "@/components/fuel-entries/fuel-entry-list"
import { AddFuelEntryDialog } from "@/components/fuel-entries/add-fuel-entry-dialog"
import { VehicleAnalytics } from "@/components/analytics/vehicle-analytics"
import { ExportLogbookDialog } from "@/components/export/export-logbook-dialog"

interface VehiclePageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch vehicle
  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (vehicleError || !vehicle) {
    notFound()
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FuelLog</span>
          </Link>
          <UserNav user={{ email: user.email, full_name: profile?.full_name }} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight break-words">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-muted-foreground mt-2">
                {vehicle.registration_number} • {vehicle.year}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Export button */}
              <ExportLogbookDialog vehicleId={id}>
                <Button variant="outline" size="lg">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </ExportLogbookDialog>
              <AddFuelEntryDialog vehicleId={id}>
                <Button size="lg">Add Fuel Entry</Button>
              </AddFuelEntryDialog>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mb-8">
            <VehicleAnalytics vehicleId={id} userId={user.id} />
          </div>

          <FuelEntryList vehicleId={id} userId={user.id} />
        </div>
      </main>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, FileText, TrendingDown } from "lucide-react"
import Link from "next/link"
import type { Vehicle } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/server"

interface VehicleCardProps {
  vehicle: Vehicle
  entryCount: number
}

async function getVehicleStats(vehicleId: string) {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from("fuel_entries")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("entry_date", { ascending: true })

  if (!entries || entries.length < 2) {
    return { averageConsumption: null }
  }

  let totalConsumption = 0
  let count = 0

  for (let i = 1; i < entries.length; i++) {
    const distance = entries[i].odometer_reading - entries[i - 1].odometer_reading
    if (distance > 0 && entries[i].liters > 0) {
      totalConsumption += distance / entries[i].liters
      count++
    }
  }

  return {
    averageConsumption: count > 0 ? totalConsumption / count : null,
  }
}

export async function VehicleCard({ vehicle, entryCount }: VehicleCardProps) {
  const stats = await getVehicleStats(vehicle.id)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {vehicle.make} {vehicle.model}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{vehicle.registration_number}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{entryCount} entries</span>
          </div>
          {stats.averageConsumption !== null && (
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="h-4 w-4" />
              <span className="font-semibold">{stats.averageConsumption.toFixed(2)} km/L</span>
            </div>
          )}
        </div>
        <Button asChild className="w-full">
          <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, DollarSign, Droplet, Briefcase, Calendar } from "lucide-react"
import type { FuelEntry } from "@/lib/types/database"

interface VehicleAnalyticsProps {
  vehicleId: string
  userId: string
}

interface AnalyticsData {
  averageConsumption: number | null
  totalSpent: number
  totalLiters: number
  totalDistance: number
  workDistance: number
  entryCount: number
  averagePricePerLiter: number
  lastFillDate: string | null
}

async function calculateAnalytics(entries: FuelEntry[]): Promise<AnalyticsData> {
  if (entries.length === 0) {
    return {
      averageConsumption: null,
      totalSpent: 0,
      totalLiters: 0,
      totalDistance: 0,
      workDistance: 0,
      entryCount: 0,
      averagePricePerLiter: 0,
      lastFillDate: null,
    }
  }

  // Sort entries by date (oldest first)
  const sortedEntries = [...entries].sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())

  let totalConsumption = 0
  let consumptionCount = 0
  let totalSpent = 0
  let totalLiters = 0
  let totalDistance = 0
  let workDistance = 0

  // Calculate consumption for each pair of consecutive entries
  for (let i = 1; i < sortedEntries.length; i++) {
    const current = sortedEntries[i]
    const previous = sortedEntries[i - 1]

    const distance = current.odometer_reading - previous.odometer_reading

    if (distance > 0 && current.liters > 0) {
      const consumption = distance / current.liters
      totalConsumption += consumption
      consumptionCount++
      totalDistance += distance
    }

    totalSpent += current.total_cost
    totalLiters += current.liters

    if (current.is_work_travel && current.work_km) {
      workDistance += current.work_km
    }
  }

  // Add first entry's cost and liters
  totalSpent += sortedEntries[0].total_cost
  totalLiters += sortedEntries[0].liters
  if (sortedEntries[0].is_work_travel && sortedEntries[0].work_km) {
    workDistance += sortedEntries[0].work_km
  }

  const averageConsumption = consumptionCount > 0 ? totalConsumption / consumptionCount : null
  const averagePricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0
  const lastFillDate = sortedEntries[sortedEntries.length - 1].entry_date

  return {
    averageConsumption,
    totalSpent,
    totalLiters,
    totalDistance,
    workDistance,
    entryCount: entries.length,
    averagePricePerLiter,
    lastFillDate,
  }
}

export async function VehicleAnalytics({ vehicleId, userId }: VehicleAnalyticsProps) {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from("fuel_entries")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .eq("user_id", userId)
    .order("entry_date", { ascending: true })

  const analytics = await calculateAnalytics(entries || [])

  if (analytics.entryCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Add at least 2 fuel entries to see consumption analytics</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Average Consumption */}
        {analytics.averageConsumption !== null && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Consumption</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.averageConsumption.toFixed(2)} km/L</div>
              <p className="text-xs text-muted-foreground mt-1">Based on {analytics.entryCount - 1} fill-ups</p>
            </CardContent>
          </Card>
        )}

        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R {analytics.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {analytics.entryCount} entries</p>
          </CardContent>
        </Card>

        {/* Total Distance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDistance.toFixed(0)} km</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics.totalLiters.toFixed(1)} L consumed</p>
          </CardContent>
        </Card>

        {/* Work Travel */}
        {analytics.workDistance > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Travel</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.workDistance.toFixed(0)} km</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((analytics.workDistance / analytics.totalDistance) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        )}

        {/* Average Price per Liter */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price/Liter</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R {analytics.averagePricePerLiter.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average fuel price</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      {analytics.averageConsumption !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Fuel Efficiency Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost per kilometer:</span>
              <span className="font-semibold">R {(analytics.totalSpent / analytics.totalDistance).toFixed(2)}/km</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated range per tank (50L):</span>
              <span className="font-semibold">{(analytics.averageConsumption * 50).toFixed(0)} km</span>
            </div>
            {analytics.workDistance > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Work travel cost:</span>
                <span className="font-semibold">
                  R {((analytics.workDistance / analytics.totalDistance) * analytics.totalSpent).toFixed(2)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

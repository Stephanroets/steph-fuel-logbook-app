import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { VehicleCard } from "./vehicle-card"
import { AddVehicleDialog } from "./add-vehicle-dialog"

interface VehicleListProps {
  userId: string
}

export async function VehicleList({ userId }: VehicleListProps) {
  const supabase = await createClient()

  // Fetch vehicles with fuel entry stats
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select(`
      *,
      fuel_entries(count)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!vehicles || vehicles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Vehicles Yet</CardTitle>
          <CardDescription>Add your first vehicle to start tracking fuel consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <AddVehicleDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </AddVehicleDialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Vehicles</h2>
        <AddVehicleDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </AddVehicleDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} entryCount={vehicle.fuel_entries?.[0]?.count || 0} />
        ))}
      </div>
    </div>
  )
}

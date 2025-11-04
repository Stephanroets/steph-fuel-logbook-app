import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FuelEntryCard } from "./fuel-entry-card"
import { Plus } from "lucide-react"
import { AddFuelEntryDialog } from "./add-fuel-entry-dialog"
import { Button } from "@/components/ui/button"

interface FuelEntryListProps {
  vehicleId: string
  userId: string
}

export async function FuelEntryList({ vehicleId, userId }: FuelEntryListProps) {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from("fuel_entries")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Fuel Entries Yet</CardTitle>
          <CardDescription>Add your first fuel entry to start tracking consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <AddFuelEntryDialog vehicleId={vehicleId}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add First Entry
            </Button>
          </AddFuelEntryDialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {entries.map((entry, index) => {
          const previousEntry = entries[index + 1]
          return <FuelEntryCard key={entry.id} entry={entry} previousEntry={previousEntry} />
        })}
      </div>

      <div className="flex justify-center pt-4">
        <AddFuelEntryDialog vehicleId={vehicleId}>
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Another Entry
          </Button>
        </AddFuelEntryDialog>
      </div>
    </div>
  )
}

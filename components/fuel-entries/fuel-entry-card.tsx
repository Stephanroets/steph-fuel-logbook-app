"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Droplet, DollarSign, MapPin, Briefcase, Lock, Unlock, Trash2, ImageIcon, Pencil } from "lucide-react"
import type { FuelEntry } from "@/lib/types/database"
import { format } from "date-fns"
import { DeleteFuelEntryDialog } from "./delete-fuel-entry-dialog"
import { LockFuelEntryDialog } from "./lock-fuel-entry-dialog"
import { EditFuelEntryDialog } from "./edit-fuel-entry-dialog"
import { useState } from "react"

interface FuelEntryCardProps {
  entry: FuelEntry
  previousEntry?: FuelEntry
}

export function FuelEntryCard({ entry, previousEntry }: FuelEntryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate km/L if we have a previous entry
  let consumption: number | null = null
  let distance: number | null = null

  if (previousEntry) {
    distance = entry.odometer_reading - previousEntry.odometer_reading
    if (distance > 0 && entry.liters > 0) {
      consumption = distance / entry.liters
    }
  }

  console.log("[v0] Rendering fuel entry card:", {
    entryId: entry.id,
    isLocked: entry.is_locked,
    showDeleteButton: !entry.is_locked,
  })

  return (
    <Card className={entry.is_locked ? "border-primary/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold">{format(new Date(entry.entry_date), "dd MMM yyyy")}</span>
              {entry.is_locked && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Badge>
              )}
              {entry.is_work_travel && (
                <Badge variant="outline" className="gap-1">
                  <Briefcase className="h-3 w-3" />
                  Work Travel
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Odometer: {entry.odometer_reading.toLocaleString()} km</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <LockFuelEntryDialog entryId={entry.id} isLocked={entry.is_locked}>
              <Button variant="ghost" size="icon" title={entry.is_locked ? "Unlock entry" : "Lock entry"}>
                {entry.is_locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
            </LockFuelEntryDialog>
            {!entry.is_locked && (
              <EditFuelEntryDialog entry={entry}>
                <Button variant="ghost" size="icon" title="Edit entry">
                  <Pencil className="h-4 w-4" />
                </Button>
              </EditFuelEntryDialog>
            )}
            {!entry.is_locked && (
              <DeleteFuelEntryDialog entryId={entry.id} isLocked={entry.is_locked} onDelete={() => setIsDeleting(true)}>
                <Button variant="ghost" size="icon" disabled={isDeleting} title="Delete entry">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DeleteFuelEntryDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <Droplet className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Liters</p>
              <p className="font-semibold">{entry.liters.toFixed(2)} L</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="font-semibold">R {entry.total_cost.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Price/Liter</p>
              <p className="font-semibold">R {entry.price_per_liter.toFixed(2)}</p>
            </div>
          </div>
          {consumption !== null && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 flex-shrink-0">
                <Droplet className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Consumption</p>
                <p className="font-semibold text-green-600">{consumption.toFixed(2)} km/L</p>
              </div>
            </div>
          )}
        </div>

        {distance !== null && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Distance since last fill: <span className="font-semibold text-foreground">{distance.toFixed(0)} km</span>
              {entry.is_work_travel && entry.work_km && (
                <span className="ml-2">
                  (Work: <span className="font-semibold text-foreground">{entry.work_km.toFixed(0)} km</span>)
                </span>
              )}
            </p>
          </div>
        )}

        {entry.petrol_station_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="break-words">{entry.petrol_station_name}</span>
          </div>
        )}

        {entry.receipt_url && (
          <div className="flex items-center gap-2 text-sm">
            <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a
              href={entry.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              View Receipt
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

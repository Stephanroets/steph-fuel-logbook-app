"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X, Loader2 } from "lucide-react"
import type { FuelEntry } from "@/lib/types/database"

interface EditFuelEntryDialogProps {
  entry: FuelEntry
  children: React.ReactNode
}

export function EditFuelEntryDialog({ entry, children }: EditFuelEntryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(entry.receipt_url)
  const [isUploading, setIsUploading] = useState(false)
  const [removeExistingReceipt, setRemoveExistingReceipt] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    entry_date: entry.entry_date,
    odometer_reading: entry.odometer_reading.toString(),
    liters: entry.liters.toString(),
    price_per_liter: entry.price_per_liter.toString(),
    petrol_station_name: entry.petrol_station_name || "",
    is_work_travel: entry.is_work_travel,
    work_km: entry.work_km?.toString() || "",
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        entry_date: entry.entry_date,
        odometer_reading: entry.odometer_reading.toString(),
        liters: entry.liters.toString(),
        price_per_liter: entry.price_per_liter.toString(),
        petrol_station_name: entry.petrol_station_name || "",
        is_work_travel: entry.is_work_travel,
        work_km: entry.work_km?.toString() || "",
      })
      setReceiptPreview(entry.receipt_url)
      setReceiptFile(null)
      setRemoveExistingReceipt(false)
      setError(null)
    }
  }, [open, entry])

  const totalCost =
    formData.liters && formData.price_per_liter
      ? (Number.parseFloat(formData.liters) * Number.parseFloat(formData.price_per_liter)).toFixed(2)
      : "0.00"

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      setReceiptFile(file)
      setRemoveExistingReceipt(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
    setRemoveExistingReceipt(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Starting fuel entry update:", {
        entryId: entry.id,
        isLocked: entry.is_locked,
        newLiters: formData.liters,
        newPricePerLiter: formData.price_per_liter,
        newTotalCost: totalCost,
      })

      // Check if entry is locked
      if (entry.is_locked) {
        throw new Error("Cannot edit a locked entry. Please unlock it first.")
      }

      let receiptUrl: string | null = entry.receipt_url

      // Handle receipt upload if new file selected
      if (receiptFile) {
        setIsUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", receiptFile)

        const uploadResponse = await fetch("/api/upload-receipt", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Failed to upload receipt")
        }

        const { url } = await uploadResponse.json()
        receiptUrl = url
        setIsUploading(false)
      } else if (removeExistingReceipt) {
        // Remove receipt if user clicked remove
        receiptUrl = null
      }

      const updateData = {
        entry_date: formData.entry_date,
        odometer_reading: Number.parseFloat(formData.odometer_reading),
        liters: Number.parseFloat(formData.liters),
        price_per_liter: Number.parseFloat(formData.price_per_liter),
        total_cost: Number.parseFloat(totalCost),
        petrol_station_name: formData.petrol_station_name || null,
        is_work_travel: formData.is_work_travel,
        work_km: formData.is_work_travel && formData.work_km ? Number.parseFloat(formData.work_km) : null,
        receipt_url: receiptUrl,
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Updating fuel entry with data:", updateData)

      const { data: updatedEntry, error: updateError } = await supabase
        .from("fuel_entries")
        .update(updateData)
        .eq("id", entry.id)
        .select()
        .single()

      if (updateError) {
        console.error("[v0] Failed to update fuel entry:", updateError)
        throw updateError
      }

      console.log("[v0] Successfully updated fuel entry:", updatedEntry)

      setOpen(false)

      router.refresh()

      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (err) {
      console.error("[v0] Error updating fuel entry:", err)
      setError(err instanceof Error ? err.message : "Failed to update fuel entry")
      setIsUploading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Fuel Entry</DialogTitle>
            <DialogDescription>Update your fuel entry details, receipt, or work travel kilometers</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="entry_date">Date</Label>
              <Input
                id="entry_date"
                type="date"
                value={formData.entry_date}
                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="odometer_reading">Odometer Reading (km)</Label>
              <Input
                id="odometer_reading"
                type="number"
                step="0.01"
                placeholder="e.g., 45000"
                value={formData.odometer_reading}
                onChange={(e) => setFormData({ ...formData, odometer_reading: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="liters">Liters</Label>
              <Input
                id="liters"
                type="number"
                step="0.01"
                placeholder="e.g., 45.5"
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price_per_liter">Price per Liter (ZAR)</Label>
              <Input
                id="price_per_liter"
                type="number"
                step="0.01"
                placeholder="e.g., 22.50"
                value={formData.price_per_liter}
                onChange={(e) => setFormData({ ...formData, price_per_liter: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">R {totalCost}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="petrol_station_name">Petrol Station (Optional)</Label>
              <Input
                id="petrol_station_name"
                type="text"
                placeholder="e.g., Shell, Engen"
                value={formData.petrol_station_name}
                onChange={(e) => setFormData({ ...formData, petrol_station_name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              {!receiptPreview ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                    disabled={isLoading}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={receiptPreview || "/placeholder.svg"}
                    alt="Receipt preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveReceipt}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {receiptFile
                  ? "New image will be converted to AVIF format and uploaded"
                  : entry.receipt_url && !removeExistingReceipt
                    ? "Current receipt shown above - upload new file to replace"
                    : "No receipt attached"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_work_travel"
                checked={formData.is_work_travel}
                onCheckedChange={(checked) => setFormData({ ...formData, is_work_travel: checked as boolean })}
                disabled={isLoading}
              />
              <Label htmlFor="is_work_travel" className="cursor-pointer">
                This is work travel (for SARS)
              </Label>
            </div>
            {formData.is_work_travel && (
              <div className="grid gap-2">
                <Label htmlFor="work_km">Work Travel Distance (km)</Label>
                <Input
                  id="work_km"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 150"
                  value={formData.work_km}
                  onChange={(e) => setFormData({ ...formData, work_km: e.target.value })}
                  required={formData.is_work_travel}
                  disabled={isLoading}
                />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isLoading ? (
                "Updating..."
              ) : (
                "Update Entry"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

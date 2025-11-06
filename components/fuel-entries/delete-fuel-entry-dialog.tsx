"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DeleteFuelEntryDialogProps {
  entryId: string
  isLocked: boolean
  children: React.ReactNode
  onDelete?: () => void
}

export function DeleteFuelEntryDialog({ entryId, isLocked, children, onDelete }: DeleteFuelEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (isLocked) {
      setError("Cannot delete a locked entry. Please unlock it first.")
      return
    }

    setIsDeleting(true)
    setError(null)

    const supabase = createClient()

    try {
      console.log("Attempting to delete entry:", { entryId, isLocked })

      const { error: deleteError } = await supabase.from("fuel_entries").delete().eq("id", entryId)

      console.log("Delete result:", { error: deleteError })

      if (deleteError) throw deleteError

      onDelete?.()
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Delete error:", err)
      setError(err instanceof Error ? err.message : "Failed to delete entry")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Fuel Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this fuel entry? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

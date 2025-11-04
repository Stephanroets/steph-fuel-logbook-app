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

interface LockFuelEntryDialogProps {
  entryId: string
  children: React.ReactNode
}

export function LockFuelEntryDialog({ entryId, children }: LockFuelEntryDialogProps) {
  const [isLocking, setIsLocking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLock = async () => {
    setIsLocking(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase.from("fuel_entries").update({ is_locked: true }).eq("id", entryId)

      if (updateError) throw updateError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lock entry")
    } finally {
      setIsLocking(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lock Fuel Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Locking this entry will prevent it from being edited or deleted. This is useful when you&apos;ve verified
            the information is correct. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLocking}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLock} disabled={isLocking}>
            {isLocking ? "Locking..." : "Lock Entry"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

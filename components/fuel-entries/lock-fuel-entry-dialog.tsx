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
  isLocked: boolean
  children: React.ReactNode
}

export function LockFuelEntryDialog({ entryId, isLocked, children }: LockFuelEntryDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleToggleLock = async () => {
    setIsProcessing(true)
    setError(null)

    const supabase = createClient()

    try {
      console.log("[v0] Toggling lock state:", { entryId, currentState: isLocked, newState: !isLocked })

      const { data, error: updateError } = await supabase
        .from("fuel_entries")
        .update({ is_locked: !isLocked })
        .eq("id", entryId)
        .select()

      console.log("[v0] Lock update result:", { data, error: updateError })

      if (updateError) throw updateError

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Lock toggle error:", err)
      setError(err instanceof Error ? err.message : `Failed to ${isLocked ? "unlock" : "lock"} entry`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isLocked ? "Unlock" : "Lock"} Fuel Entry</AlertDialogTitle>
          <AlertDialogDescription>
            {isLocked
              ? "Unlocking this entry will allow it to be edited or deleted again."
              : "Locking this entry will prevent it from being deleted. This is useful when you've verified the information is correct. You can unlock it later if needed."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggleLock} disabled={isProcessing}>
            {isProcessing ? `${isLocked ? "Unlocking" : "Locking"}...` : `${isLocked ? "Unlock" : "Lock"} Entry`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

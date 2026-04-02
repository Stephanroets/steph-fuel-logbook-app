"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Lightbulb } from "lucide-react"
import { UserGuideDialog } from "./user-guide-dialog"

interface WelcomeBannerProps {
  hasVehicles: boolean
}

export function WelcomeBanner({ hasVehicles }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem("welcome-banner-dismissed")
    if (isDismissed) {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("welcome-banner-dismissed", "true")
    setDismissed(true)
  }

  if (dismissed || hasVehicles) {
    return null
  }

  return (
    <Alert className="mb-6 border-primary/50 bg-primary/5">
      <Lightbulb className="h-5 w-5 text-primary" />
      <AlertTitle className="text-lg font-semibold mb-2">Welcome to FuelLog! 🚗</AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm">
          Let&apos;s get you started tracking your vehicle&apos;s fuel consumption. Here&apos;s what to do:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-sm ml-2">
          <li>Click the <strong>&quot;Add Vehicle&quot;</strong> button below to add your first vehicle</li>
          <li>Enter your vehicle details (make, model, year, and registration number)</li>
          <li>Start recording fuel entries every time you fill up</li>
          <li>Watch your fuel efficiency statistics appear automatically!</li>
        </ol>
        <div className="flex items-center gap-2 mt-4">
          <UserGuideDialog>
            <Button variant="outline" size="sm">
              View Full Guide
            </Button>
          </UserGuideDialog>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4 mr-1" />
            Got it, thanks!
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

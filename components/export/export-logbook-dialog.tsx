"use client"

import type React from "react"

import { useState } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Download, Loader2, CheckCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ExportLogbookDialogProps {
  vehicleId: string
  children: React.ReactNode
}

export function ExportLogbookDialog({ vehicleId, children }: ExportLogbookDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [method, setMethod] = useState<"email" | "download">("download")

  const handleExport = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/export-logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, method }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Export failed")
      }

      if (method === "email") {
        setSuccess("Logbook report sent to your email successfully!")
        setTimeout(() => {
          setOpen(false)
          setSuccess(null)
        }, 2000)
      } else {
        // Download HTML file
        const blob = new Blob([data.html], { type: "text/html" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `fuel-logbook-${new Date().toISOString().split("T")[0]}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess("Logbook report downloaded successfully!")
        setTimeout(() => {
          setOpen(false)
          setSuccess(null)
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Logbook</DialogTitle>
          <DialogDescription>Choose how you want to receive your fuel logbook report</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={method} onValueChange={(value) => setMethod(value as "email" | "download")}>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="download" id="download" />
              <Label htmlFor="download" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Download HTML</p>
                    <p className="text-sm text-muted-foreground">Save the report to your device</p>
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Report</p>
                    <p className="text-sm text-muted-foreground">Send to your registered email address</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : method === "email" ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

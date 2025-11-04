import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/mailer"
import { generateLogbookHTML } from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { vehicleId, method } = await request.json()

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 })
    }

    // Fetch vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .eq("user_id", user.id)
      .single()

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Fetch user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Fetch fuel entries
    const { data: entries } = await supabase
      .from("fuel_entries")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No fuel entries found" }, { status: 404 })
    }

    // Calculate analytics
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime(),
    )

    let totalConsumption = 0
    let consumptionCount = 0
    let totalSpent = 0
    let totalDistance = 0
    let workDistance = 0

    for (let i = 1; i < sortedEntries.length; i++) {
      const current = sortedEntries[i]
      const previous = sortedEntries[i - 1]
      const distance = current.odometer_reading - previous.odometer_reading

      if (distance > 0 && current.liters > 0) {
        totalConsumption += distance / current.liters
        consumptionCount++
        totalDistance += distance
      }

      totalSpent += current.total_cost

      if (current.is_work_travel && current.work_km) {
        workDistance += current.work_km
      }
    }

    totalSpent += sortedEntries[0].total_cost
    if (sortedEntries[0].is_work_travel && sortedEntries[0].work_km) {
      workDistance += sortedEntries[0].work_km
    }

    const analytics = {
      averageConsumption: consumptionCount > 0 ? totalConsumption / consumptionCount : null,
      totalSpent,
      totalDistance,
      workDistance,
    }

    // Generate HTML
    const html = generateLogbookHTML({
      userName: profile?.full_name || user.email || "User",
      vehicle,
      entries: entries.reverse(), // Show newest first in email
      analytics,
    })

    if (method === "email") {
      // Send email
      try {
        await sendEmail(user.email!, `Fuel Logbook Report - ${vehicle.make} ${vehicle.model}`, html)
        return NextResponse.json({ success: true, message: "Email sent successfully" })
      } catch (emailError) {
        console.error("[v0] Email error:", emailError)
        return NextResponse.json({ error: "Failed to send email. Please try downloading instead." }, { status: 500 })
      }
    } else if (method === "download") {
      // Return HTML for download
      return NextResponse.json({ success: true, html })
    } else {
      return NextResponse.json({ error: "Invalid export method" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Export failed" }, { status: 500 })
  }
}

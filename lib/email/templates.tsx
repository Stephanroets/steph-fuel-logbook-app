import type { FuelEntry, Vehicle } from "@/lib/types/database"
import { format } from "date-fns"

interface LogbookEmailData {
  userName: string
  vehicle: Vehicle
  entries: FuelEntry[]
  analytics: {
    averageConsumption: number | null
    totalSpent: number
    totalDistance: number
    workDistance: number
  }
}

export function generateLogbookHTML(data: LogbookEmailData): string {
  const { userName, vehicle, entries, analytics } = data

  const entriesHTML = entries
    .map((entry, index) => {
      const previousEntry = entries[index + 1]
      let consumption = null
      let distance = null

      if (previousEntry) {
        distance = entry.odometer_reading - previousEntry.odometer_reading
        if (distance > 0 && entry.liters > 0) {
          consumption = distance / entry.liters
        }
      }

      return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px;">${format(new Date(entry.entry_date), "dd MMM yyyy")}</td>
          <td style="padding: 12px 8px;">${entry.odometer_reading.toLocaleString()} km</td>
          <td style="padding: 12px 8px;">${entry.liters.toFixed(2)} L</td>
          <td style="padding: 12px 8px;">R ${entry.price_per_liter.toFixed(2)}</td>
          <td style="padding: 12px 8px;">R ${entry.total_cost.toFixed(2)}</td>
          <td style="padding: 12px 8px;">${consumption ? `${consumption.toFixed(2)} km/L` : "-"}</td>
          <td style="padding: 12px 8px;">${entry.petrol_station_name || "-"}</td>
          <td style="padding: 12px 8px;">${entry.is_work_travel ? `Yes (${entry.work_km?.toFixed(0)} km)` : "No"}</td>
        </tr>
      `
    })
    .join("")

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fuel Logbook Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="margin: 0 0 8px 0; color: #111827; font-size: 28px;">Fuel Logbook Report</h1>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">Generated on ${format(new Date(), "dd MMMM yyyy 'at' HH:mm")}</p>
    </div>

    <!-- User & Vehicle Info -->
    <div style="margin-bottom: 30px;">
      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px;">Vehicle Information</h2>
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px;">
        <p style="margin: 0 0 8px 0;"><strong>Owner:</strong> ${userName}</p>
        <p style="margin: 0 0 8px 0;"><strong>Vehicle:</strong> ${vehicle.make} ${vehicle.model} (${vehicle.year})</p>
        <p style="margin: 0;"><strong>Registration:</strong> ${vehicle.registration_number}</p>
      </div>
    </div>

    <!-- Analytics Summary -->
    <div style="margin-bottom: 30px;">
      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px;">Summary Statistics</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        ${
          analytics.averageConsumption !== null
            ? `
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 6px; border-left: 4px solid #22c55e;">
          <p style="margin: 0 0 4px 0; color: #166534; font-size: 12px; font-weight: 600; text-transform: uppercase;">Avg Consumption</p>
          <p style="margin: 0; color: #166534; font-size: 24px; font-weight: bold;">${analytics.averageConsumption.toFixed(2)} km/L</p>
        </div>
        `
            : ""
        }
        <div style="background-color: #fef3c7; padding: 16px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 4px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase;">Total Spent</p>
          <p style="margin: 0; color: #92400e; font-size: 24px; font-weight: bold;">R ${analytics.totalSpent.toFixed(2)}</p>
        </div>
        <div style="background-color: #dbeafe; padding: 16px; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 12px; font-weight: 600; text-transform: uppercase;">Total Distance</p>
          <p style="margin: 0; color: #1e40af; font-size: 24px; font-weight: bold;">${analytics.totalDistance.toFixed(0)} km</p>
        </div>
        ${
          analytics.workDistance > 0
            ? `
        <div style="background-color: #f3e8ff; padding: 16px; border-radius: 6px; border-left: 4px solid #a855f7;">
          <p style="margin: 0 0 4px 0; color: #6b21a8; font-size: 12px; font-weight: 600; text-transform: uppercase;">Work Travel</p>
          <p style="margin: 0; color: #6b21a8; font-size: 24px; font-weight: bold;">${analytics.workDistance.toFixed(0)} km</p>
        </div>
        `
            : ""
        }
      </div>
    </div>

    <!-- Fuel Entries Table -->
    <div style="margin-bottom: 30px;">
      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px;">Fuel Entries</h2>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background-color: white; border: 1px solid #e5e7eb; border-radius: 6px;">
          <thead>
            <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Date</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Odometer</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Liters</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Price/L</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Total Cost</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Consumption</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Station</th>
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Work Travel</th>
            </tr>
          </thead>
          <tbody>
            ${entriesHTML}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0;">This report was generated by FuelLog - Your Fuel Consumption Tracker</p>
      <p style="margin: 8px 0 0 0;">For SARS tax purposes, please keep this report with your supporting documents.</p>
    </div>
  </div>
</body>
</html>
  `
}

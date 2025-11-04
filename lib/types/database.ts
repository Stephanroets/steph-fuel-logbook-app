export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  make: string
  model: string
  year: number
  registration_number: string
  created_at: string
  updated_at: string
}

export interface FuelEntry {
  id: string
  user_id: string
  vehicle_id: string
  entry_date: string
  odometer_reading: number
  liters: number
  price_per_liter: number
  total_cost: number
  petrol_station_name: string | null
  receipt_url: string | null
  is_work_travel: boolean
  work_km: number | null
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface FuelEntryWithVehicle extends FuelEntry {
  vehicle: Vehicle
}

export interface VehicleWithStats extends Vehicle {
  total_entries: number
  average_consumption: number | null
  total_spent: number
}

import type { Place } from './Place'

export interface Location extends Place {
  description?: string
  categories?: string[]
  rating?: number
  website?: string
  phoneNumber?: string
  images: string[]
  businessStatus?: string
  openingHours?: OpeningHours
  mapsUrl: string
}

export interface OpeningHours {
  periods: [
    {
      open: { day: number; time: string }
      close: { day: number; time: string }
    }
  ]
  weekday_text: string[]
}

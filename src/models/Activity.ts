import type { Place } from './Place'

export interface Activity extends Place {
  dateTime?: Date
  website?: string
  notes?: string
}

import type { Coordinates } from '.'

export interface Activity {
  Name: string
  Coordinates: Coordinates
  PlaceId: string
  Address?: string
  DateTime?: Date
  Website?: string
  Notes?: string
}

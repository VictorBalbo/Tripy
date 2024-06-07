import type { Coordinates } from '.'

export interface Housing {
  Name: string
  Coordinates: Coordinates
  Address?: string
  Checkin?: string
  Checkout?: string
  Website?: string
  Notes?: string
  PlaceId?: string
}

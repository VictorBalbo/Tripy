import type { Coordinates } from './Coordinates'

export interface Place {
  placeId: string
  name: string
  address: string
  coordinates: Coordinates
}

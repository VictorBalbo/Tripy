import type { Destination, Transportation } from '.'

export interface Trip {
  Name: string
  Destinations: Destination[]
  Transportations: Transportation[]
}

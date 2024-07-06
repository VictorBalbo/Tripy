import type { Activity, Housing } from '.'

export interface Destination {
  Key: string
  Name: string
  Housing?: Housing
  Activities?: Activity[]
  Transport?: string
  StartDate?: string
  EndDate?: string
}

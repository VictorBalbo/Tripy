import type { Location } from '@/models/Location'
import { apiUrl } from '@/constants'

const BASE_URL = apiUrl

export class MapsService {
  static getDetaisForPlaceName = async (input: string) => {
    try {
      const response = await fetch(`${BASE_URL}/places/${input}`)
      const data = await response.json()
      return data
    } catch (e) {
      console.error(e)
    }
  }

  static getDetaisForPlaceId = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/place/${id}`)
      const data = await response.json()
      return data as Location
    } catch (e) {
      console.error(e)
    }
  }
  static getPhotoForPlace = (keys: string[]) => {
    if (keys.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/${keys[0]}`
  }
}

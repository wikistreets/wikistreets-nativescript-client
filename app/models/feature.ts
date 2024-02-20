// based on mock GeoJSON data from https://my.api.mockaroo.com/features.json?key=d9ddfc40

export interface Feature {
  id: number
  geometry: {
    type: string
    coordinates: number[]
  }
  properties: {
    title: string
    body: string
    address: string
  }
}

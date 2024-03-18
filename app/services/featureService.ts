import { bbox, center, centerOfMass, collect } from '@turf/turf'
import { Collection, Feature} from '~/models/feature'

export class FeatureService {

  // constructor that fetches mock data
  constructor() {
      this.featureAPI = 'https://my.api.mockaroo.com/features.json?key=d9ddfc40'
      this.f = [] // start off blank
  }

  private featureAPI: string
  private f: Feature[] = []

  public async getMockFeatures(): Promise<Feature[]> {
    console.log('Fetching mock features...')
    try {
      const results = await fetch(this.featureAPI)
      const data = await results.json()
      this.f = this.f.concat(data) // merge arrays
      console.log(`Now have ${this.f.length} mock features...`)
      return data
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  get features(): Feature[] {
    return this.f
  }

  get collection(): Collection {
    return {
      type: 'FeatureCollection',
      features: this.f
    }
  }

  getFeatureById(id: number): Feature | undefined {
    return this.features.find(feature => feature._id === id) || undefined
  }

  getBbox(collection: Collection): any {
    const bounds = bbox(collection)
    // console.log(`Bbox: ${JSON.stringify(bounds)}`)
    return bounds
  }

  getCenter(collection: Collection): any {
    const center = centerOfMass(collection)
    // console.log(`Center: ${JSON.stringify(center)}`)
    return center
  }
}

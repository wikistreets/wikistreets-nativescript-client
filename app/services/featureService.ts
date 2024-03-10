import { bbox, center, centerOfMass, collect } from '@turf/turf'
import { FeatureCollection as Collection, Feature} from '@turf/turf'

export class FeatureService {

  // constructor that fetches mock data
  constructor() {
      this.featureAPI = 'https://my.api.mockaroo.com/features.json?key=d9ddfc40'
      this.f = [] // start off blank
      this.c = {
        type: 'FeatureCollection',
        features: this.f = [], // starts off blank
      }
  }

  private featureAPI: string
  private f: Feature[] = []
  private c: Collection

  public async getMockFeatures(): Promise<Feature[]> {
    console.log('Fetching mock features...')
    try {
      const results = await fetch(this.featureAPI)
      const data = await results.json()
      this.f = this.f.concat(data) // merge arrays
      console.log('Got the mock features...')
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
    return this.c
  }

  getFeatureById(id: number): Feature | undefined {
    return this.features.find(feature => feature._id === id) || undefined
  }

  getBbox(collection: Collection): any {
    return bbox(collection)
  }

  getCenter(collection: Collection): any {
    return centerOfMass(collection)
  }
}

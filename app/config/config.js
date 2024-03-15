export const config = {
  WIKISTREETS_API: 'http://localhost:10520',

  bottomSheet: {
    startSnap: 0,
    snapPoints: [0, 20, 200, 400, 600, 700],
  },
  map: {
    defaults: {
      zoom: 12,
      homingZoom: 17,
      centerPoint: {
        lat: 40.748817,
        lng: -73.985428,
      },
    },
  },
  address: {
    DEFAULT_ADDRESS: 'Somewhere'
  }
}

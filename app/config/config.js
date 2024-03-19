export const config = {
  WIKISTREETS_API: 'http://localhost:10520',

  bottomSheet: {
    startSnap: 0,
    snapPoints: [0, 20, 200, 400, 600, 700],
  },
  map: {
    defaults: {
      zoom: 2,
      homingZoom: 17,
      centerPoint: {
        lat: 40.748817,
        lng: -73.985428,
      },
    },
    tileServers: [
      // a subset of those listed here: https://wiki.openstreetmap.org/wiki/Raster_tile_providers
      {
        title: "OpenStreetMap Standard",
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      },
      {
        name: "CyclOSM Bicycle-Oriented Map",
        url: 'https://{s}.tile-cyclosm.openstreetmap.fr/[cyclosm|cyclosm-lite]/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "German fork of OpenStreetMap",
        url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "Humanitarian Map",
        url: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "OpenStreetMap France",
        url: 'https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "Stamen Toner (Black & White)",
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=ed84a9f6-26c9-4b71-b3e8-abee8eb5c180',
        attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      }, 
      {
        name: "Stamen Watercolor",
        url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}{r}.png?api_key=ed84a9f6-26c9-4b71-b3e8-abee8eb5c180',
        attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      }, 
      {
        name: "Öpnvkarte Transport Map",
        url: 'https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "OpenStreetMap Switzerland",
        url: 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
      {
        name: "OpenStreetMap Switzerland",
        url: 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, licensed ODbL'
      }, 
    ]
  },
  address: {
    DEFAULT_ADDRESS: 'Somewhere'
  }
}

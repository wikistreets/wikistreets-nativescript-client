import { Feature as TurfFeature, FeatureCollection as TurfCollection } from '@turf/turf'

export interface Feature extends TurfFeature {
    _id?: number // add id to basic GEOJSON feature
}

export interface Collection extends TurfCollection {
    _id?: number 
    title?: string
}
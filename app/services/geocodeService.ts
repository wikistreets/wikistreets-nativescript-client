import { getFromLocation } from '@nativescript-community/geocoding';
import { Photon, PhotonProperties } from './photon';

export interface geocodeLocation {
    name: string;
    sys?: PhotonProperties;
    coord: {
        latitude: number;
        longitude: number;
    };
}

export async function geocodeAddress(coord: { latitude: number; longitude: number }) {
    try {
        const results = await getFromLocation(coord.latitude, coord.longitude, 10);
        // console.log('found addresses', results);
        if (results?.length > 0) {
            const result = results[0];
            const newData = {
                coord,
                name: result.locality,
                sys: {
                    city: result.locality,
                    country: result.country,
                    state: result.administrativeArea,
                    housenumber: result.subThoroughfare,
                    postcode: result.postalCode,
                    street: result.thoroughfare
                }
            } as geocodeLocation
            // console.log('geocodeAddress', coord, newData, formatAddress(newData.sys));
            // newData.name = formatAddress(newData.sys);
            return newData;
        } else {
            // no result
            return {
                coord,
                // sys: {},
                name: coord.latitude.toFixed(2) + ',' + coord.longitude.toFixed(2)
            } as geocodeLocation
        }
    } catch (error) {
        // error
        console.error('geocodeAddress error:', error);
        return {
            coord,
            // sys: {},
            name: coord.latitude.toFixed(2) + ',' + coord.longitude.toFixed(2)
        } as geocodeLocation
    }
}

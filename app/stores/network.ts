/**
 * Svelte store for keeping track of the internet connection
 */

import { derived, writable, Writable } from 'svelte/store'
import { Connectivity } from '@nativescript/core'

const createNetworkStore = () => {
    const connectionType: Writable<number> = writable(Connectivity.connectionType.none) // assume nothing

    // subscribe to token changes and print out a message when changed
    connectionType.subscribe((newType: number) => {
        switch (newType) {
            case Connectivity.connectionType.none:
                console.log(`connection: none!`)
                break
            case Connectivity.connectionType.vpn:
                console.log(`connection: VPN`)
                break
            case Connectivity.connectionType.wifi:
                console.log(`connection: WiFi`)
                break
            case Connectivity.connectionType.ethernet:
                console.log(`connection: ethernet`)
                break
            case Connectivity.connectionType.mobile:
                console.log(`connection: mobile`)
                break
            default:
                console.log(`connectionType: unknown`)
                break
        }
    })

    // derivative boolean value whether there is a connection or not
    const isConnected = derived([connectionType], ([$connectionType]) => {
        return $connectionType != Connectivity.connectionType.none // anything but nothing is a connection
    })

    // initial connection status
    connectionType.set(Connectivity.getConnectionType())

    //monitor changes to the internet connection
    Connectivity.startMonitoring((newType: number) => {
        connectionType.set(newType)
    })

    return {
        connectionType,
        isConnected
    }
}

// create a singleton
export const { connectionType, isConnected } = createNetworkStore()


/**
 * Factory for Svelte stores to keep track of any View's state
 */

import { derived, writable, Writable, get } from 'svelte/store'
import { View } from '@nativescript/core'

/**
 * Factory constructor function to create a store for a View's state
 */
export class ViewWatcher {
  name: string
  view: View
  x: Writable<number>
  y: Writable<number>
  width: Writable<number>
  height: Writable<number>

  constructor(view: View, name: string = view.toString()) {
    this.view = view
    this.name = name
    // console.log(`ViewStore for ${name}`)

    // position
    this.x = writable(0)
    this.y = writable(0)

    // dimensions
    this.width = writable(0)
    this.height = writable(0)

    this.subscribe()
  }

  // subscribe to layoutChanged event dispatches
  subscribe = () => {
    try {
      this.view.on('layoutChanged', () => {
        this.x.set(this.view.getLocationOnScreen().x)
        this.y.set(this.view.getLocationOnScreen().y)
        this.width.set(this.view.getActualSize().width)
        this.height.set(this.view.getActualSize().height)
        this.print()
      })

      this.view.on('loaded', () => {
        console.log(`${this.name} - loaded`)
      })

      this.view.on('unloaded', () => {
        console.log(`${this.name} - unloaded`)
      })
      console.log(`Subscribed to ${this.name} layoutChanged event`)
      return true
    } catch (e) {
      console.error(
        `Error subscribing to ${this.name} layoutChanged event: ${e}`
      )
      return false
    }
  }

  // print out the state
  print(): void {
    console.log(
      `${this.name} - x: ${get(this.x)}, y: ${get(this.y)}, w: ${get(
        this.width
      )}, h: ${get(this.height)}`
    )
  }
}

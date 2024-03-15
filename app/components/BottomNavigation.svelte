<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { EventData, Frame, Label, Page, SwipeDirection, SwipeGestureEventData, View } from '@nativescript/core'
    import { icons } from '../utils/icons'
    import Map from '~/pages/Map.svelte'
    import Feed from '~/pages/Feed.svelte'
    import NewPostSelectLocation from '~/pages/NewPostSelectLocation.svelte'
    import Search from '~/pages/Search.svelte'
    import Settings from '~/pages/Settings.svelte'
    import { navigate } from 'svelte-native'


    let page: Page
    let tabs: Label[] = [] // will hold the tabs
    let tabIndex: number = -1 // will hold the index of the currently-selected tab

    const dispatch = createEventDispatcher(); // for emitting custom messages to parent component

    const onPageLoad = (e: EventData) => {
        page = e.object as Page // save reference
        console.log(`BottomNavigation: onPageLoad`)
        // get array of labels in the flexboxLayout
        const flexBox = page.getViewById('tabs')
        // keep array of children
        flexBox.eachChild((child: View): boolean => {
            console.log(`child: ${child}`)
            tabs.push(child as Label) // add to array for later
            return true
        })
        if (tabs.length > 0) {
            tabIndex = 0 // set the starting tab index
        }

    }

    const onTabTap = (page: any, frameId: string = 'mainFrame', clearHistory:boolean = true, animated:boolean = false) => {
        // dispatch('navTap', { page })
        console.log(`BottomNavigation: onTabTap`)
        const frame = Frame.getFrameById(frameId)
        navigate({
            frame,
            page,
            clearHistory,
            animated,
        })
    }

    const onTabsSwipe = (e: SwipeGestureEventData) => {
    console.log(`Feed: onActionBarSwipe: tabIndex ${tabIndex}`)
    switch (e.direction) {
      case SwipeDirection.left: // left
        console.log('onTabsSwipe: left')
        getPreviousTab()
        break
      case SwipeDirection.right: // right
        console.log('onTabsSwipe: right')
        getNextTab()
        break
      case SwipeDirection.down: // down
        console.log('onTabsSwipe: down')
        getNextTab()
        break
      case SwipeDirection.up: // up
        console.log('onTabsSwipe: up')
        getPreviousTab()
        break
      default:
        console.log(`onTabsSwipe: ${e.direction}`)
    }
  }

    const getPreviousTab = (): Label => {
        // return the previous tab before this one
        const index: number = tabIndex
        let prevIndex = index - 1
        prevIndex = (prevIndex >= 0) ? prevIndex : tabs.length - 1 // reset to last index if below zero
        const prevTab: Label = tabs[prevIndex]
        console.log(`prevTab: ${prevTab}`)
        prevTab.notify({eventName: "tap", object: prevTab });   
        return prevTab
    }
    const getNextTab = (): Label => {
        // return the next tab after this one
        const index: number = tabIndex
        let nextIndex = index + 1
        nextIndex = (nextIndex < tabs.length) ? nextIndex : 0 // reset to zero if beyond length of post
        const nextTab: Label = tabs[nextIndex]
        console.log(`nextTab: ${nextTab}`)
        nextTab.notify({eventName: "tap", object: nextTab });        
        return nextTab
    }


</script>

<page title="" {...$$restProps} actionBarHidden={true} class="w-full h-full" on:loaded={onPageLoad} on:swipe={onTabsSwipe}>
    <flexboxLayout class="w-full h-full" id="tabs">
        <label text="{icons.map}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Map)} />
        <label text="{icons['format-list-bulleted']}" class="text-2xl icon text-center m-1 w-full h-full"  on:tap={() => onTabTap(Feed)} />
        <label text="{icons['plus-box']}" class="text-5xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(NewPostSelectLocation, 'topmost', false)} />
        <label text="{icons.search}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Search)} />
        <label text="{icons.account}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Settings)} />
    </flexboxLayout>
</page>

<style>
</style>
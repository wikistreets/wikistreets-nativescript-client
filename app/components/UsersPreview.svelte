<!-- @component Log in form. -->

<script lang="ts">
    import { Frame, Page, View, ItemEventData, EventData} from '@nativescript/core'
    import { onMount, onDestroy } from 'svelte'
    import { navigate, showModal, closeModal } from 'svelte-native'
    import { Template } from 'svelte-native/components'
    import { get } from 'svelte/store'
    import { GPS } from '@nativescript-community/gps'
    import { FeatureService } from '../services/FeatureService'
    import { Feature, FeatureCollection as Collection } from '@turf/turf'
    import PostPreview from '~/components/PostPreview.svelte'
    import PostDetails from '~/pages/PostDetails.svelte'
    import { icons } from '../utils/icons'
    import { NativeViewElementNode } from 'svelte-native/dom'
    import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'
  import { flexDirectionProperty } from '@nativescript/core/ui/layouts/flexbox-layout'
  
    let parent: Frame | View
    let pageRef: Page // reference to the current page
    let gps: GPS
  
    export let items: any[] = [] // will hold users fetched from API
  
    onMount(() => {
      /**
       * Svelte hook when page is mounted
      */
        console.log('UsersPreview: onMount')

      // add a special first item to the content list
      const featuredUsers = {
        type: 'featuredUsers',
        users: [
          { _id: 1, handle: 'user1', avatar: 'https://source.unsplash.com/random?id=1' },
          { _id: 2, handle: 'user2', avatar: 'https://source.unsplash.com/random?id=2' },
          { _id: 3, handle: 'user3', avatar: 'https://source.unsplash.com/random?id=3' },
          { _id: 4, handle: 'user4', avatar: 'https://source.unsplash.com/random?id=4' },
          { _id: 5, handle: 'user5', avatar: 'https://source.unsplash.com/random?id=5' },
        { _id: 6, handle: 'user6', avatar: 'https://source.unsplash.com/random?id=6' },
        { _id: 7, handle: 'user7', avatar: 'https://source.unsplash.com/random?id=7' },
        { _id: 8, handle: 'user8', avatar: 'https://source.unsplash.com/random?id=8' },
        { _id: 9, handle: 'user9', avatar: 'https://source.unsplash.com/random?id=9' },
        { _id: 10, handle: 'user10', avatar: 'https://source.unsplash.com/random?id=10' },
        { _id: 11, handle: 'user11', avatar: 'https://source.unsplash.com/random?id=11' },
        { _id: 12, handle: 'user12', avatar: 'https://source.unsplash.com/random?id=12' },
        { _id: 13, handle: 'user13', avatar: 'https://source.unsplash.com/random?id=13' },
        { _id: 14, handle: 'user14', avatar: 'https://source.unsplash.com/random?id=14' },
        { _id: 15, handle: 'user15', avatar: 'https://source.unsplash.com/random?id=15' },
        { _id: 16, handle: 'user16', avatar: 'https://source.unsplash.com/random?id=16' },
        { _id: 17, handle: 'user17', avatar: 'https://source.unsplash.com/random?id=17' },
        { _id: 18, handle: 'user18', avatar: 'https://source.unsplash.com/random?id=18' },
        { _id: 19, handle: 'user19', avatar: 'https://source.unsplash.com/random?id=19' },
        { _id: 20, handle: 'user20', avatar: 'https://source.unsplash.com/random?id=20' },
        { _id: 21, handle: 'user21', avatar: 'https://source.unsplash.com/random?id=21' },
        { _id: 22, handle: 'user22', avatar: 'https://source.unsplash.com/random?id=22' },
        { _id: 23, handle: 'user23', avatar: 'https://source.unsplash.com/random?id=23' },
        { _id: 24, handle: 'user24', avatar: 'https://source.unsplash.com/random?id=24' },
        { _id: 25, handle: 'user25', avatar: 'https://source.unsplash.com/random?id=25' }
        ]
      }

      $: items = featuredUsers.users
      
    })
    onDestroy(() => {
      console.log(`Feed: onDestroy`)
    })
  
    const onLoadMoreItems = (e: EventData) => {
      // infinite scroll... this method is called to load more data to the listView
      console.log(`UsersPreview: onLoadMoreItems`)
      console.log(`items length: ${items.length}`)
    }
  
    let pullRefresh: NativeViewElementNode<PullToRefresh>
    async function refresh() {
      if (pullRefresh) {
        pullRefresh.nativeView.refreshing = true
      }
      // do something to refesh page await refreshWeather();
      console.log(`refreshing users...`)
      if (pullRefresh) {
        pullRefresh.nativeView.refreshing = false
      }
    }
  
    const itemTemplateSelector = (item: any, index: number, items: any[]): string => {
      // different list item keys for even and odd rows
      return index % 2 === 0 ? 'user-even' : 'user-odd' // regular item types
    }
    const spanSizeSelector = (item: any, _index: number): number => {
        return 1; // all items in list are full width
    }
  
    const onListItemTap = (e: ItemEventData) => {
      console.log(`UsersPreview: onListItemTap: ${JSON.stringify(e)}`)
    }
  
  </script>

        <scrollView orientation="horizontal" height="110" {...$$restProps}>
            <stackLayout orientation="horizontal" height="110">
                {#each items as user, i (user.id)}
                    <gridLayout class="align-middle text-center mx-2 p2" rows="*">
                        <image row="0" src="{user.avatar}" class="w-20 h-20 rounded-full border-solid border-2 border-sky-500 bg-black" ></image>
                        <label row="0" text="{user.handle}" class="text-white-200 bold text-lg"></label>
                    </gridLayout>
                {/each}
            </stackLayout>
        </scrollView>
  
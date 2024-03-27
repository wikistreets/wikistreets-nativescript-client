<!-- @component You know what a header is.  -->

<script lang="ts">

  import { Frame, Page, View, GridLayout, Utils, EventData, SearchBar } from '@nativescript/core'
  import { icons } from '../utils/icons'
  // import { user, isAuthenticated } from '~/stores/auth'
  import { closeModal, goBack } from 'svelte-native'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher(); // for emitting custom messages to parent component

  let searchBar: SearchBar // bound to searchBar element
  let layout: GridLayout // bound to gridLayout element

  // BEGIN - these props and state variables may be useful to make header more dynamic, but not in use yet
  // export let title: string = '';
  // export let showMenuIcon: boolean = false;
  // export let canGoBack: boolean = false;
  // export let isModal: boolean = false;
  // export let disableBackButton: boolean = false;
  // export let onMenuIcon: Function = null;

  // let menuIcon: string;
  // let menuIconVisible: boolean;
  // let menuIconVisibility: string;
  // END

  onMount(() => {
    // const frame = Frame.topmost();
    // canGoBack = frame?.canGoBack() || !!frame?.currentEntry;
  });

  // when searchBar loaded, prevent it from keyboard focus on Android
  $: (searchBar && layout) ? (() => {
      // prevent focus from going to searchbar on Android
      if (__ANDROID__) {
        console.log('trying to prevent keyboard from popping open')
        clearClutter()
      }

  })() : null


  /**
   * Hack to try to get android from not showing keyboard when searchBar first loads
   * Doesn't work yet... not getting called from on:load event
   * @param e
   */
  const onSearchLayoutLoaded = (e: EventData) => {
    console.log(`search layout loaded`)
        if (__ANDROID__) {
            console.log(`search layout loaded in android`)
            const obj = e.object as View
            obj.android.setFocusableInTouchMode(true);
            obj.android.setFocusable(true);
        }
    }

  /**
   * Hack to try to get android from not showing keyboard when searchBar first loads
   * Doesn't work yet... not getting called from on:load event
   * @param e
   */
   const onSearchBarLoaded = (e: EventData) => {
    /**
     * Prevent searchBar from gaining focus on load
    */
   console.log(`search bar loaded`)
    if (__ANDROID__) {
      console.log(`search bar loaded in android`)
      const obj = e.object as View
      obj.android.clearFocus()
      clearClutter()
    }
  }

  const clearClutter = () => {
    // dismiss the keyboard
    Utils.dismissKeyboard()
    Utils.dismissSoftInput()
  }


  export let onHamburger: Function = null // () => void
  let searchQuery: string

  const onShowMenu = (e: EventData) => {
    dispatch('hamburger') // emit a message to parent component
  }

  // let onSubmit: (e: any) => {}
</script>

<!-- <actionBar on:tap={clearClutter} {...$$restProps} backgroundColor="transparent"> -->
  <gridLayout
    columns="auto, *"
    rows="*"
    {...$$restProps} 
    horizontalAlignment="left"
    backgroundColor="transparent"
    bind:this={layout}
    on:tap={clearClutter} 
    on:load={onSearchLayoutLoaded}
  >
    <label
      row="0"
      col="0"
      text={icons.menu}
      class="icon bg-white dark:bg-black px-4 h-12 mx-2"
      on:tap={onShowMenu}
    />
    <searchBar bind:this={searchBar} id="searchbar" row="0" col="1" class="bg-none text-lg ml-2 mr-6" hint="Search" on:load={onSearchBarLoaded} />
  </gridLayout>
<!-- </actionBar> -->

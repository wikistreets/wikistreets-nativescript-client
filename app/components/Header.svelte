<!-- @component You know what a header is.  -->

<script lang="ts">

  import { Frame, Page, View, Utils, EventData, SearchBar } from '@nativescript/core'
  import { icons } from '../utils/icons'
  // import { user, isAuthenticated } from '~/stores/auth'
  import { closeModal, goBack } from 'svelte-native'
  import { onMount } from 'svelte'

  // BEGIN - these props and state variables may be useful to make header more dynamic, but not in use yet
  export let title: string = '';
  export let showMenuIcon: boolean = false;
  export let canGoBack: boolean = false;
  export let isModal: boolean = false;
  export let disableBackButton: boolean = false;
  export let onMenuIcon: Function = null;

  let menuIcon: string;
  let menuIconVisible: boolean;
  let menuIconVisibility: string;
  // END

  onMount(() => {
    const frame = Frame.topmost();
    canGoBack = frame?.canGoBack() || !!frame?.currentEntry;
  });


  const onSearchLayoutLoaded = (e: EventData) => {
    console.log(`search layout loaded`)
        if (__ANDROID__) {
            console.log(`search layout loaded in android`)
            const obj = e.object as View
            obj.android.setFocusableInTouchMode(true);
        }
    }

  const onSearchBarLoaded = (e: EventData) => {
    /**
     * Prevent searchBar from gaining focus on load
    */
   console.log(`search bar loaded`)
    if (__ANDROID__) {
      console.log(`search bar loaded in android`)
      clearClutter(e)
    }
  }

  const clearClutter = (e: EventData) => {
    // dismiss the keyboard
    Utils.dismissKeyboard()
    Utils.dismissSoftInput()
  }


  export let onHamburger: Function = null // () => void
  let searchQuery: string

  const onShowMenu = (e: EventData) => {
    if (onHamburger) {
      // if we know what to do, do it
      onHamburger()
    }
    else if (isModal) {
      // if we're in a modal, close it
      closeModal(undefined);
    }
    else {
      const frame = Frame.topmost();
      if (frame['_executingContext']) {
        // this means the frame is animating
        // doing goBack would mean boing back up 2 levels because
        // the animating context is not yet in the backStack
        return;
      }
      // simply go back if regular page
      goBack();
    }

    // not using the below... yet
    $: {
        if (isModal) {
            menuIcon = 'mdi-close';
        } else {
            menuIcon = canGoBack ? (__IOS__ ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
        }
    }
    $: menuIconVisible = ((canGoBack || isModal) && !disableBackButton) || showMenuIcon;
    $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapse';

  }

  // let onSubmit: (e: any) => {}
</script>

<actionBar on:tap={clearClutter} {...$$restProps} backgroundColor="transparent">
  <gridLayout
    columns="auto, *"
    rows="*"
    horizontalAlignment="left"
    class="pr-2 pb-2"
    on:load={onSearchLayoutLoaded}
  >
    <label
      row="0"
      col="0"
      text={icons.menu}
      class="text-xl icon"
      on:tap={onShowMenu}
    />
    <searchBar id="searchbar" row="0" col="1" class="text-lg" hint="Search" on:load={onSearchBarLoaded} />
  </gridLayout>
</actionBar>

<!-- @component You know what a header is.  -->

<script lang="ts">
  import { Utils, EventData } from '@nativescript/core'
  // import { user, isAuthenticated } from '~/stores/auth'
  // import { onMount } from 'svelte'

  const clearSearch = (args: EventData) => {
    Utils.dismissKeyboard()
  }
  import { icons } from '../utils/icons'
  export let onHamburger: () => void
  let searchQuery: string
  let onSubmit: (e: any) => {}
</script>

<actionBar on:tap={clearSearch}>
  <gridLayout
    columns="auto, *"
    rows="*"
    horizontalAlignment="left"
    class="pr-2 pb-2"
  >
    <label
      row="0"
      col="0"
      text={icons.menu}
      class="text-xl icon"
      on:tap={onHamburger}
    />
    <searchBar id="searchbar" row="0" col="1" class="text-lg" hint="Search" />
  </gridLayout>
</actionBar>

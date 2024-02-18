<!-- @component You know what a header is.  -->

<script lang="ts">
  import { Utils, EventData } from '@nativescript/core'
  const clearSearch = (args: EventData) => {
    Utils.dismissKeyboard()
  }
  import { icons } from '../utils/icons'
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
    <label row="0" col="0" text={icons.menu} class="text-xl icon"></label>
    <searchBar
      id="searchbar"
      row="0"
      col="1"
      class="text-lg italic"
      hint="Search"
    />
  </gridLayout>
</actionBar>

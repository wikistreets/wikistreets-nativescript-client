<!-- @component You know what a header is.  -->

<script lang="ts">
  import { icons } from '../utils/icons'
  let searchQuery: string
  let onSubmit: (e: any) => {}
</script>

<actionBar>
  <gridLayout
    columns="auto, *"
    rows="*"
    horizontalAlignment="left"
    class="pr-2 pb-2"
  >
    <label row="0" col="0" text={icons.menu} class="icon"></label>
    <searchBar row="0" col="1" class="text-lg italic" hint="Search" />
  </gridLayout>
</actionBar>

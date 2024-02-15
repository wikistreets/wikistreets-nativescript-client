<!-- @component You know what a footer is.  -->

<script lang="ts">
  import { icons } from '../utils/icons'
  export let row: number // when used in gridlayout
</script>

<gridLayout columns="*" rows="auto" horizontalAlignment="center" {row}>
  <label
    class="text-center text-xs text-gray-400"
    text="© 2024 wikistreets.  All rights reserved"
  />
  <label
    class="text-center text-xs text-gray-400"
    text="© 2024 wikistreets.  All rights reserved"
  />
</gridLayout>

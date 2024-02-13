<!-- @component You know what a footer is.  -->

<script lang="ts">
  import { icons } from '../utils/icons'
</script>

<gridLayout columns="auto, *" rows="*" horizontalAlignment="center">
  <label text={icons.copyright} row="0" col="0" class="icon" />
  <label class="text-center text-lg" text="2024.  All rights reserved" />
</gridLayout>

<script lang="ts">
  import Theme from '@nativescript/theme'
  import Home from './pages/Home.svelte'

  // determine 'dark', 'light', or 'auto' mode of device
  console.log(`Device theme: ${Theme.getMode()}`)
</script>

<frame>
  <Home />
</frame>

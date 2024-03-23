<!-- @component Log in form. -->

<script lang="ts">
import { l, lc, lt } from '~/services/localeService'

</script>
  
  <page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
    <actionBar title="Search" flat="true">
        <flexboxLayout class="w-full h-full" flexDirection="row" justifyContent="space-between">
            <label text='{lc('Search.title')}' class="text-center text-lg w-full" />
        </flexboxLayout>
    </actionBar>
    
  
    <stackLayout
      orientation="vertical"
      horizontalAlignment="center"
      class="w-full"
    >
        <searchBar id="searchbar" row="0" class="bg-none text-lg ml-2 mx-auto" hint="{lc('Search.form.text.hint')}" />
    
        <label
            class="w-full h-full text-center align-middle text-lg"
            text="{lc('Search.results.placeholder')}"
        />
    </stackLayout>
  </page>
  
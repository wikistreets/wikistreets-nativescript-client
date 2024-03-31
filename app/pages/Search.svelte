<!-- @component Log in form. -->

<script lang="ts">
import { l, lc, lt } from '~/services/localeService'

</script>
  
  <page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
    <actionBar title="Search" flat="true" style="padding: 4rem;">
      <searchBar id="searchbar" row="0" class="text-subheading-md bg-s-light-primary" textFieldBackgroundColor="#F3F4F6" hint="{lc('Search.form.text.hint')}" />  
        <!-- <flexboxLayout class="w-full h-full" flexDirection="row" justifyContent="space-between"> -->
          <!-- <label text='{lc('Search.title')}' class="text-center text-heading-sm w-full" /> -->
        <!-- </flexboxLayout> -->
    </actionBar>

  
    <stackLayout
      orientation="vertical"
      horizontalAlignment="center"
      class="w-full"
      style="border: 0;"
    >
        <!-- <searchBar id="searchbar" row="0" class="text-subheading-md bg-s-light-primary" textFieldBackgroundColor="#F3F4F6" hint="{lc('Search.form.text.hint')}" /> -->
    
        <label
          style="border: 0;"
          class="w-full h-full text-center align-middle text-body-md"
          text="{lc('Search.results.placeholder')}"
        />
    </stackLayout>
  </page>
  
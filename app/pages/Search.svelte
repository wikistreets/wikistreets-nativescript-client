<!-- @component Log in form. -->

<script lang="ts">
    let x = 10
</script>
  
  <page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
    <actionBar title="Search" flat="true">
        <flexboxLayout class="w-full h-full" flexDirection="row" justifyContent="space-between">
            <label text='Search' class="text-center text-lg w-full" />
        </flexboxLayout>
    </actionBar>
    
  
    <stackLayout
      orientation="vertical"
      horizontalAlignment="center"
      class="w-full"
    >
        <searchBar id="searchbar" row="0" class="bg-none text-lg ml-2 mx-auto" hint="Search" />
    
        <label
            class="w-full h-full text-center align-middle text-lg"
            text="Search TBD"
        />
    </stackLayout>
  </page>
  
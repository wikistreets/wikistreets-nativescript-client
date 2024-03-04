<!-- @component Log in form. -->

<script lang="ts">
    let x = 10
</script>
  
  <page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
    <actionBar title="Feed" flat="true">
        <flexboxLayout class="w-full h-full" flexDirection="row" justifyContent="space-between">
            <label text='Feed' class="text-center text-lg w-full" />
        </flexboxLayout>
    </actionBar>
    
  
    <stackLayout
      orientation="vertical"
      horizontalAlignment="center"
      class="w-full"
    >
      <label
        class="w-full h-full text-center align-middle text-lg"
        text="Feed TBD"
      />
    </stackLayout>
  </page>
  
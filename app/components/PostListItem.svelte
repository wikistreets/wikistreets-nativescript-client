<script lang="ts">
  // props
  export let item: any = {}
  export let classes: String = ''
</script>

<gridLayout rows="*" columns="auto, *" padding="0" class={classes}>
  <label row="0" col="0" class="p-4 text-lg" text={item.properties.title} />
  <label row="0" col="1" class="p-4 text-sm" text={item.geometry.type} />
</gridLayout>

<script lang="ts">
  // props
  export let item: any = {}
  let className: string
  export { className as class }
</script>

<gridLayout rows="*" columns="auto, *" padding="0" class={className}>
  <label row="0" col="0" class="p-4 text-lg" text={item.properties.title} />
  <label row="0" col="1" class="p-4 text-sm" text={item.geometry.type} />
</gridLayout>

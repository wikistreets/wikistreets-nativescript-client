<!-- @component A single post, rendered as a list item. -->

<script lang="ts">
  // props
  export let item: any = {}
</script>

<gridLayout rows="*" columns="auto, *" padding="0" {...$$restProps}>
  <label row="0" col="0" class="p-4 text-lg" text={item.properties.title} />
  <label row="0" col="1" class="p-4 text-sm" text={item.geometry.type} />
</gridLayout>

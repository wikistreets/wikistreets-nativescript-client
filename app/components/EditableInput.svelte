<script lang="ts">
  import { EventData } from '@nativescript/core'
  import { TapGestureEventData } from "@nativescript/core/ui/gestures"
  import { l, lc } from '~/services/localeService'
  import { icons } from '~/utils/icons'

  export let label: string = ''
  export let text: string
  export let hint: string = lc('EditableInput.form.text.hint')
  export let onChange: Function = () => {}
  export let secure: 'true' | 'false' = 'false'
  export let keyboardType:
    | 'number'
    | 'datetime'
    | 'phone'
    | 'url'
    | 'email'
    | 'integer'
    | null = null
  export let autocorrect: 'true' | 'false' = 'false'
  export let autocapitalizationType:
    | 'none'
    | 'words'
    | 'sentences'
    | 'allcharacters' = 'none'

  let editable: boolean = false

  const onSubmit = (e: EventData) => {
    editable = false
    console.log(`onSubmit: ${label} -> ${text}`) // debugging
    onChange(text)
  }

  const toggleEditable = (e: TapGestureEventData) => {
    editable = editable ? false : true
  }
</script>

<flexboxLayout {...$$restProps} justifyContent="flex-start" class="w-full">
  <!-- <label text={label} on:tap={toggleEditable} class="text-body-md text-left w-1/4" /> -->

  {#if editable}
    <textField
      hint={hint}
      bind:text
      {secure}
      {autocorrect}
      {keyboardType}
      {autocapitalizationType}
      class="w-11/12 text-body-md p-8"
      style="border-radius: 5rem; margin: 0;"
      on:returnPress={onSubmit}
    />
    <label
      class="text-label-md text-left text-t-light-secondary p-8"
      text="{lc('common.buttons.save')}"
      on:tap={onSubmit}
    />
  {:else}
    <label {text} on:tap={toggleEditable} class="w-11/12 text-heading-sm p-8" />
    <label
      class="text-label-md text-left text-t-light-secondary p-8"
      text="{lc('common.buttons.edit')}"
      on:tap={() => (editable = true)}
    />
  {/if}
</flexboxLayout>

<style>
</style>

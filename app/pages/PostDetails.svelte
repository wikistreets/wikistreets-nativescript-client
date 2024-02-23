<!-- @component Detail screen for a single post. -->

<script lang="ts">
  import { goBack } from 'svelte-native'
  import { FeatureService } from '../services/FeatureService'

  export let postId: number
  const post = FeatureService.getInstance().getFeatureById(postId)
</script>

<page>
  <actionBar title={post.properties.title}>
    <navigationButton
      text="Back"
      android.systemIcon="ic_menu_back"
      on:tap={goBack}
    />
    <actionItem
      ios.position="right"
      android.position="actionBar"
      ios.systemIcon="9"
      android.systemIcon="ic_menu_share"
      text="Cancel"
      on:tap={() => closeModal('Login form canceled')}
    />
  </actionBar>
  <stackLayout height="100%" class="p-4">
    <label text={post?.properties.title} class="text-xl mb-4" />
    <label text={post?.properties.body} class="text-sm mb-4" />
    <image src="https://source.unsplash.com/random" stretch="aspectFill" />
  </stackLayout>
</page>

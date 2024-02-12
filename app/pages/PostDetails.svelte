<script lang="ts">
  import { navigate, showModal } from 'svelte-native'
  import { FeatureService } from '../services/FeatureService'

  export let postId: number
  const post = FeatureService.getInstance().getFeatureById(postId)
</script>

<page>
  <stackLayout height="100%">
    <label text={post?.properties.title} class="text-lg" />
    <label text={post?.properties.body} class="text-sm" />
  </stackLayout>
</page>

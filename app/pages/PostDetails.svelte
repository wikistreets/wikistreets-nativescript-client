<script lang="ts">
  import { FeatureService } from '../services/FeatureService'

  export let postId: number
  const post = FeatureService.getInstance().getFeatureById(postId)
</script>

<page>
  <stackLayout height="100%" class="p-4">
    <label text={post?.properties.title} class="text-xl mb-4" />
    <label text={post?.properties.body} class="text-sm mb-4" />
    <image src="https://source.unsplash.com/random" stretch="aspectFill" />
  </stackLayout>
</page>

<!-- @component You know what a header is.  -->

<script lang="ts">
  import { icons } from '../utils/icons'
</script>

<actionBar>
  <gridLayout columns="auto, *" rows="*" horizontalAlignment="left">
    <label text={icons.menu} row="0" col="0" class="icon"></label>
    <textField hint="Search" row="0" col="1" class="text-lg italic px-2"
    ></textField>
  </gridLayout>
</actionBar>

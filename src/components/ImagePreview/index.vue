<template>
  <div class="image-preview" @click="handlePreview">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { showImagePreview } from 'vant'

const props = defineProps<{
  images: string[]
  startIndex?: number
}>()

const handlePreview = () => {
  showImagePreview({
    images: props.images,
    startPosition: props.startIndex || 0,
    closeable: true
  })
}
</script>

<style lang="scss" scoped>
.image-preview {
  cursor: pointer;
}
</style>

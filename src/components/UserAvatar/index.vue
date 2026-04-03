<template>
  <van-image
    :src="src"
    :size="size"
    :round="round"
    fit="cover"
    class="user-avatar"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_AVATAR } from '@constants'

const props = defineProps<{
  src?: string
  size?: number | string
  round?: boolean
}>()

const src = computed(() => props.src || DEFAULT_AVATAR)
</script>

<style lang="scss" scoped>
.user-avatar {
  background: #f5f5f5;
  object-fit: cover;
}
</style>

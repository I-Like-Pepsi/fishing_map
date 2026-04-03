<template>
  <div class="home-page">
    <van-tabs v-model:active="activeTab" class="feed-tabs" sticky>
      <van-tab title="关注" name="following">
        <FeedList type="following" />
      </van-tab>
      <van-tab title="推荐" name="recommend">
        <FeedList type="recommend" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FeedList from '@/components/FeedList/index.vue'

const activeTab = ref('recommend')
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.home-page {
  height: 100%;
}

.feed-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.van-tabs__wrap) {
    flex-shrink: 0;
    background: linear-gradient(135deg, $primary-color, $primary-light);
  }

  :deep(.van-tabs__nav) {
    background: transparent;
  }

  :deep(.van-tab) {
    color: rgba(255, 255, 255, 0.7);
  }

  :deep(.van-tab--active) {
    color: #fff;
    font-weight: 500;
  }

  :deep(.van-tabs__content) {
    flex: 1;
    overflow: visible;
  }

  :deep(.van-tab__panel) {
    height: 100%;
  }

  :deep(.van-tabs__line) {
    background: $bg-color;
    height: 3px;
    border-radius: 2px;
  }

}
</style>

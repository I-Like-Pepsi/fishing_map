<template>
  <div class="user-feeds" ref="listRef">
    <div v-if="loading" class="loading">
      <van-loading size="24" />
    </div>

    <div v-else-if="feeds.length === 0" class="empty">
      <van-empty description="暂无内容" />
    </div>

    <div v-else>
      <PostCard
        v-for="feed in feeds"
        :key="feed.id"
        :post="feed"
        @like="handleLike"
        @comment="handleComment"
        @collect="handleCollect"
        @share="handleShare"
      />

      <div v-if="loadingMore" class="loading-more">
        <van-loading size="20" />
      </div>

      <div v-if="!hasMore" class="no-more">
        <span>没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import type { Feed } from '@types'
import { feedApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'

const props = defineProps<{
  userId: string
  type: 'posts' | 'collections' | 'likes'
}>()

const listRef = ref<HTMLElement>()
const feeds = ref<Feed[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)

const loadData = async (isLoadMore = false) => {
  const loadingRef = isLoadMore ? loadingMore : loading
  loadingRef.value = true

  try {
    const newFeeds = await feedApi.getUserFeeds(props.userId, {
      page: isLoadMore ? page.value : 1,
      size: 10
    })

    if (isLoadMore) {
      feeds.value = [...feeds.value, ...newFeeds]
    } else {
      feeds.value = newFeeds
      page.value = 1
    }

    hasMore.value = newFeeds.length >= 10
  } finally {
    loadingRef.value = false
  }
}

const handleScroll = () => {
  if (!listRef.value || loadingMore.value || !hasMore.value) return

  const { scrollTop, scrollHeight, clientHeight } = listRef.value
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    page.value++
    loadData(true)
  }
}

const handleLike = async (id: string) => {
  const feed = feeds.value.find(f => f.id === id)
  if (!feed) return

  feed.isLiked = !feed.isLiked
  feed.likes += feed.isLiked ? 1 : -1

  try {
    await feedApi.like(id)
  } catch {
    feed.isLiked = !feed.isLiked
    feed.likes += feed.isLiked ? 1 : -1
  }
}

const handleComment = (id: string) => {
  console.log('评论', id)
}

const handleCollect = async (id: string) => {
  const feed = feeds.value.find(f => f.id === id)
  if (!feed) return

  feed.isCollected = !feed.isCollected
  feed.collections += feed.isCollected ? 1 : -1

  try {
    await feedApi.collect(id)
    showToast(feed.isCollected ? '已收藏' : '已取消收藏')
  } catch {
    feed.isCollected = !feed.isCollected
    feed.collections += feed.isCollected ? 1 : -1
  }
}

const handleShare = async (id: string) => {
  try {
    await feedApi.share(id)
    showToast('分享成功')
  } catch {
    showToast('分享失败')
  }
}

onMounted(() => {
  loadData()
  listRef.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  listRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.user-feeds {
  height: 100%;
  overflow-y: auto;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.no-more {
  text-align: center;
  padding: 16px 0;
  color: #969799;
  font-size: 13px;
}
</style>

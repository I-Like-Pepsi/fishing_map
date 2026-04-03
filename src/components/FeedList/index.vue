<template>
  <div class="feed-list" ref="listRef">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 空状态 -->
      <div v-if="!loading && feeds.length === 0" class="empty">
        <van-empty description="暂无内容" />
      </div>

      <!-- 动态列表 -->
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

        <!-- 加载中 -->
        <div v-if="loading" class="loading">
          <van-loading size="24" />
        </div>

        <!-- 没有更多 -->
        <div v-if="!hasMore" class="no-more">
          <span>没有更多了</span>
        </div>
      </div>
    </van-pull-refresh>

    <!-- 评论弹窗 -->
    <CommentList v-model:show="showComment" :post-id="currentPostId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import type { Feed } from '@types'
import { feedApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'
import CommentList from '@/components/CommentList/index.vue'

const props = defineProps<{
  type: 'following' | 'recommend'
}>()

const listRef = ref<HTMLElement>()
const feeds = ref<Feed[]>([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const hasMore = ref(true)
const showComment = ref(false)
const currentPostId = ref('')

// 加载数据
const loadData = async (isRefresh = false) => {
  if (loading.value) return

  loading.value = true
  try {
    const newFeeds = await feedApi.getList({
      tab: props.type,
      page: isRefresh ? 1 : page.value,
      size: 10
    })

    if (isRefresh) {
      feeds.value = newFeeds
      page.value = 1
    } else {
      feeds.value = [...feeds.value, ...newFeeds]
    }

    hasMore.value = newFeeds.length >= 10
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  await loadData(true)
  refreshing.value = false
}

// 无限滚动
const handleScroll = () => {
  if (!listRef.value || loading.value || !hasMore.value) return

  const { scrollTop, scrollHeight, clientHeight } = listRef.value
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    page.value++
    loadData()
  }
}

// 点赞
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

// 评论
const handleComment = (id: string) => {
  currentPostId.value = id
  showComment.value = true
}

// 收藏
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

// 分享
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
@import "@/assets/styles/variables.scss";

.feed-list {
  height: 100%;
  overflow-y: auto;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.no-more {
  text-align: center;
  padding: 16px 0;
  color: $text-secondary;
  font-size: 13px;
}
</style>

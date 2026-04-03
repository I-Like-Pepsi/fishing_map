<template>
  <div class="spot-detail-page">
    <div v-if="loading" class="loading">
      <van-loading size="24" />
    </div>

    <template v-else-if="spot">
      <!-- 顶部图片 -->
      <div class="spot-header">
        <van-nav-bar
          :title="spot.name"
          left-arrow
          @click-left="router.back()"
        />
        <van-image
          :src="'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
          fit="cover"
          class="spot-image"
        />
      </div>

      <!-- 钓点信息 -->
      <div class="spot-info">
        <h1 class="spot-name">{{ spot.name }}</h1>

        <div class="info-row">
          <van-icon name="location-o" />
          <span>{{ spot.address }}</span>
        </div>

        <div class="info-row">
          <van-icon name="wap-home-o" />
          <span>{{ spot.type }}</span>
        </div>

        <div class="info-row">
          <van-rate v-model="spot.rating" readonly size="14" />
          <span class="rating-text">{{ spot.rating }}分</span>
        </div>

        <div class="info-row" v-if="spot.distance">
          <van-icon name="aim" />
          <span>距离 {{ spot.distance }}km</span>
        </div>
      </div>

      <!-- 相关动态 -->
      <div class="related-feeds">
        <div class="section-title">相关动态</div>

        <div v-if="feedsLoading" class="loading">
          <van-loading size="20" />
        </div>

        <div v-else-if="feeds.length === 0" class="empty">
          <van-empty description="暂无相关动态" :image-size="80" />
        </div>

        <div v-else class="feeds-list">
          <PostCard
            v-for="feed in feeds"
            :key="feed.id"
            :post="feed"
            @like="handleLike"
            @comment="handleComment"
            @collect="handleCollect"
            @share="handleShare"
          />
        </div>
      </div>
    </template>

    <van-empty v-else description="钓点不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Feed } from '@types'
import { spotApi, feedApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'

const route = useRoute()
const router = useRouter()
const spotId = route.params.id as string

interface Spot {
  id: string
  name: string
  address: string
  type: string
  rating: number
  distance?: number
}

const loading = ref(false)
const spot = ref<Spot | null>(null)

const feedsLoading = ref(false)
const feeds = ref<Feed[]>([])

const loadSpot = async () => {
  loading.value = true
  try {
    spot.value = await spotApi.getDetail(spotId)
  } finally {
    loading.value = false
  }
}

const loadFeeds = async () => {
  feedsLoading.value = true
  try {
    feeds.value = await feedApi.getList({ tab: 'recommend', page: 1, size: 5 })
  } finally {
    feedsLoading.value = false
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

const handleComment = () => {
  showToast('请在动态详情页评论')
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
  loadSpot()
  loadFeeds()
})
</script>

<style lang="scss" scoped>
.spot-detail-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.spot-header {
  position: relative;
}

.spot-image {
  width: 100%;
  height: 300px;
}

.spot-info {
  background: #fff;
  padding: 20px 16px;
  margin-bottom: 8px;
}

.spot-name {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin: 0 0 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #646566;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .van-icon {
    color: #969799;
  }
}

.rating-text {
  margin-left: 8px;
  color: #ff6b00;
}

.related-feeds {
  padding: 0 16px 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 12px;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
</style>

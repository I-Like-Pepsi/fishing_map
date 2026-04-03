<template>
  <div class="search-page">
    <div class="search-header">
      <van-search
        v-model="keyword"
        placeholder="搜索动态、用户、钓点"
        shape="round"
        autofocus
        show-action
        background="transparent"
        class="search-input"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="!hasSearched && history.length">
      <div class="history-header">
        <span>搜索历史</span>
        <van-icon name="delete-o" @click="clearHistory" />
      </div>
      <div class="history-tags">
        <van-tag
          v-for="(item, index) in history"
          :key="index"
          plain
          round
          @click="searchByHistory(item)"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results" v-if="hasSearched">
      <div v-if="loading" class="loading">
        <van-loading size="24" />
      </div>

      <div v-else-if="!hasResults" class="empty">
        <van-empty description="未找到相关内容" :image-size="80" />
      </div>

      <div v-else>
        <!-- 动态 -->
        <div class="result-section" v-if="result.feeds?.length">
          <div class="section-title">动态</div>
          <PostCard
            v-for="feed in result.feeds"
            :key="feed.id"
            :post="feed"
            @like="handleLike"
            @comment="handleComment"
            @collect="handleCollect"
            @share="handleShare"
          />
        </div>

        <!-- 用户 -->
        <div class="result-section" v-if="result.users?.length">
          <div class="section-title">用户</div>
          <div class="users-grid">
            <div
              v-for="user in result.users"
              :key="user.id"
              class="user-card"
              @click="goToUser(user.id)"
            >
              <van-image
                round
                :src="user.avatar"
                fit="cover"
                class="user-avatar"
              />
              <div class="user-name">{{ user.nickname }}</div>
              <div class="user-bio">{{ user.bio }}</div>
              <div class="user-stats">{{ user.followerCount }} 粉丝</div>
            </div>
          </div>
        </div>

        <!-- 钓点 -->
        <div class="result-section" v-if="result.spots?.length">
          <div class="section-title">钓点</div>
          <van-cell
            v-for="spot in result.spots"
            :key="spot.id"
            :title="spot.name"
            :label="spot.address"
            is-link
            @click="goToSpot(spot.id)"
          >
            <template #icon>
              <van-icon name="location-o" />
            </template>
          </van-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Feed, User } from '@types'
import { feedApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'

const router = useRouter()

const keyword = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const history = ref<string[]>([])

interface Spot {
  id: string
  name: string
  address: string
}

const result = ref<{
  feeds: Feed[]
  users: User[]
  spots: Spot[]
}>({
  feeds: [],
  users: [],
  spots: []
})

const hasResults = computed(() => {
  return result.value.feeds?.length ||
         result.value.users?.length ||
         result.value.spots?.length
})

const onSearch = async (val: string) => {
  if (!val.trim()) return

  hasSearched.value = true
  loading.value = true

  try {
    // 模拟搜索结果
    const feeds = await feedApi.getList({ tab: 'recommend', page: 1, size: 5 })

    result.value = {
      feeds,
      users: [],
      spots: []
    }

    // 添加到搜索历史
    if (!history.value.includes(val)) {
      history.value.unshift(val)
      if (history.value.length > 10) {
        history.value = history.value.slice(0, 10)
      }
    }
  } catch {
    showToast('搜索失败')
  } finally {
    loading.value = false
  }
}

const searchByHistory = (item: string) => {
  keyword.value = item
  onSearch(item)
}

const clearHistory = () => {
  history.value = []
}

const onCancel = () => {
  router.back()
}

const handleLike = async (id: string) => {
  const feed = result.value.feeds?.find(f => f.id === id)
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
  const feed = result.value.feeds?.find(f => f.id === id)
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

const goToUser = (id: string) => {
  router.push({ name: 'UserProfile', params: { id } })
}

const goToSpot = (id: string) => {
  router.push({ name: 'SpotDetail', params: { id } })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.search-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-color;
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  padding: 12px 16px;
  flex-shrink: 0;
}

.search-input {
  :deep(.van-search__content) {
    background: rgba(255, 255, 255, 0.25);
  }

  :deep(.van-field__control) {
    color: rgba(255, 255, 255, 0.9);
  }

  :deep(.van-field__placeholder) {
    color: rgba(255, 255, 255, 0.7);
  }
}

.search-history {
  flex: 1;
  padding: 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-md;
  color: $text-secondary;
  margin-bottom: 12px;

  .van-icon {
    color: $text-light;
    cursor: pointer;
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-results {
  flex: 1;
  overflow-y: auto;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.result-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-secondary;
  padding: 8px 16px;
  background: $bg-color;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.user-card {
  background: $bg-card;
  border-radius: $border-radius;
  padding: 16px;
  text-align: center;
  cursor: pointer;
}

.user-avatar {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.user-name {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
}

.user-bio {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.user-stats {
  font-size: $font-size-sm;
  color: $text-secondary;
}
</style>

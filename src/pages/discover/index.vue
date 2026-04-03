<template>
  <div class="discover-page">
    <!-- 搜索栏 -->
    <div class="search-header" @click="goToSearch">
      <van-search
        v-model="keyword"
        placeholder="搜索动态、用户、钓点"
        shape="round"
        readonly
        class="search-input"
      />
    </div>

    <div class="discover-content">
      <!-- 附近钓点 -->
      <div class="section">
        <div class="section-title">
          <van-icon name="location-o" />
          <span>附近钓点</span>
        </div>
        <van-swipe
          v-if="nearbySpots.length"
          class="spots-swipe"
          :loop="false"
          :width="280"
        >
          <van-swipe-item
            v-for="spot in nearbySpots"
            :key="spot.id"
            class="spot-card"
            @click="goToSpot(spot.id)"
          >
            <div class="spot-image">
              <van-image
                :src="'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                fit="cover"
              />
            </div>
            <div class="spot-info">
              <div class="spot-name">{{ spot.name }}</div>
              <div class="spot-address">{{ spot.address }}</div>
              <div class="spot-meta">
                <van-rate v-model="spot.rating" readonly size="12" />
                <span class="distance">{{ spot.distance }}km</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <van-empty v-else description="暂无附近钓点" :image-size="80" />
      </div>

      <!-- 推荐钓友 -->
      <div class="section">
        <div class="section-title">
          <van-icon name="friends-o" />
          <span>推荐钓友</span>
        </div>
        <div class="users-grid">
          <div
            v-for="user in recommendedUsers"
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
            <div class="user-stats">
              <span>{{ user.followerCount }} 粉丝</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门内容 -->
      <div class="section">
        <div class="section-title">
          <van-icon name="fire-o" />
          <span>热门内容</span>
        </div>
        <div class="hot-feeds">
          <van-badge
            v-for="(feed, index) in hotFeeds"
            :key="feed.id"
            :content="index + 1"
            :color="index < 3 ? '#ff4d4f' : '#969799'"
            position="top-right"
            class="rank-badge-item"
          >
            <div class="feed-preview">
              <van-image
                v-if="feed.images && feed.images[0]"
                :src="feed.images[0]"
                fit="cover"
                class="feed-image"
              />
              <div class="feed-info">
                <div class="feed-content">{{ feed.content }}</div>
                <div class="feed-stats">
                  <span>{{ feed.likes }} 赞</span>
                  <span>{{ feed.comments }} 评论</span>
                </div>
              </div>
            </div>
          </van-badge>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers, mockFeeds } from '@api/mock'

const router = useRouter()
const keyword = ref('')

// Mock数据
const nearbySpots = ref([
  { id: '1', name: 'XX水库', address: '北京市XX区XX水库', rating: 4.5, distance: 2.5 },
  { id: '2', name: 'XX河段', address: '北京市XX区XX河', rating: 4.2, distance: 5.8 },
  { id: '3', name: 'XX公园湖', address: '北京市XX区XX公园', rating: 3.8, distance: 8.2 }
])

const recommendedUsers = computed(() => mockUsers.slice(0, 4))
const hotFeeds = computed(() => mockFeeds.slice(0, 5))

onMounted(() => {
  // 加载推荐钓友
  // 加载热门内容
})

const goToSearch = () => {
  router.push({ name: 'Search' })
}

const goToSpot = (id: string) => {
  router.push({ name: 'SpotDetail', params: { id } })
}

const goToUser = (id: string) => {
  router.push({ name: 'UserProfile', params: { id } })
}

const goToPost = (id: string) => {
  router.push({ name: 'PostDetail', params: { id } })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.discover-page {
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
  cursor: pointer;
  flex-shrink: 0;
}

.search-input {
  background: transparent;
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

.discover-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 90px;
}

.section {
  margin-top: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: $font-size-lg;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 12px;

  .van-icon {
    color: $primary-color;
  }
}

.spots-swipe {
  padding: 4px 0;
}

.spot-card {
  margin-right: 12px;
  border-radius: $border-radius;
  overflow: hidden;
  background: $bg-card;
  cursor: pointer;
}

.spot-image {
  width: 100%;
  aspect-ratio: 16/9;
}

.spot-info {
  padding: 12px;
}

.spot-name {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
}

.spot-address {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: 8px;
}

.spot-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.distance {
  font-size: $font-size-sm;
  color: $primary-color;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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

.hot-feeds {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-badge-item {
  background: $bg-card;
  border-radius: $border-radius;
  cursor: pointer;
}

.feed-preview {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.feed-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
}

.feed-info {
  flex: 1;
  min-width: 0;
}

.feed-content {
  font-size: $font-size-md;
  color: $text-primary;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.feed-stats {
  display: flex;
  gap: 12px;
  font-size: $font-size-sm;
  color: $text-secondary;
}
</style>

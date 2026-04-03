<template>
  <div class="user-profile-page">
    <div v-if="loading" class="loading">
      <van-loading size="24" />
    </div>

    <template v-else-if="user">
      <!-- 用户信息 -->
      <div class="user-header">
        <van-nav-bar
          :title="user.nickname"
          left-arrow
          @click-left="router.back()"
        >
          <template #right>
            <van-button
              size="small"
              :type="isFollowing ? 'default' : 'primary'"
              @click="handleFollow"
            >
              {{ isFollowing ? '已关注' : '关注' }}
            </van-button>
            <van-icon name="ellipsis" size="18" @click="showActionSheet" />
          </template>
        </van-nav-bar>

        <div class="user-info">
          <van-image
            round
            :src="user.avatar"
            fit="cover"
            class="avatar"
          />
          <div class="info">
            <div class="nickname">{{ user.nickname }}</div>
            <div class="bio">{{ user.bio }}</div>
            <div class="meta">
              <span>钓龄：{{ user.fishingAge }}年</span>
              <span>{{ user.region }}</span>
            </div>
          </div>
        </div>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ user.postCount }}</div>
            <div class="stat-label">动态</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.followingCount }}</div>
            <div class="stat-label">关注</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.followerCount }}</div>
            <div class="stat-label">粉丝</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.likeCount }}</div>
            <div class="stat-label">获赞</div>
          </div>
        </div>
      </div>

      <!-- 动态列表 -->
      <div class="user-feeds">
        <div v-if="feedsLoading" class="loading">
          <van-loading size="20" />
        </div>

        <div v-else-if="feeds.length === 0" class="empty">
          <van-empty description="暂无动态" :image-size="80" />
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
        </div>
      </div>
    </template>

    <van-empty v-else description="用户不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showActionSheet } from 'vant'
import type { Feed } from '@types'
import { userApi, feedApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'

const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

const loading = ref(false)
const user = ref<any>(null)
const isFollowing = computed(() => user.value?.isFollowing || false)

const feedsLoading = ref(false)
const feeds = ref<Feed[]>([])

const loadUser = async () => {
  loading.value = true
  try {
    user.value = await userApi.getProfile(userId)
  } finally {
    loading.value = false
  }
}

const loadFeeds = async () => {
  feedsLoading.value = true
  try {
    feeds.value = await feedApi.getUserFeeds(userId, { page: 1, size: 20 })
  } finally {
    feedsLoading.value = false
  }
}

const handleFollow = async () => {
  try {
    const res = await userApi.follow(userId)
    isFollowing.value = res.isFollowing

    if (res.isFollowing) {
      user.value.followerCount++
    } else {
      user.value.followerCount--
    }

    showToast(res.isFollowing ? '已关注' : '已取消关注')
  } catch {
    showToast('操作失败')
  }
}

const showActionSheet = () => {
  const actions = [
    { name: '举报用户', value: 'report' },
    { name: '屏蔽此人', value: 'block' }
  ]

  showActionSheet({
    actions,
    onSelect: (action) => {
      showToast(`已${action.name}`)
    }
  })
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
  loadUser()
  loadFeeds()
})
</script>

<style lang="scss" scoped>
.user-profile-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.user-header {
  background: #fff;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 80px;
  height: 80px;
  margin-right: 16px;
}

.info {
  flex: 1;
}

.nickname {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 8px;
}

.bio {
  font-size: 14px;
  color: #646566;
  margin-bottom: 8px;
  line-height: 1.5;
}

.meta {
  font-size: 13px;
  color: #969799;

  span {
    margin-right: 12px;
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 16px;
  gap: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #969799;
}

.user-feeds {
  padding: 0 16px 16px;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
</style>

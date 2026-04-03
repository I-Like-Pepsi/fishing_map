<template>
  <div class="profile-page">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <van-image
          round
          :src="userInfo?.avatar || defaultAvatar"
          fit="cover"
          class="avatar"
        />
        <div class="info">
          <div class="nickname">{{ userInfo?.nickname }}</div>
          <div class="bio">{{ userInfo?.bio }}</div>
        </div>
        <van-icon name="arrow" class="arrow" />
      </div>

      <div class="stats">
        <div class="stat-item" @click="goToTab('posts')">
          <div class="stat-value">{{ userInfo?.postCount || 0 }}</div>
          <div class="stat-label">动态</div>
        </div>
        <div class="stat-item" @click="goToTab('following')">
          <div class="stat-value">{{ userInfo?.followingCount || 0 }}</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item" @click="goToTab('followers')">
          <div class="stat-value">{{ userInfo?.followerCount || 0 }}</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo?.likeCount || 0 }}</div>
          <div class="stat-label">获赞</div>
        </div>
      </div>
    </div>

    <!-- Tab切换 -->
    <van-tabs v-model:active="activeTab" class="content-tabs">
      <van-tab title="动态" name="posts">
        <UserFeeds type="posts" :user-id="userId" />
      </van-tab>
      <van-tab title="收藏" name="collections">
        <UserFeeds type="collections" :user-id="userId" />
      </van-tab>
      <van-tab title="喜欢" name="likes">
        <UserFeeds type="likes" :user-id="userId" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@stores/user'
import UserFeeds from '@/components/UserFeeds/index.vue'
import { DEFAULT_AVATAR } from '@constants'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userId = ref(route.params.id as string || userStore.userId || '1')
const defaultAvatar = DEFAULT_AVATAR
const userInfo = ref(userStore.userInfo)
const activeTab = ref('posts')

const goToTab = (tab: string) => {
  activeTab.value = tab
}

onMounted(() => {
  if (!route.params.id) {
    userInfo.value = userStore.userInfo
  } else {
    // TODO: 加载其他用户信息
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.profile-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-color;
}

.profile-card {
  background: $bg-card;
  margin-bottom: 8px;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $border-color;
}

.avatar {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}

.info {
  flex: 1;
}

.nickname {
  font-size: $font-size-lg;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
}

.bio {
  font-size: 13px;
  color: $text-secondary;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.arrow {
  color: $text-light;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 16px;
}

.stat-item {
  text-align: center;
  cursor: pointer;
}

.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.content-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;

  :deep(.van-tabs__wrap) {
    flex-shrink: 0;
  }

  :deep(.van-tabs__content) {
    flex: 1;
    overflow: visible;
  }

  :deep(.van-tab__panel) {
    height: 100%;
  }
}
</style>

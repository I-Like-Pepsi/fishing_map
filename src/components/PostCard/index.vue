<template>
  <div class="post-card" @dblclick="handleLike">
    <!-- 头部 -->
    <div class="post-header">
      <div class="user-info" @click="goToUser">
        <van-image
          round
          :src="post.user.avatar"
          fit="cover"
          class="avatar"
        />
        <div class="user-detail">
          <div class="nickname">{{ post.user.nickname }}</div>
          <div class="category-badge">{{ getCategoryLabel(post.category) }}</div>
        </div>
      </div>
      <van-icon name="ellipsis" class="more-icon" @click="showActionSheet" />
    </div>

    <!-- 图片/视频展示 -->
    <div class="post-media" v-if="post.type !== 'text'">
      <template v-if="post.type === 'image' && post.images.length">
        <div class="image-grid" :class="`grid-${Math.min(post.images.length, 3)}`">
          <van-image
            v-for="(img, index) in post.images.slice(0, 9)"
            :key="index"
            :src="img"
            fit="cover"
            class="post-image"
            @click="previewImage(index)"
          />
        </div>
      </template>
      <template v-if="post.type === 'video' && post.video">
        <div class="video-wrapper">
          <van-image
            :src="post.video.cover"
            fit="cover"
            class="video-cover"
          />
          <van-icon name="play-circle-o" size="48" class="play-icon" />
        </div>
      </template>
    </div>

    <!-- 内容 -->
    <div class="post-content" v-if="post.content">
      {{ post.content }}
    </div>

    <!-- 钓点信息 -->
    <div class="post-location" v-if="post.location" @click="goToSpot">
      <van-icon name="location-o" />
      <span>{{ post.location.name }}</span>
    </div>

    <!-- 时间 -->
    <div class="post-time">
      {{ relativeTime(post.createTime) }}
    </div>

    <!-- 分隔线 -->
    <van-divider />

    <!-- 交互按钮 -->
    <div class="post-actions">
      <div class="action-item" :class="{ active: post.isLiked }" @click="handleLike">
        <van-icon :name="post.isLiked ? 'good-job' : 'good-job-o'" />
        <span>{{ formatNumber(post.likes) }}</span>
      </div>
      <div class="action-item" @click="handleComment">
        <van-icon name="comment-o" />
        <span>{{ formatNumber(post.comments) }}</span>
      </div>
      <div class="action-item" :class="{ active: post.isCollected }" @click="handleCollect">
        <van-icon :name="post.isCollected ? 'star' : 'star-o'" />
        <span>{{ formatNumber(post.collections) }}</span>
      </div>
      <div class="action-item" @click="handleShare">
        <van-icon name="share-o" />
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// defineProps, defineEmits 是编译器宏，不需要导入
import { useRouter } from 'vue-router'
import { showToast, showImagePreview, showActionSheet } from 'vant'
import type { Feed } from '@types'
import { getCategoryLabel, REPORT_REASONS } from '@constants'
import { relativeTime, formatNumber } from '@utils/format'

const props = defineProps<{
  post: Feed
}>()

const emit = defineEmits<{
  like: [id: string]
  comment: [id: string]
  collect: [id: string]
  share: [id: string]
  delete: [id: string]
}>()

const router = useRouter()

const goToUser = () => {
  router.push({ name: 'UserProfile', params: { id: props.post.userId } })
}

const goToSpot = () => {
  if (props.post.location) {
    router.push({ name: 'SpotDetail', params: { id: props.post.location.id } })
  }
}

const previewImage = (index: number) => {
  if (props.post.images && props.post.images.length) {
    showImagePreview({
      images: props.post.images,
      startPosition: index
    })
  }
}

const handleLike = () => {
  emit('like', props.post.id)
}

const handleComment = () => {
  emit('comment', props.post.id)
}

const handleCollect = () => {
  emit('collect', props.post.id)
}

const handleShare = () => {
  emit('share', props.post.id)
}

const showActionSheet = () => {
  const actions = [
    { name: '举报', value: 'report' },
    { name: '不感兴趣', value: 'not_interested' },
    { name: '屏蔽此内容', value: 'block' },
    { name: '分享', value: 'share' }
  ]

  showActionSheet({
    actions,
    onSelect: (action) => {
      if (action.value === 'report') {
        showReportAction()
      } else if (action.value === 'share') {
        handleShare()
      }
    }
  })
}

const showReportAction = () => {
  showActionSheet({
    actions: REPORT_REASONS.post.map(reason => ({ name: reason })),
    onSelect: (action) => {
      showToast(`已举报：${action.name}`)
    }
  })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.post-card {
  background: $bg-card;
  padding: 16px;
  margin-bottom: 8px;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.user-detail {
  flex: 1;
}

.nickname {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
}

.category-badge {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: 2px;
}

.more-icon {
  font-size: 20px;
  color: $text-secondary;
}

.post-media {
  margin-bottom: 12px;
}

.image-grid {
  display: grid;
  gap: 4px;

  &.grid-1 {
    grid-template-columns: 1fr;
  }

  &.grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.post-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
}

.video-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.video-cover {
  width: 100%;
  aspect-ratio: 16/9;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
}

.post-content {
  font-size: $font-size-md;
  line-height: 1.6;
  color: $text-primary;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.post-location {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 8px;
  cursor: pointer;

  .van-icon {
    margin-right: 4px;
  }
}

.post-time {
  font-size: $font-size-sm;
  color: $text-light;
  margin-bottom: 8px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-md;
  color: $text-secondary;
  cursor: pointer;
  transition: $transition-fast;

  &.active {
    color: $like-color;
  }

  .van-icon {
    font-size: 20px;
  }
}
</style>

<template>
  <div class="message-page">
    <div class="message-header">
      <span class="title">消息通知</span>
      <van-button size="small" type="default" @click="markAllRead" v-if="hasUnread">
        全部已读
      </van-button>
    </div>

    <div v-if="loading" class="loading">
      <van-loading size="24" />
    </div>

    <div v-else-if="notifications.length === 0" class="empty">
      <van-empty description="暂无消息" />
    </div>

    <div v-else class="message-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['message-item', { unread: !notification.isRead }]"
        @click="handleClick(notification)"
      >
        <van-image
          round
          :src="notification.user?.avatar || defaultAvatar"
          fit="cover"
          class="avatar"
        />
        <div class="message-content">
          <div class="message-title">
            <span class="icon">{{ getNotificationIcon(notification.type) }}</span>
            <span class="type-label">{{ getNotificationTypeLabel(notification.type) }}</span>
            <span class="time">{{ relativeTime(notification.createTime) }}</span>
          </div>
          <div class="message-text">{{ notification.content }}</div>
        </div>
        <van-icon name="arrow" class="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Notification } from '@types'
import { notificationApi } from '@api'
import { getNotificationIcon } from '@constants/notification'
import { relativeTime } from '@utils/format'
import { DEFAULT_AVATAR } from '@constants'

const router = useRouter()
const defaultAvatar = DEFAULT_AVATAR

const loading = ref(false)
const notifications = ref<Notification[]>([])

const hasUnread = computed(() =>
  notifications.value.some(n => !n.isRead)
)

const loadNotifications = async () => {
  loading.value = true
  try {
    notifications.value = await notificationApi.getList({ page: 1, size: 50 })
  } finally {
    loading.value = false
  }
}

const getNotificationTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    comment: '评论',
    reply: '回复',
    like: '点赞',
    collect: '收藏',
    follow: '关注',
    audit_pass: '审核通过',
    audit_fail: '审核失败'
  }
  return typeMap[type] || '消息'
}

const handleClick = async (notification: Notification) => {
  if (!notification.isRead) {
    await notificationApi.read(notification.id)
    notification.isRead = true
  }

  if (notification.type === 'follow') {
    if (notification.user) {
      router.push({ name: 'UserProfile', params: { id: notification.user.id } })
    }
  } else {
    router.push({ name: 'PostDetail', params: { id: notification.relatedId } })
  }
}

const markAllRead = async () => {
  try {
    await notificationApi.readAll()
    notifications.value.forEach(n => n.isRead = true)
    showToast('已全部标记为已读')
  } catch {
    showToast('操作失败')
  }
}

onMounted(() => {
  loadNotifications()
})
</script>

<style lang="scss" scoped>
.message-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }
}

.loading,
.empty {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;

  &:active {
    background: #f7f8fa;
  }

  &.unread {
    background: #fffdf;
  }
}

.avatar {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .icon {
    font-size: 16px;
  }

  .type-label {
    font-size: 14px;
    font-weight: 500;
    color: #323233;
  }

  .time {
    margin-left: auto;
    font-size: 12px;
    color: #c8c9cc;
  }
}

.message-text {
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.arrow {
  margin-left: 8px;
  color: #c8c9cc;
  font-size: 16px;
}
</style>

<template>
  <div class="comment-item">
    <van-image
      round
      :src="comment.user.avatar"
      fit="cover"
      class="avatar"
      @click="goToUser"
    />
    <div class="comment-content">
      <div class="comment-header">
        <span class="username" @click="goToUser">{{ comment.user.nickname }}</span>
        <span class="reply-to" v-if="comment.replyToUser">
          回复 {{ comment.replyToUser.nickname }}
        </span>
        <span class="time">{{ relativeTime(comment.createTime) }}</span>
      </div>
      <div class="comment-text">{{ comment.content }}</div>
      <div class="comment-actions">
        <div class="action-item" @click="handleLike">
          <van-icon :name="comment.isLiked ? 'good-job' : 'good-job-o'" size="14" />
          <span>{{ comment.likes || '赞' }}</span>
        </div>
        <div class="action-item" @click="handleReply">
          回复
        </div>
      </div>
      <!-- 子回复 -->
      <div class="replies" v-if="comment.replies && comment.replies.length">
        <template v-if="!comment.showAllReplies && comment.replies.length > 2">
          <CommentItem
            v-for="reply in comment.replies.slice(0, 2)"
            :key="reply.id"
            :comment="reply"
            is-nested
            @like="$emit('like', $event)"
            @reply="$emit('reply', $event)"
          />
          <div class="show-more" @click="showAllReplies">
            展开{{ comment.replies.length - 2 }}条回复
          </div>
        </template>
        <template v-else>
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            is-nested
            @like="$emit('like', $event)"
            @reply="$emit('reply', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// defineProps, defineEmits 是编译器宏，不需要导入
import { useRouter } from 'vue-router'
import type { Comment } from '@types'
import { relativeTime } from '@utils/format'
import CommentItem from './CommentItem.vue'

const props = defineProps<{
  comment: Comment
  isNested?: boolean
}>()

const emit = defineEmits<{
  like: [comment: Comment]
  reply: [comment: Comment]
}>()

const router = useRouter()

const goToUser = () => {
  router.push({ name: 'UserProfile', params: { id: props.comment.userId } })
}

const handleLike = () => {
  emit('like', { ...props.comment })
}

const handleReply = () => {
  emit('reply', props.comment)
}

const showAllReplies = () => {
  props.comment.showAllReplies = true
}
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.avatar {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.username {
  font-size: 13px;
  font-weight: 500;
  color: #323233;
  cursor: pointer;
}

.reply-to {
  font-size: 13px;
  color: #969799;
}

.time {
  font-size: 12px;
  color: #c8c9cc;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #323233;
  margin-bottom: 8px;
  word-break: break-all;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #969799;
  cursor: pointer;
}

.replies {
  margin-top: 12px;
  padding-left: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.show-more {
  font-size: 13px;
  color: #1989fa;
  cursor: pointer;
  padding: 4px 0;
}
</style>

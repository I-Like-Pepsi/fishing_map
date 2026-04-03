<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    round
    :style="{ height: '70vh' }"
  >
    <div class="comment-popup">
      <div class="comment-header">
        <span class="title">评论 ({{ comments.length }})</span>
        <van-icon name="cross" @click="close" />
      </div>

      <div class="comment-list">
        <div v-if="loading" class="loading">
          <van-loading size="24" />
        </div>
        <div v-else-if="comments.length === 0" class="empty">
          <van-empty description="暂无评论" />
        </div>
        <div v-else>
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @like="handleLike"
            @reply="handleReply"
          />
        </div>
      </div>

      <div class="comment-input-wrapper">
        <div class="reply-hint" v-if="replyingTo">
          回复 {{ replyingTo.user.nickname }}
          <van-icon name="cross" @click="clearReply" />
        </div>
        <div class="comment-input">
          <van-field
            v-model="content"
            placeholder="说点什么..."
            :maxlength="MAX_COMMENT_LENGTH"
            autosize
            type="textarea"
            rows="1"
          />
          <van-button
            type="primary"
            size="small"
            :disabled="!content.trim()"
            :loading="submitting"
            @click="submit"
          >
            发送
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'
import type { Comment } from '@types'
import { MAX_COMMENT_LENGTH } from '@constants'
import { commentApi } from '@api'
import { relativeTime } from '@utils/format'
import CommentItem from './CommentItem.vue'

const props = defineProps<{
  postId: string
}>()

const show = defineModel<boolean>({ default: false })
const loading = ref(false)
const comments = ref<Comment[]>([])
const content = ref('')
const submitting = ref(false)
const replyingTo = ref<Comment | null>(null)

const loadComments = async () => {
  loading.value = true
  try {
    comments.value = await commentApi.getList(props.postId, { page: 1, size: 50 })
  } finally {
    loading.value = false
  }
}

const handleLike = async (comment: Comment) => {
  const res = await commentApi.like(comment.id)
  comment.isLiked = res.isLiked
  comment.likes += res.isLiked ? 1 : -1
}

const handleReply = (comment: Comment) => {
  replyingTo.value = comment
  content.value = `@${comment.user.nickname} `
}

const clearReply = () => {
  replyingTo.value = null
  content.value = ''
}

const submit = async () => {
  if (!content.value.trim()) return

  submitting.value = true
  try {
    const newComment = await commentApi.create({
      postId: props.postId,
      content: content.value,
      replyTo: replyingTo.value?.id
    })
    comments.value.unshift(newComment)
    content.value = ''
    replyingTo.value = null
    showToast('评论成功')
  } finally {
    submitting.value = false
  }
}

const close = () => {
  show.value = false
}

watch(show, (val) => {
  if (val) {
    loadComments()
  }
})
</script>

<style lang="scss" scoped>
.comment-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 16px;
    font-weight: 500;
  }
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.comment-input-wrapper {
  border-top: 1px solid #eee;
  padding: 12px 16px;
}

.reply-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f7f8fa;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;

  .van-icon {
    cursor: pointer;
  }
}

.comment-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;

  .van-field {
    flex: 1;
    padding: 8px !important;
    background: #f7f8fa;
    border-radius: 20px;
  }
}
</style>

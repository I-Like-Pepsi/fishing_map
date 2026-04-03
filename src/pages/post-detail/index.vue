<template>
  <div class="post-detail-page">
    <div v-if="loading" class="loading">
      <van-loading size="24" />
    </div>

    <template v-else-if="post">
      <PostCard
        :post="post"
        @like="handleLike"
        @comment="handleComment"
        @collect="handleCollect"
        @share="handleShare"
      />

      <!-- 评论区 -->
      <div class="comments-section">
        <div class="comments-header">评论 {{ post.comments }}</div>

        <div v-if="commentsLoading" class="comments-loading">
          <van-loading size="20" />
        </div>

        <div v-else-if="comments.length === 0" class="comments-empty">
          <van-empty description="暂无评论" :image-size="80" />
        </div>

        <div v-else class="comments-list">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @like="handleCommentLike"
            @reply="handleReply"
          />
        </div>

        <!-- 评论输入框 -->
        <div class="comment-input-wrapper">
          <div class="reply-hint" v-if="replyingTo">
            回复 {{ replyingTo.user.nickname }}
            <van-icon name="cross" size="14" @click="clearReply" />
          </div>
          <div class="comment-input">
            <van-field
              v-model="commentContent"
              placeholder="说点什么..."
              :maxlength="MAX_COMMENT_LENGTH"
              autosize
              type="textarea"
              rows="1"
            />
            <van-button
              type="primary"
              size="small"
              :disabled="!commentContent.trim()"
              :loading="submitting"
              @click="submitComment"
            >
              发送
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <van-empty v-else description="动态不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import type { Feed, Comment } from '@types'
import { feedApi, commentApi } from '@api'
import PostCard from '@/components/PostCard/index.vue'
import CommentItem from '@/components/CommentList/CommentItem.vue'
import { MAX_COMMENT_LENGTH } from '@constants'

const route = useRoute()
const postId = route.params.id as string

const loading = ref(false)
const post = ref<Feed | null>(null)

const commentsLoading = ref(false)
const comments = ref<Comment[]>([])
const commentContent = ref('')
const submitting = ref(false)
const replyingTo = ref<Comment | null>(null)

const loadPost = async () => {
  loading.value = true
  try {
    post.value = await feedApi.getDetail(postId)
  } finally {
    loading.value = false
  }
}

const loadComments = async () => {
  commentsLoading.value = true
  try {
    comments.value = await commentApi.getList(postId, { page: 1, size: 50 })
  } finally {
    commentsLoading.value = false
  }
}

const handleLike = async (id: string) => {
  if (!post.value || post.value.id !== id) return

  post.value.isLiked = !post.value.isLiked
  post.value.likes += post.value.isLiked ? 1 : -1

  try {
    await feedApi.like(id)
  } catch {
    post.value.isLiked = !post.value.isLiked
    post.value.likes += post.value.isLiked ? 1 : -1
  }
}

const handleComment = () => {
  // 评论通过底部输入框处理
}

const handleCollect = async (id: string) => {
  if (!post.value || post.value.id !== id) return

  post.value.isCollected = !post.value.isCollected
  post.value.collections += post.value.isCollected ? 1 : -1

  try {
    await feedApi.collect(id)
    showToast(post.value.isCollected ? '已收藏' : '已取消收藏')
  } catch {
    post.value.isCollected = !post.value.isCollected
    post.value.collections += post.value.isCollected ? 1 : -1
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

const handleCommentLike = async (comment: Comment) => {
  const targetComment = comments.value.find(c => c.id === comment.id)
  if (!targetComment) return

  targetComment.isLiked = !targetComment.isLiked
  targetComment.likes += targetComment.isLiked ? 1 : -1

  try {
    await commentApi.like(comment.id)
  } catch {
    targetComment.isLiked = !targetComment.isLiked
    targetComment.likes += targetComment.isLiked ? 1 : -1
  }
}

const handleReply = (comment: Comment) => {
  replyingTo.value = comment
  commentContent.value = `@${comment.user.nickname} `
}

const clearReply = () => {
  replyingTo.value = null
  commentContent.value = ''
}

const submitComment = async () => {
  if (!commentContent.value.trim()) return

  submitting.value = true
  try {
    const newComment = await commentApi.create({
      postId,
      content: commentContent.value,
      replyTo: replyingTo.value?.id
    })

    comments.value.unshift(newComment)
    if (post.value) {
      post.value.comments++
    }

    commentContent.value = ''
    replyingTo.value = null
    showToast('评论成功')
  } catch {
    showToast('评论失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadPost()
  loadComments()
})
</script>

<style lang="scss" scoped>
.post-detail-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.comments-section {
  margin-top: 8px;
  background: #fff;
  padding: 16px;
}

.comments-header {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 16px;
}

.comments-loading,
.comments-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.comments-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.comment-input-wrapper {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
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

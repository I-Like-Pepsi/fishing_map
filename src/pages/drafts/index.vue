<template>
  <div class="drafts-page">
    <van-nav-bar
      title="草稿箱"
      left-arrow
      @click-left="router.back()"
    />

    <div v-if="drafts.length === 0" class="empty">
      <van-empty description="暂无草稿" :image-size="80" />
    </div>

    <div v-else class="drafts-list">
      <div
        v-for="draft in drafts"
        :key="draft.id"
        class="draft-item"
        @click="editDraft(draft)"
      >
        <div class="draft-preview">
          <div class="draft-type-icon">
            <van-icon
              :name="draft.contentType === 'image' ? 'photo-o' : draft.contentType === 'video' ? 'video-o' : 'notes-o'"
              size="32"
            />
          </div>
          <div class="draft-info">
            <div class="draft-content">{{ draft.content || '无内容' }}</div>
            <div class="draft-time">{{ formatTime(draft.createTime) }}</div>
          </div>
          <van-icon
            name="delete-o"
            size="20"
            color="#ff4d4f"
            class="delete-icon"
            @click.stop="deleteDraft(draft.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useDraftStore } from '@stores/draft'
import { formatTime } from '@/utils/format'

const router = useRouter()
const draftStore = useDraftStore()

interface Draft {
  id: string
  contentType?: 'image' | 'video' | 'text'
  content: string
  category: string
  images: string[]
  video: { url: string; cover: string } | null
  selectedSpot: any
  createTime: Date
}

const drafts = ref<Draft[]>([])

const editDraft = (draft: Draft) => {
  // TODO: 实现继续编辑草稿
  showToast('继续编辑功能开发中')
}

const deleteDraft = async (id: string) => {
  const confirmed = await showConfirmDialog({
    title: '确认删除',
    message: '确定要删除这个草稿吗？'
  })

  if (confirmed) {
    draftStore.deleteDraft(id)
    drafts.value = drafts.value.filter(d => d.id !== id)
    showToast('草稿已删除')
  }
}

onMounted(() => {
  draftStore.loadFromLocal()
  drafts.value = draftStore.drafts as Draft[]
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.drafts-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-color;
}

.empty {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drafts-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.draft-item {
  background: $bg-card;
  margin: 8px 16px;
  border-radius: $border-radius;
  cursor: pointer;
}

.draft-preview {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.draft-type-icon {
  background: $bg-color-dark;
  width: 56px;
  height: 56px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draft-info {
  flex: 1;
  min-width: 0;
}

.draft-content {
  font-size: $font-size-md;
  color: $text-primary;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.draft-time {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.delete-icon {
  flex-shrink: 0;
}
</style>

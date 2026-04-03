<template>
  <div class="publish-page">
    <van-nav-bar
      title="发布动态"
      left-text="取消"
      left-arrow
      @click-left="onCancel"
    >
      <template #right>
        <van-button
          type="primary"
          size="small"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="onSubmit"
        >
          发布
        </van-button>
      </template>
    </van-nav-bar>

    <div class="publish-content">
      <!-- 内容类型选择 -->
      <div class="content-type" v-if="!contentType">
        <div class="type-option" @click="selectType('image')">
          <van-icon name="photo-o" size="48" color="#2F80ED" />
          <span>图片</span>
        </div>
        <div class="type-option" @click="selectType('video')">
          <van-icon name="video-o" size="48" color="#2F80ED" />
          <span>视频</span>
        </div>
        <div class="type-option" @click="selectType('text')">
          <van-icon name="notes-o" size="48" color="#2F80ED" />
          <span>文字</span>
        </div>
      </div>

      <!-- 编辑内容 -->
      <template v-else>
        <!-- 切换内容类型 -->
        <div class="type-switch">
          <div
            v-for="type in contentTypes"
            :key="type.value"
            :class="['type-item', { active: contentType === type.value }]"
            @click="selectType(type.value)"
          >
            <van-icon :name="type.icon" size="20" />
          </div>
        </div>

        <!-- 图片展示 -->
        <div class="media-section" v-if="contentType === 'image'">
          <div class="image-grid" v-if="images.length">
            <div v-for="(img, index) in images" :key="index" class="image-item">
              <van-image :src="img" fit="cover" @click="previewImage(index)" />
              <van-icon name="cross" class="delete-icon" @click="deleteImage(index)" />
            </div>
            <div v-if="canAddMore" class="add-image" @click="selectImages">
              <van-icon name="plus" size="32" />
              <span>添加图片</span>
            </div>
          </div>
          <div v-else class="empty-media" @click="selectImages">
            <van-icon name="photo-o" size="48" />
            <span>添加图片</span>
          </div>
        </div>

        <!-- 视频展示 -->
        <div class="media-section" v-if="contentType === 'video'">
          <div v-if="video" class="video-preview">
            <van-icon name="play-circle-o" size="48" />
            <van-icon name="cross" class="delete-icon" @click="clearVideo" />
          </div>
          <div v-else class="empty-media" @click="selectVideo">
            <van-icon name="video-o" size="48" />
            <span>添加视频</span>
          </div>
        </div>

        <!-- 文字输入 -->
        <van-field
          v-model="content"
          type="textarea"
          rows="4"
          autosize
          placeholder="分享你的钓鱼故事..."
          :maxlength="MAX_CONTENT_LENGTH"
          show-word-limit
          class="content-input"
        />

        <!-- 分类选择 -->
        <div class="category-section">
          <div class="section-title">选择分类</div>
          <van-radio-group v-model="category" direction="horizontal">
            <van-radio
              v-for="cat in CATEGORIES"
              :key="cat.value"
              :name="cat.value"
              :icon-name="cat.icon"
            >
              {{ cat.label }}
            </van-radio>
          </van-radio-group>
        </div>

        <!-- 关联钓点 -->
        <van-cell
          title="关联钓点"
          is-link
          :value="selectedSpot?.name || '选填'"
          @click="showSpotPicker = true"
        />
      </template>
    </div>

    <!-- 钓点选择器 -->
    <LocationPicker
      v-model:show="showSpotPicker"
      v-model="selectedSpot"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showImagePreview } from 'vant'
import { useDraftStore } from '@stores/draft'
import type { Location } from '@types'
import { MAX_CONTENT_LENGTH, MAX_IMAGE_COUNT, CATEGORIES } from '@constants'
import { feedApi } from '@api'
import LocationPicker from '@/components/LocationPicker/index.vue'

const router = useRouter()
const draftStore = useDraftStore()

const contentTypes = [
  { value: 'image', icon: 'photo-o' },
  { value: 'video', icon: 'video-o' },
  { value: 'text', icon: 'notes-o' }
]

const contentType = ref<'image' | 'video' | 'text'>()
const content = ref('')
const category = ref('')
const images = ref<string[]>([])
const video = ref<{ url: string; cover: string } | null>(null)
const selectedSpot = ref<Location | null>(null)
const showSpotPicker = ref(false)
const submitting = ref(false)

const canSubmit = computed(() => {
  return contentType.value && content.value.length > 0 && category.value
})

const canAddMore = computed(() => images.value.length < MAX_IMAGE_COUNT)

const selectType = (type: typeof contentType.value) => {
  contentType.value = type
  if (type === 'image' && !images.value.length) {
    selectImages()
  }
}

const selectImages = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true

  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return

    const remaining = MAX_IMAGE_COUNT - images.value.length
    if (files.length > remaining) {
      showToast(`最多选择${MAX_IMAGE_COUNT}张图片`)
      return
    }

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file)
      images.value.push(url)
    })
  }

  input.click()
}

const previewImage = (index: number) => {
  showImagePreview({
    images: images.value,
    startPosition: index
  })
}

const deleteImage = (index: number) => {
  images.value.splice(index, 1)
}

const clearVideo = () => {
  video.value = null
}

const selectVideo = () => {
  showToast('视频上传功能开发中')
}

const onSubmit = async () => {
  if (!canSubmit.value) return

  submitting.value = true
  try {
    await feedApi.create({
      type: contentType.value!,
      category: category.value,
      content: content.value,
      images: contentType.value === 'image' ? images.value : undefined,
      video: contentType.value === 'video' ? video.value : undefined,
      locationId: selectedSpot.value?.id
    })
    showToast('发布成功，请等待审核')
    draftStore.clearDraft()
    router.back()
  } catch (error) {
    showToast('发布失败')
  } finally {
    submitting.value = false
  }
}

const onCancel = async () => {
  if (contentType.value && content.value.length > 0) {
    const confirmed = await showConfirmDialog({
      title: '确认退出',
      message: '内容未发布，是否保存为草稿？'
    })

    if (confirmed) {
      draftStore.saveDraft({
        contentType: contentType.value,
        content: content.value,
        category: category.value,
        images: images.value,
        video: video.value,
        selectedSpot: selectedSpot.value
      })
      showToast('已保存为草稿')
    }
  }

  router.back()
}

onMounted(() => {
  // TODO: 检查是否有草稿
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.publish-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-color;
}

.publish-content {
  flex: 1;
  overflow-y: auto;
}

.content-type {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 32px 16px;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: $bg-card;
  border-radius: 12px;
  cursor: pointer;
  transition: $transition-fast;

  &:active {
    transform: scale(0.95);
  }

  span {
    font-size: $font-size-md;
    color: $text-primary;
  }
}

.type-switch {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: $bg-card;
  margin-bottom: 8px;
}

.type-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: $bg-color-dark;
  cursor: pointer;

  &.active {
    background: $primary-light;
    color: $primary-dark;
  }
}

.media-section {
  padding: 16px;
  background: $bg-card;
  margin-bottom: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  .van-image {
    width: 100%;
    height: 100%;
  }
}

.delete-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  z-index: 2;
}

.add-image,
.empty-media {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: $bg-color-dark;
  border: 2px dashed $border-color;
  border-radius: $border-radius;
  cursor: pointer;
  color: $text-secondary;

  span {
    font-size: $font-size-sm;
  }
}

.video-preview {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;

  .van-icon {
    color: rgba(255, 255, 255, 0.8);
  }
}

.content-input {
  background: $bg-card;
  margin-bottom: 8px;
}

.category-section {
  padding: 16px;
  background: $bg-card;
  margin-bottom: 8px;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 12px;
}
</style>

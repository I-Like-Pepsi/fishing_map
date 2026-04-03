import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { MAX_IMAGE_COUNT, IMAGE_MAX_SIZE } from '@constants'

export function useImagePicker() {
  const images = ref<string[]>([])

  const remainingCount = computed(() => MAX_IMAGE_COUNT - images.value.length)
  const canAddMore = computed(() => images.value.length < MAX_IMAGE_COUNT)

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
        if (file.size > IMAGE_MAX_SIZE) {
          showToast('图片大小不能超过10MB')
          return
        }

        const url = URL.createObjectURL(file)
        images.value.push(url)
      })
    }

    input.click()
  }

  const deleteImage = (index: number) => {
    images.value.splice(index, 1)
  }

  const clearImages = () => {
    images.value = []
  }

  const previewImage = (index: number) => {
    // TODO: 实现图片预览
    console.log('预览图片', index)
  }

  return {
    images,
    remainingCount,
    canAddMore,
    selectImages,
    deleteImage,
    clearImages,
    previewImage
  }
}

import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: () => boolean
) {
  const loading = ref(false)
  const page = ref(1)

  const handleScroll = () => {
    if (loading.value || !hasMore()) return

    const scrollTop = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore()
    }
  }

  const load = async () => {
    if (loading.value || !hasMore()) return
    loading.value = true
    await loadMore()
    loading.value = false
  }

  const reset = () => {
    page.value = 1
    loading.value = false
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    loading,
    page,
    load,
    reset
  }
}

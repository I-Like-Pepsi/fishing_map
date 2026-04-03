import { computed } from 'vue'
import { useUserStore } from '@stores/user'
import { useRouter } from 'vue-router'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  const isLoggedIn = computed(() => userStore.isLoggedIn)
  const userInfo = computed(() => userStore.userInfo)

  const checkAuth = () => {
    if (!isLoggedIn.value) {
      router.push({ name: 'Login' })
      return false
    }
    return true
  }

  const requireAuth = () => {
    if (!checkAuth()) {
      throw new Error('需要登录')
    }
  }

  return {
    isLoggedIn,
    userInfo,
    checkAuth,
    requireAuth
  }
}

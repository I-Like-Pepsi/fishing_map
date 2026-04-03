import { defineStore } from 'pinia'
import type { User } from '@types'

interface UserState {
  token: string | null
  userInfo: User | null
  isLoggedIn: boolean
}

const DEFAULT_AVATAR = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    userInfo: null,
    isLoggedIn: false
  }),

  getters: {
    userId: (state) => state.userInfo?.id,
    avatar: (state) => state.userInfo?.avatar || DEFAULT_AVATAR,
    nickname: (state) => state.userInfo?.nickname || '未登录'
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isLoggedIn = !!token
    },

    setUserInfo(userInfo: User) {
      this.userInfo = userInfo
    },

    async login(phone: string, code: string) {
      // 模拟登录
      this.setToken('mock_token_' + Date.now())
      this.setUserInfo({
        id: '1',
        phone,
        nickname: '钓鱼爱好者',
        avatar: DEFAULT_AVATAR,
        bio: '热爱钓鱼，享受生活！',
        fishingAge: 3,
        region: '北京',
        privacy: {
          whoCanComment: 'all'
        },
        followingCount: 89,
        followerCount: 324,
        likeCount: 1560,
        postCount: 156,
        status: 'normal',
        createTime: new Date().toISOString()
      })
    },

    async logout() {
      this.token = null
      this.userInfo = null
      this.isLoggedIn = false
    },

    async refreshUserInfo() {
      // 模拟刷新用户信息
      if (!this.token) return
    }
  },

  persist: {
    key: 'fishing-user',
    storage: localStorage,
    paths: ['token', 'userInfo', 'isLoggedIn']
  }
})

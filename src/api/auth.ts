import type { User } from '@types'
import { mockDelay, mockUsers } from './mock'

export const authApi = {
  // 发送验证码
  async sendCode(phone: string): Promise<void> {
    await mockDelay(500)
  },

  // 登录
  async login(params: { phone: string; code: string }): Promise<{ token: string; user: User }> {
    await mockDelay(800)
    return {
      token: 'mock_token_' + Date.now(),
      user: mockUsers[0]
    }
  },

  // 登出
  async logout(): Promise<void> {
    await mockDelay(300)
  },

  // 获取用户信息
  async getUserInfo(): Promise<User> {
    await mockDelay(300)
    return mockUsers[0]
  }
}

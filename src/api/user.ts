import type { User } from '@types'
import { mockUsers, mockDelay } from './mock'

export const userApi = {
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
  async getProfile(id: string): Promise<User> {
    await mockDelay(300)
    return mockUsers.find(u => u.id === id) || mockUsers[0]
  },

  // 更新用户信息
  async updateProfile(data: Partial<User>): Promise<User> {
    await mockDelay(500)
    return { ...mockUsers[0], ...data }
  },

  // 关注/取消关注
  async follow(id: string): Promise<{ isFollowing: boolean }> {
    await mockDelay(300)
    return { isFollowing: true }
  },

  // 获取关注列表
  async getFollowing(id: string, params: { page: number; size: number }): Promise<User[]> {
    await mockDelay(300)
    return mockUsers.slice(0, params.size)
  },

  // 获取粉丝列表
  async getFollowers(id: string, params: { page: number; size: number }): Promise<User[]> {
    await mockDelay(300)
    return mockUsers.slice(0, params.size)
  },

  // 举报用户
  async report(id: string, data: { reason: string; remark?: string }): Promise<void> {
    await mockDelay(500)
  }
}

import type { Feed, FeedListParams, CreateFeedParams } from '@types'
import { mockFeeds, mockDelay, getMockData, generateMockFeeds } from './mock'

export const feedApi = {
  // 获取动态列表
  async getList(params: FeedListParams): Promise<Feed[]> {
    await mockDelay(300)
    if (params.tab === 'following') {
      return getMockData(mockFeeds.filter(f => f.userId === '1'), params.page, params.size)
    }
    return getMockData(mockFeeds, params.page, params.size)
  },

  // 获取动态详情
  async getDetail(id: string): Promise<Feed> {
    await mockDelay(300)
    return mockFeeds.find(f => f.id === id) || mockFeeds[0]
  },

  // 获取用户动态
  async getUserFeeds(userId: string, params: { page: number; size: number }): Promise<Feed[]> {
    await mockDelay(300)
    const userFeeds = mockFeeds.filter(f => f.userId === userId)
    return getMockData(userFeeds, params.page, params.size)
  },

  // 创建动态
  async create(data: CreateFeedParams): Promise<{ id: string }> {
    await mockDelay(1000)
    return { id: Date.now().toString() }
  },

  // 删除动态
  async delete(id: string): Promise<void> {
    await mockDelay(500)
  },

  // 点赞/取消点赞
  async like(id: string): Promise<{ isLiked: boolean }> {
    await mockDelay(300)
    return { isLiked: true }
  },

  // 收藏/取消收藏
  async collect(id: string): Promise<{ isCollected: boolean }> {
    await mockDelay(300)
    return { isCollected: true }
  },

  // 记录分享
  async share(id: string): Promise<void> {
    await mockDelay(200)
  },

  // 举报动态
  async report(id: string, data: { reason: string; remark?: string }): Promise<void> {
    await mockDelay(500)
  }
}

import { mockDelay } from './mock'
import type { Feed, User } from '@types'

interface SearchResult {
  feeds: Feed[]
  users: User[]
  spots: any[]
}

export const searchApi = {
  // 全局搜索
  async search(params: { keyword: string; type?: string }): Promise<SearchResult> {
    await mockDelay(500)
    return {
      feeds: [],
      users: [],
      spots: []
    }
  },

  // 获取搜索历史
  async getHistory(): Promise<string[]> {
    await mockDelay(200)
    return []
  },

  // 清除搜索历史
  async clearHistory(): Promise<void> {
    await mockDelay(200)
  }
}

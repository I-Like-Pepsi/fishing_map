import type { Notification } from '@types'
import { mockNotifications, mockDelay, getMockData } from './mock'

export const notificationApi = {
  // 获取通知列表
  async getList(params: { page: number; size: number }): Promise<Notification[]> {
    await mockDelay(300)
    return getMockData(mockNotifications, params.page, params.size)
  },

  // 标记已读
  async read(id: string): Promise<void> {
    await mockDelay(200)
  },

  // 批量已读
  async readAll(): Promise<void> {
    await mockDelay(300)
  }
}

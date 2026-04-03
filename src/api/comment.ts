import type { Comment, CreateCommentParams } from '@types'
import { mockComments, mockDelay, getMockData } from './mock'

export const commentApi = {
  // 获取评论列表
  async getList(postId: string, params: { page: number; size: number }): Promise<Comment[]> {
    await mockDelay(300)
    const postComments = mockComments.filter(c => c.postId === postId)
    return getMockData(postComments, params.page, params.size)
  },

  // 发表评论
  async create(data: CreateCommentParams): Promise<Comment> {
    await mockDelay(500)
    return {
      id: Date.now().toString(),
      postId: data.postId,
      userId: '1',
      user: {
        id: '1',
        nickname: '钓鱼达人',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
      },
      content: data.content,
      likes: 0,
      isLiked: false,
      createTime: new Date().toISOString()
    }
  },

  // 点赞评论
  async like(id: string): Promise<{ isLiked: boolean }> {
    await mockDelay(300)
    return { isLiked: true }
  },

  // 删除评论
  async delete(id: string): Promise<void> {
    await mockDelay(300)
  },

  // 举报评论
  async report(id: string, data: { reason: string; remark?: string }): Promise<void> {
    await mockDelay(500)
  }
}

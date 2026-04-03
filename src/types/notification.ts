import type { NotificationType } from './common'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  content: string
  relatedId: string
  isRead: boolean
  createTime: string
  user?: {
    id: string
    nickname: string
    avatar: string
  }
}

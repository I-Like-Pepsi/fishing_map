export interface PageInfo {
  page: number
  size: number
  total?: number
  hasMore?: boolean
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export type PostStatus = 'normal' | 'auditing' | 'rejected' | 'deleted'
export type CommentStatus = 'normal' | 'deleted'
export type UserStatus = 'normal' | 'auditing' | 'banned'
export type ContentType = 'image' | 'video' | 'text'
export type NotificationType =
  | 'comment'
  | 'reply'
  | 'like'
  | 'collect'
  | 'follow'
  | 'audit_pass'
  | 'audit_fail'

export interface Comment {
  id: string
  postId: string
  userId: string
  user: {
    id: string
    nickname: string
    avatar: string
  }
  content: string
  replyTo?: string
  replyToUser?: {
    id: string
    nickname: string
    avatar: string
  }
  likes: number
  isLiked?: boolean
  createTime: string
  replies?: Comment[]
  showAllReplies?: boolean
}

export interface CreateCommentParams {
  postId: string
  content: string
  replyTo?: string
}

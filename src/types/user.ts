export interface User {
  id: string
  phone: string
  nickname: string
  avatar: string
  bio: string
  fishingAge: number
  region: string
  privacy: {
    whoCanComment: 'all' | 'following' | 'self'
  }
  followingCount: number
  followerCount: number
  likeCount: number
  postCount: number
  status: 'normal' | 'auditing' | 'banned'
  createTime: string
  isFollowing?: boolean
  isMutual?: boolean
}

export interface Location {
  id: string
  name: string
  address: string
}

export interface Feed {
  id: string
  userId: string
  user: {
    id: string
    nickname: string
    avatar: string
  }
  type: 'image' | 'video' | 'text'
  category: string
  content: string
  images: string[]
  video?: {
    url: string
    cover: string
  }
  location?: Location
  likes: number
  comments: number
  shares: number
  collections: number
  status: 'normal' | 'auditing' | 'rejected' | 'deleted'
  isLiked?: boolean
  isCollected?: boolean
  createTime: string
  updateTime: string
}

export interface CreateFeedParams {
  type: 'image' | 'video' | 'text'
  category: string
  content: string
  images?: string[]
  video?: {
    url: string
    cover: string
  }
  locationId?: string
}

export interface FeedListParams {
  tab: 'following' | 'recommend'
  page: number
  size: number
}

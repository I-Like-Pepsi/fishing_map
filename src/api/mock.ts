import type { Feed, User, Comment, Notification } from '@types'
import { DEFAULT_AVATAR } from '@constants'

// Mock用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    phone: '13800138000',
    nickname: '钓鱼达人',
    avatar: DEFAULT_AVATAR,
    bio: '热爱台钓，喜欢野钓',
    fishingAge: 5,
    region: '北京',
    privacy: {
      whoCanComment: 'all'
    },
    followingCount: 156,
    followerCount: 324,
    likeCount: 1560,
    postCount: 89,
    status: 'normal',
    createTime: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    phone: '13900139000',
    nickname: '野钓王者',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    bio: '专业野钓15年',
    fishingAge: 15,
    region: '上海',
    privacy: {
      whoCanComment: 'all'
    },
    followingCount: 89,
    followerCount: 456,
    likeCount: 2340,
    postCount: 156,
    status: 'normal',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    phone: '13700137000',
    nickname: '新手钓友',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    bio: '刚开始学习钓鱼',
    fishingAge: 1,
    region: '广州',
    privacy: {
      whoCanComment: 'all'
    },
    followingCount: 23,
    followerCount: 12,
    likeCount: 45,
    postCount: 8,
    status: 'normal',
    createTime: '2024-03-01T00:00:00Z'
  }
]

// Mock动态数据
export const mockFeeds: Feed[] = [
  {
    id: '1',
    userId: '1',
    user: {
      id: '1',
      nickname: '钓鱼达人',
      avatar: DEFAULT_AVATAR
    },
    type: 'image',
    category: 'fish_show',
    content: '今天运气不错，去XX水库钓了半天，拉上来5条鲤鱼，最大的这条有4斤！',
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ],
    likes: 128,
    comments: 32,
    shares: 12,
    collections: 56,
    status: 'normal',
    isLiked: false,
    isCollected: false,
    createTime: '2024-04-03T08:00:00Z',
    updateTime: '2024-04-03T08:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    user: {
      id: '2',
      nickname: '野钓王者',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    },
    type: 'video',
    category: 'fishing_skill',
    content: '分享一个野钓技巧，关于饵料配比的心得...',
    images: [],
    video: {
      url: 'https://example.com/video.mp4',
      cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    },
    location: {
      id: '1',
      name: 'XX水库',
      address: '北京市XX区XX水库'
    },
    likes: 256,
    comments: 45,
    shares: 28,
    collections: 89,
    status: 'normal',
    isLiked: true,
    isCollected: false,
    createTime: '2024-04-02T10:00:00Z',
    updateTime: '2024-04-02T10:00:00Z'
  },
  {
    id: '3',
    userId: '3',
    user: {
      id: '3',
      nickname: '新手钓友',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    },
    type: 'text',
    category: 'equipment',
    content: '求大神推荐一款入门级鱼竿，预算500以内，主要钓野河鲤鱼和鲫鱼。刚开始学习钓鱼，希望能得到大家的建议！',
    images: [],
    likes: 23,
    comments: 18,
    shares: 5,
    collections: 12,
    status: 'normal',
    isLiked: false,
    isCollected: false,
    createTime: '2024-04-02T14:00:00Z',
    updateTime: '2024-04-02T14:00:00Z'
  },
  {
    id: '4',
    userId: '1',
    user: {
      id: '1',
      nickname: '钓鱼达人',
      avatar: DEFAULT_AVATAR
    },
    type: 'image',
    category: 'spot_recommend',
    content: '推荐一个好钓点：XX河段，水质清澈，鱼情不错，上周去钓了半天，收获颇丰！',
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ],
    location: {
      id: '2',
      name: 'XX河段',
      address: '上海市XX区XX河'
    },
    likes: 89,
    comments: 24,
    shares: 15,
    collections: 34,
    status: 'normal',
    isLiked: false,
    isCollected: false,
    createTime: '2024-04-01T09:00:00Z',
    updateTime: '2024-04-01T09:00:00Z'
  }
]

// Mock评论数据
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    user: {
      id: '2',
      nickname: '野钓王者',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    },
    content: '这条鱼真不错，用的什么饵料？',
    likes: 5,
    isLiked: false,
    createTime: '2024-04-03T08:30:00Z',
    replies: [
      {
        id: '2',
        postId: '1',
        userId: '1',
        user: {
          id: '1',
          nickname: '钓鱼达人',
          avatar: DEFAULT_AVATAR
        },
        content: '用的是红虫，效果很好',
        replyTo: '1',
        replyToUser: {
          id: '2',
          nickname: '野钓王者',
          avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        },
        likes: 2,
        isLiked: false,
        createTime: '2024-04-03T08:35:00Z'
      },
      {
        id: '3',
        postId: '1',
        userId: '3',
        user: {
          id: '3',
          nickname: '新手钓友',
          avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        },
        content: '红虫确实好用，我也试试',
        replyTo: '1',
        replyToUser: {
          id: '2',
          nickname: '野钓王者',
          avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        },
        likes: 1,
        isLiked: false,
        createTime: '2024-04-03T08:40:00Z'
      }
    ]
  },
  {
    id: '4',
    postId: '1',
    userId: '3',
    user: {
      id: '3',
      nickname: '新手钓友',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    },
    content: '这个钓点在哪里？我也想去',
    likes: 2,
    isLiked: false,
    createTime: '2024-04-03T09:00:00Z'
  }
]

// Mock通知数据
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'comment',
    title: '新评论',
    content: '野钓王者 评论了你的动态："这条鱼真不错，用的什么饵料？"',
    relatedId: '1',
    isRead: false,
    createTime: '2024-04-03T08:30:00Z',
    user: {
      id: '2',
      nickname: '野钓王者',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    }
  },
  {
    id: '2',
    userId: '1',
    type: 'like',
    title: '新点赞',
    content: '新手钓友 点赞了你的动态',
    relatedId: '1',
    isRead: false,
    createTime: '2024-04-03T09:15:00Z',
    user: {
      id: '3',
      nickname: '新手钓友',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    }
  },
  {
    id: '3',
    userId: '1',
    type: 'follow',
    title: '新粉丝',
    content: '新手钓友 关注了你',
    relatedId: '3',
    isRead: true,
    createTime: '2024-04-02T16:00:00Z',
    user: {
      id: '3',
      nickname: '新手钓友',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    }
  },
  {
    id: '4',
    userId: '1',
    type: 'audit_pass',
    title: '审核通过',
    content: '你的动态已发布成功',
    relatedId: '1',
    isRead: true,
    createTime: '2024-04-02T14:00:00Z'
  }
]

// 模拟延迟
export const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 分页获取数据
export function getMockData<T>(data: T[], page: number, size: number): T[] {
  const start = (page - 1) * size
  const end = start + size
  return data.slice(start, end)
}

// 生成更多Mock数据
export function generateMockFeeds(count: number): Feed[] {
  const feeds: Feed[] = []
  for (let i = 0; i < count; i++) {
    feeds.push({
      id: (Date.now() + i).toString(),
      userId: mockUsers[i % mockUsers.length].id,
      user: {
        id: mockUsers[i % mockUsers.length].id,
        nickname: mockUsers[i % mockUsers.length].nickname,
        avatar: mockUsers[i % mockUsers.length].avatar
      },
      type: Math.random() > 0.3 ? 'image' : 'text',
      category: ['fish_show', 'spot_recommend', 'fishing_skill', 'equipment'][i % 4],
      content: '这是一条测试动态内容，用于测试列表滚动和分页加载功能',
      images: Math.random() > 0.5 ? [DEFAULT_AVATAR, DEFAULT_AVATAR] : [],
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
      collections: Math.floor(Math.random() * 100),
      status: 'normal',
      isLiked: Math.random() > 0.7,
      isCollected: Math.random() > 0.8,
      createTime: new Date(Date.now() - i * 60000).toISOString(),
      updateTime: new Date(Date.now() - i * 60000).toISOString()
    })
  }
  return feeds
}

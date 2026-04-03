import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@pages/auth/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@pages/home/index.vue'),
        meta: { title: '首页', requiresAuth: false }
      },
      {
        path: 'discover',
        name: 'Discover',
        component: () => import('@pages/discover/index.vue'),
        meta: { title: '发现', requiresAuth: false }
      },
      {
        path: 'publish',
        name: 'Publish',
        component: () => import('@pages/publish/index.vue'),
        meta: { title: '发布', requiresAuth: true }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@pages/message/index.vue'),
        meta: { title: '消息', requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@pages/profile/index.vue'),
        meta: { title: '我的', requiresAuth: true }
      }
    ]
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@pages/post-detail/index.vue'),
    meta: { title: '动态详情', requiresAuth: false }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@pages/user-profile/index.vue'),
    meta: { title: '用户主页', requiresAuth: false }
  },
  {
    path: '/spot/:id',
    name: 'SpotDetail',
    component: () => import('@pages/spot-detail/index.vue'),
    meta: { title: '钓点详情', requiresAuth: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@pages/search/index.vue'),
    meta: { title: '搜索', requiresAuth: false }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@pages/settings/index.vue'),
    meta: { title: '设置', requiresAuth: true }
  },
  {
    path: '/drafts',
    name: 'Drafts',
    component: () => import('@pages/drafts/index.vue'),
    meta: { title: '草稿箱', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '钓鱼社区'

  // TODO: 添加认证检查
  // const userStore = useUserStore()
  // if (to.meta.requiresAuth && !userStore.isLoggedIn) {
  //   next({ name: 'Login', query: { redirect: to.fullPath } })
  //   return
  // }

  next()
})

export default router

<template>
  <div class="default-layout">
    <div class="content">
      <router-view />
    </div>

    <van-tabbar v-model="active" @change="handleTabChange" class="bottom-nav">
      <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="discover" icon="search">发现</van-tabbar-item>
      <van-tabbar-item name="publish" icon="plus">发布</van-tabbar-item>
      <van-tabbar-item name="message" icon="chat-o" badge="5">消息</van-tabbar-item>
      <van-tabbar-item name="profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = ref('home')

const routeMap: Record<string, string> = {
  home: '',
  discover: 'discover',
  publish: 'publish',
  message: 'message',
  profile: 'profile'
}

const handleTabChange = (name: string) => {
  const path = routeMap[name] || '/'
  router.push({ path })
}

const updateActiveFromRoute = () => {
  for (const [key, path] of Object.entries(routeMap)) {
    if (route.path === path || route.path === '/' + path) {
      active.value = key
      return
    }
  }
  if (route.path === '/') {
    active.value = 'home'
  }
}

watch(route, updateActiveFromRoute, { immediate: true })
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto;
  background: #f7f8fa;
}

.bottom-nav {
  border-top: 1px solid #eee;
}
</style>

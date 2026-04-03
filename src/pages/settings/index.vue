<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="router.back()" />

    <div class="settings-content">
      <van-cell-group title="账号管理">
        <van-cell title="修改手机号" is-link @click="handleChangePhone" />
        <van-cell title="修改密码" is-link @click="handleChangePassword" />
      </van-cell-group>

      <van-cell-group title="消息通知">
        <van-cell center>
          <template #title>
            <div class="setting-item">
              <span>评论通知</span>
              <van-switch v-model="settings.commentNotify" size="20" />
            </div>
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <div class="setting-item">
              <span>点赞通知</span>
              <van-switch v-model="settings.likeNotify" size="20" />
            </div>
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <div class="setting-item">
              <span>新粉丝通知</span>
              <van-switch v-model="settings.followerNotify" size="20" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group title="隐私设置">
        <van-cell
          title="谁可以评论我的动态"
          :value="privacyOptions[settings.whoCanComment]"
          is-link
          @click="showPrivacyPicker = true"
        />
      </van-cell-group>

      <van-cell-group title="关于我们">
        <van-cell title="版本号" :value="version" />
        <van-cell title="用户协议" is-link @click="handleViewAgreement" />
        <van-cell title="隐私政策" is-link @click="handleViewPrivacy" />
      </van-cell-group>

      <van-button
        type="danger"
        block
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>

    <!-- 隐私设置弹窗 -->
    <van-action-sheet
      v-model:show="showPrivacyPicker"
      :actions="privacyActions"
      @select="handlePrivacyChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useUserStore } from '@stores/user'

const router = useRouter()
const userStore = useUserStore()

const version = '1.0.0'
const showPrivacyPicker = ref(false)

const privacyOptions: Record<string, string> = {
  all: '所有人',
  following: '仅关注者',
  self: '仅自己'
}

const privacyActions = [
  { name: '所有人', value: 'all' },
  { name: '仅关注者', value: 'following' },
  { name: '仅自己', value: 'self' }
]

const settings = ref({
  commentNotify: true,
  likeNotify: true,
  followerNotify: true,
  whoCanComment: 'all'
})

const handleChangePhone = () => {
  showToast('功能开发中')
}

const handleChangePassword = () => {
  showToast('功能开发中')
}

const handlePrivacyChange = (action: any) => {
  settings.value.whoCanComment = action.value
  showToast('设置已更新')
}

const handleViewAgreement = () => {
  showToast('功能开发中')
}

const handleViewPrivacy = () => {
  showToast('功能开发中')
}

const handleLogout = async () => {
  const confirmed = await showConfirmDialog({
    title: '确认退出',
    message: '确定要退出登录吗？'
  })

  if (confirmed) {
    await userStore.logout()
    showToast('已退出登录')
    router.push({ name: 'Login' })
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logout-btn {
  margin: 16px;
}
</style>

<template>
  <div class="login-page">
    <div class="login-content">
      <div class="logo">
        <van-icon name="guide-o" size="64" />
      </div>
      <div class="title">{{ APP_NAME }}</div>
      <div class="subtitle">欢迎回来</div>

      <van-form @submit="handleSubmit" ref="formRef">
        <van-field
          v-model="phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }, { validator: validatePhone, message: '手机号格式不正确' }]"
          maxlength="11"
          type="tel"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="codeDisabled"
              @click="sendCode"
            >
              {{ codeText }}
            </van-button>
          </template>
        </van-field>

        <van-field
          v-model="code"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
          maxlength="6"
          type="tel"
        />

        <div class="submit-btn">
          <van-button
            type="primary"
            block
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@stores/user'
import { APP_NAME } from '@constants'
import { isValidPhone } from '@utils/validate'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const loading = ref(false)
const codeDisabled = ref(false)
const codeText = ref('获取验证码')
const countdown = ref(0)
const formRef = ref()

const validatePhone = (value: string) => {
  return isValidPhone(value)
}

const sendCode = async () => {
  if (!isValidPhone(phone.value)) {
    showToast('请输入正确的手机号')
    return
  }

  if (countdown.value > 0) return

  try {
    // TODO: 调用发送验证码接口
    showToast('验证码已发送')

    countdown.value = 60
    codeDisabled.value = true

    const timer = setInterval(() => {
      countdown.value--
      codeText.value = `${countdown.value}秒后重发`

      if (countdown.value <= 0) {
        clearInterval(timer)
        codeDisabled.value = false
        codeText.value = '获取验证码'
      }
    }, 1000)
  } catch (error) {
    showToast('发送失败')
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await userStore.login(phone.value, code.value)
    showToast('登录成功')
    router.replace({ name: 'Home' })
  } catch (error) {
    showToast('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 40px 24px;
  background: #fff;
  border-radius: 16px;
  margin: 20px;
}

.logo {
  text-align: center;
  margin-bottom: 24px;
  color: #667eea;
}

.title {
  font-size: 24px;
  font-weight: 500;
  color: #323233;
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #969799;
  text-align: center;
  margin-bottom: 32px;
}

.submit-btn {
  margin-top: 24px;
}
</style>

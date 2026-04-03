// 验证手机号
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 验证验证码
export function isValidCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

// 验证昵称
export function isValidNickname(nickname: string): boolean {
  const len = nickname.trim().length
  return len >= 2 && len <= 12
}

// 验证内容长度
export function isValidContent(content: string, max = 500): boolean {
  return content.length <= max
}

// 验证评论长度
export function isValidComment(content: string, max = 100): boolean {
  return content.length <= max
}

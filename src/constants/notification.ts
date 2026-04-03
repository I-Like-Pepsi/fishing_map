export const NOTIFICATION_TYPES = [
  { value: 'comment', label: '评论', icon: '💬' },
  { value: 'reply', label: '回复', icon: '💬' },
  { value: 'like', label: '点赞', icon: '💖' },
  { value: 'collect', label: '收藏', icon: '⭐' },
  { value: 'follow', label: '新增粉丝', icon: '👤' },
  { value: 'audit_pass', label: '审核通过', icon: '✅' },
  { value: 'audit_fail', label: '审核失败', icon: '⚠️' }
] as const

export function getNotificationIcon(type: string): string {
  return NOTIFICATION_TYPES.find(t => t.value === type)?.icon || '📢'
}

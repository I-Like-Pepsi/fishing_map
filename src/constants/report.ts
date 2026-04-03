export const REPORT_REASONS = {
  post: [
    '色情低俗',
    '政治敏感',
    '虚假信息',
    '广告垃圾',
    '人身攻击',
    '其他'
  ],
  user: [
    '虚假身份',
    '恶意刷屏',
    '人身攻击',
    '其他'
  ],
  comment: [
    '恶意灌水',
    '人身攻击',
    '其他'
  ]
} as const

export type ReportTarget = keyof typeof REPORT_REASONS

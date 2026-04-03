export const CATEGORIES = [
  { value: 'fish_show', label: '晒鱼获', icon: '🐟' },
  { value: 'spot_recommend', label: '钓点推荐', icon: '📍' },
  { value: 'fishing_skill', label: '钓鱼技巧', icon: '🎣' },
  { value: 'equipment', label: '装备交流', icon: '🎒' }
] as const

export type CategoryValue = typeof CATEGORIES[number]['value']

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find(c => c.value === value)?.label || value
}

export function getCategoryIcon(value: string): string {
  return CATEGORIES.find(c => c.value === value)?.icon || '📝'
}

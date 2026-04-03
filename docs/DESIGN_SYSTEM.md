# 钓鱼社区 H5 设计系统

## 颜色系统

### 主题色
```scss
$primary-color: #2F80ED;      // 主色 - 蓝色
$primary-light: #56CCF2;      // 浅主色 - 浅蓝
$primary-dark: #1C5DB6;       // 深主色 - 深蓝
```

### 状态色
```scss
$success-color: #10B981;      // 成功 - 绿色
$warning-color: #F59E0B;      // 警告 - 橙色
$danger-color: #EF4444;       // 危险/错误 - 红色
$info-color: #2F80ED;         // 信息 - 蓝色
```

### 特殊用途颜色
```scss
$like-color: #EF4444;        // 点赞 - 红色
$comment-color: #10B981;      // 评论 - 绿色
$nature-color: #22C55E;       // 自然 - 绿色
```

### 背景色
```scss
$bg-color: #F5F7FA;         // 主背景 - 浅灰
$bg-card: #FFFFFF;           // 卡片背景 - 白色
$bg-color-dark: #E5E7EB;     // 深背景 - 中灰
```

### 文字颜色
```scss
$text-primary: #1F2937;      // 主要文字 - 深灰
$text-secondary: #6B7280;    // 次要文字 - 中灰
$text-light: #9CA3AF;         // 浅色文字 - 浅灰
$text-tertiary: #C4C7CC;     // 最浅文字
```

## 间距系统

```scss
$spacing-xs: 4px;    // 极小间距
$spacing-sm: 8px;    // 小间距
$spacing-md: 16px;   // 中等间距
$spacing-lg: 24px;   // 大间距
$spacing-xl: 32px;   // 超大间距
```

## 字体大小

```scss
$font-size-xs: 10px;    // 极小字体
$font-size-sm: 12px;    // 小字体
$font-size-md: 14px;    // 中等字体（正文）
$font-size-lg: 16px;    // 大字体（标题）
$font-size-xl: 18px;    // 超大字体
```

## 其他变量

```scss
// 边框
$border-color: #ebedf0;   // 边框颜色
$border-radius: 8px;       // 默认圆角

// 阴影
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);      // 小阴影
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);      // 中阴影
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12);     // 大阴影

// 过渡
$transition-base: all 0.3s ease;    // 基础过渡
$transition-fast: all 0.15s ease;   // 快速过渡
```

## 使用规范

### 1. 始终使用 SCSS 变量
在组件样式中，先导入变量文件：
```scss
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.my-component {
  background: $bg-color;
  color: $text-primary;
}
</style>
```

### 2. 颜色使用场景
- **主色** ($primary-color): 主要按钮、链接、激活状态
- **成功色** ($success-color): 操作成功、在线状态
- **警告色** ($warning-color): 提示信息、待审核
- **危险色** ($danger-color): 删除、举报、错误
- **点赞色** ($like-color): 点赞按钮、已点赞状态
- **评论色** ($comment-color): 评论相关

### 3. 文字颜色使用场景
- **主要文字** ($text-primary): 标题、重要内容
- **次要文字** ($text-secondary): 正文、描述信息
- **浅色文字** ($text-light): 辅助信息、时间戳
- **最浅文字** ($text-tertiary): 占位符、禁用状态

### 4. 背景色使用场景
- **主背景** ($bg-color): 页面背景
- **卡片背景** ($bg-card): 内容卡片、弹窗
- **深背景** ($bg-color-dark): 辅助区域、占位区

## 设计原则

1. **一致性**: 所有页面和组件使用统一的设计变量
2. **可维护性**: 颜色、间距等统一管理，方便全局调整
3. **可访问性**: 确保文字与背景有足够的对比度
4. **移动优先**: 所有设计首先考虑移动端体验

## 开发检查清单

新增组件或页面时，请确保：
- [ ] 导入 `@/assets/styles/variables.scss`
- [ ] 使用设计变量而非硬编码颜色值
- [ ] 使用适当的间距变量
- [ ] 使用合适的文字颜色和背景色组合
- [ ] 交互元素有适当的过渡效果

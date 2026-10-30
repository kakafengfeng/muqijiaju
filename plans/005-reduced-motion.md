# 005 — prefers-reduced-motion 全局降级

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files, ~20 lines

## Problem

全站无任何 `prefers-reduced-motion` 处理（index.css 无 media query；Reveal/Hero/Header 菜单/轮播均无条件动画）。系统开启"减弱动态效果"的用户仍看到全部位移/缩放动画。

## Target

`index.css` 末尾追加全局降级（保留透明度/颜色反馈，仅消除位移与时长）：

```css
/* index.css — target（末尾追加） */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

`components/UI/Reveal.tsx` 组件级分支（framer 动画不受 CSS 影响，需 JS 判断）：

```tsx
// Reveal.tsx — target
import { motion, useInView, useAnimation, useReducedMotion } from 'framer-motion';
...
const prefersReduced = useReducedMotion();
...
const getHiddenVariant = () => {
  if (prefersReduced) return { opacity: 0 };
  switch (direction) { ... 原逻辑 ... }
};
// 同时把 visible transition 改为：
transition: { duration: prefersReduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1], delay: prefersReduced ? 0 : delay }
```

## Repo conventions to follow

- framer-motion 提供 `useReducedMotion()`（与 CSS media query 同步）。

## Steps

1. index.css 末尾追加上述 media query。
2. Reveal.tsx：import 增加 `useReducedMotion`；组件内声明 `const prefersReduced = useReducedMotion()`；`getHiddenVariant` 在 true 时返回 `{ opacity: 0 }`（无位移）；visible transition 的 duration/delay 在 true 时归 0。

## Boundaries

- 本计划只覆盖全局 CSS + Reveal 组件。Hero/Header 菜单/弹窗等 framer 动效的组件级降级留待后续（全局 CSS 已覆盖其 CSS 过渡部分）。
- 不删除任何动效，只降级。

## Verification

- **Mechanical**: build 通过。
- **Feel check**: DevTools Rendering → emulate `prefers-reduced-motion: reduce`，滚动页面：Reveal 内容直接出现（无位移），顶栏变色即时；恢复正常后动画恢复。
- **Done when**: reduce 模式下页面无位移动画，内容立即可读。
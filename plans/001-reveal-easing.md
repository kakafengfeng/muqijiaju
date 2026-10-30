# 001 — Reveal 全局入场：换强 ease-out 曲线并收紧时长

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: HIGH
- **Category**: Easing & duration / Cohesion & tokens
- **Estimated scope**: 1 file, ~5 lines

## Problem

`components/UI/Reveal.tsx:38` 是全站最常用的入场动画（首页/关于/产品/项目等几十处），但缓动曲线 `[0.25, 0.25, 0.25, 0.75]` 近似 linear——入场没有任何加速感，显得"匀速拖拽"；duration 0.8s 在营销页偏拖沓。

```ts
// components/UI/Reveal.tsx:32-40 — 当前
const variants = {
  hidden: getHiddenVariant(),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75], delay: delay }
  },
};
```

## Target

入场/出场统一强 ease-out（先快后慢，响应感）：

```ts
// target
transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay }
```

- `ease: [0.22, 1, 0.36, 1]`（等价 AUDIT 的 `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`，取常用强出曲线）
- duration 0.8 → 0.6（营销页保留一定舒展度，但不再拖沓）
- 位移 `y: 30` 保留（营销 dramatics），`delay` 保留（由调用方 stagger）

## Repo conventions to follow

- 该项目无既有动效 token（index.css 无 `--ease-*`），framer-motion ease 均内联数组；沿用内联方式，数值统一用本计划值，后续 007 计划负责集中成 token。

## Steps

1. 编辑 `components/UI/Reveal.tsx` 第 38 行，将 transition 改为：
   ```ts
   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay }
   ```
2. 不改动 `getHiddenVariant()` 位移值、`useInView` 的 `once:true`/margin、`useAnimation` 结构。

## Boundaries

- 只改 Reveal.tsx 的 transition 行。不触碰调用方（About/ProjectGrid 等的 `delay` 传参）。
- 不新增依赖。不改变 DOM 结构。

## Verification

- **Mechanical**: `npm run build`（vite build）成功；`tsc --noEmit` 无新错误。
- **Feel check**: 打开 http://localhost:4173/，滚动触发任意 Reveal 块，确认出现时"先快后慢"（前 150ms 明显加速位移），整体在 0.6s 内完成，无匀速拖拽感。
- **Done when**: 入场曲线不再有匀速感，时长明显轻快。
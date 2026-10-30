# 006 — 移除管理面板常驻 FAB 的无限 bounce

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file, 1 line

## Problem

`components/AdminPanel.tsx:137` 登录态右下角 FAB 使用 Tailwind 内置 `animate-bounce`——无限上下跳动，是常驻高频可见元素（用户停留期间持续动画），违反频率原则（tens/day → 移除或极简）。

```tsx
// components/AdminPanel.tsx:137 — 当前
className="fixed bottom-6 right-6 z-[120] bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-colors animate-bounce"
```

## Target

```tsx
// target — 移除 bounce，仅保留 hover 反馈
className="fixed bottom-6 right-6 z-[120] bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-colors"
```

## Repo conventions to follow

- 全站按钮仅 hover 变色/微移，无常驻动画（除轮播自动播放，属功能）。

## Steps

1. 删除 AdminPanel.tsx:137 class 中的 `animate-bounce`。

## Boundaries

- 不动 FAB 功能/样式其它部分。

## Verification

- **Mechanical**: build 通过。
- **Feel check**: 登录后右下角 FAB 静止，hover 变暗。
- **Done when**: FAB 不持续跳动。
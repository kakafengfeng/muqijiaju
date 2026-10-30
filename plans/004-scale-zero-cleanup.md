# 004 — 消灭 scale(0) 与 transition-all：项目页/团队页/轮播

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Performance
- **Estimated scope**: 3 files, ~5 lines

## Problem

1. `components/ProjectGrid.tsx:51`：hover 放大镜从 `scale-0` 出现——"从无到有"（AUDIT §3：永不 scale(0)，从 scale(0.9-0.97)+opacity 开始）。

```tsx
// components/ProjectGrid.tsx:51 — 当前
<div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
```

2. `pages/TeamPage.tsx:115`：Briefcase 图标 `w-0 group-hover:w-3 transition-all`——width 动画是布局属性（触发 layout+paint），且 transition-all 非受控。

```tsx
// pages/TeamPage.tsx:115 — 当前
<Briefcase size={12} className="opacity-0 w-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-200" />
```

3. `components/ProductCarousel.tsx:106`：hover 遮罩 `transition-all duration-500`。

## Target

```tsx
// ProjectGrid.tsx:51 — target（从 scale(0.9) 起步，而非 0）
... transform scale-90 group-hover:scale-100 transition-transform duration-200 delay-75
```

```tsx
// TeamPage.tsx:115 — target（固定宽度，只动 opacity——图标常驻 12px）
<Briefcase size={12} className="opacity-0 w-3 group-hover:opacity-100 transition-opacity duration-200" />
```

```tsx
// ProductCarousel.tsx:106 — target
... transition-opacity duration-300 ...
```

## Repo conventions to follow

- Tailwind 原子类；opacity/transform 为 GPU 属性，全站优先。

## Steps

1. ProjectGrid.tsx:51：`scale-0` → `scale-90`，`duration-300 delay-100` → `duration-200 delay-75`。
2. TeamPage.tsx:115：`opacity-0 w-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-200` → `opacity-0 w-3 group-hover:opacity-100 transition-opacity duration-200`。
3. ProductCarousel.tsx:106：`transition-all duration-500` → `transition-opacity duration-300`。

## Boundaries

- 不改图标尺寸含义（w-3 固定），不改轮播遮罩结构；仅动效属性。
- 轮播卡片 hover scale-105（99 行）保留，属正确用法。

## Verification

- **Mechanical**: build 通过。
- **Feel check**: 4173 悬停项目卡片，放大镜从 0.9 快速放大而非"凭空出现"；团队页标签 hover 图标淡入、无宽度跳动；轮播 hover 遮罩 300ms 平滑。
- **Done when**: 无 scale(0) 起点；无 width 动画；无 transition-all。
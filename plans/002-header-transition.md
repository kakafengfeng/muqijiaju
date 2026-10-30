# 002 — 顶栏：transition-all 改受控属性，滚动响应 200ms

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: HIGH
- **Category**: Performance / Easing & duration
- **Estimated scope**: 1 file, 3 lines

## Problem

`components/Header.tsx:53` 固定顶栏用 `transition-all duration-500 ease-in-out`——`transition-all` 会为所有样式属性（含布局类）开动画，滚动触发背景/文字色变化时 500ms 才完成，滚动场景应"系统响应快、不拖泥带水"。

```tsx
// components/Header.tsx:53 — 当前
className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${headerStyle}`}
```

同文件 62 行 logo 也是 `transition-all duration-300`；102-108 行移动端全屏菜单 `transition: { type: 'tween', duration: 0.4 }` 用 framer 默认缓动（偏弱）。

## Target

```tsx
// Header.tsx:53 — target
className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 ease-out ${headerStyle}`}
```

- `transition-colors`：只动画背景色/文字色/阴影色（受控、GPU 友好）
- duration 500 → 200（滚动触发的变化应接近即时，AUDIT 顶栏属高频可见）
- `ease-out`（响应感）

```tsx
// Header.tsx:62 — target
className="h-12 w-auto transition-opacity duration-200"
```

```tsx
// Header.tsx:107 — target（移动端菜单，drawer 类曲线）
transition: { type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }
```

## Repo conventions to follow

- 项目内 hover/色变统一用 Tailwind `transition-colors`（如 Footer/TeamPage 已有先例）；ease 内联数组沿用现有 framer 写法。

## Steps

1. Header.tsx:53 替换 class 串中的 `transition-all duration-500 ease-in-out` → `transition-colors duration-200 ease-out`。
2. Header.tsx:62 `transition-all duration-300` → `transition-opacity duration-200`。
3. Header.tsx:107 framer transition 改为 `{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }`。

## Boundaries

- 不改 `headerStyle` 判定逻辑、不改导航/菜单结构。
- 移动端菜单的 x:100% 滑入滑出保留（方向正确，仅换曲线/时长）。

## Verification

- **Mechanical**: build 通过。
- **Feel check**: 4173 预览页上下滚动，顶栏变色应在 200ms 内完成、不拖影；移动端（窄窗口）开合菜单 350ms 流畅、先快后慢。
- **Done when**: 滚动时顶栏变色干脆；菜单滑入无明显匀速感。
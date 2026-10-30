# 007 — 动效 token 集中 + 轮播/菜单缓动统一

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, ~15 lines

## Problem

缓动曲线散落 4 处近似但不一致的写法：Reveal `[0.25,0.25,0.25,0.75]`、Header `ease-in-out`、轮播 `cubic-bezier(0.25,0.1,0.25,1)`、ProjectGrid `easeOut`。同时轮播 `duration-700` 偏慢、曲线为标准 ease-in-out（弱）。

## Target

`index.css` 定义 tokens（CSS 侧使用）：

```css
/* index.css — target（:root 内追加） */
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --dur-ui: 200ms;
  --dur-motion: 500ms;
}
```

`components/ProductCarousel.tsx:85` 轮播滑动（屏幕内移动 → ease-in-out）：

```tsx
// target
className="flex gap-8 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
```

## Repo conventions to follow

- framer-motion 的 ease 是 JS 数组，无法引用 CSS 变量；CSS 侧统一用 `var(--ease-*)`，JS 侧内联同一组数值并在相邻注释标注 token 名（后续如需可抽成 motion config 常量）。

## Steps

1. index.css `:root` 追加 5 个 token。
2. ProductCarousel.tsx:85：`duration-700` → `duration-500`，`ease-[cubic-bezier(0.25,0.1,0.25,1)]` → `ease-[cubic-bezier(0.77,0,0.175,1)]`。
3. 可选：Header.tsx:53 的 `ease-out` 已符合 token 语义，无需改。

## Boundaries

- 不重写已有组件的 framer 内联 ease（001/002/003 已处理主要项），本计划只集中 CSS token + 轮播。
- 不新增依赖。

## Verification

- **Mechanical**: build 通过；index.css 中 `--ease-out`/`--ease-in-out`/`--ease-drawer` 存在且被引用（grep `var(--ease` 有命中）。
- **Feel check**: 轮播自动/手动切换 500ms 完成、有明确缓入缓出；无"拖拽感"。
- **Done when**: 轮播时长明显更利落；token 已定义。
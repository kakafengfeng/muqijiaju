# 003 — 悬停缩放与时序：About 图 1s→200ms，按钮加按压反馈

- **Status**: TODO
- **Commit**: 3bb329d
- **Severity**: HIGH
- **Category**: Easing & duration / Physicality & origin / Interruptibility
- **Estimated scope**: 2 files, ~6 lines

## Problem

1. `components/About.tsx:33-34`：图片 hover 缩放 `scale: 1.2` + `duration: 1`——1 秒的 hover 动画明显偏慢（AUDIT：hover 类应为 100-200ms 响应），scale 1.2 过大（超过基准 1.15 后图片裁切明显）。

```tsx
// components/About.tsx:26-36 — 当前
<motion.img
  style={{ y, scale: 1.15 } as any}
  ...
  {...({
    whileHover: { scale: 1.2 },
    transition: { duration: 1, ease: "easeOut" }
  } as any)}
/>
```

2. `components/Hero.tsx:80,88`：CTA 按钮 `transition-transform`/`transition-all` + `hover:-translate-y-1`，无按压（:active）反馈——交互按钮缺少 press 状态（AUDIT §3 推荐 `scale(0.97)` on active）。

## Target

```tsx
// About.tsx — target（hover 微动即可，1.15 → 1.08 基准内变化）
style={{ y, scale: 1.08 } as any}
...
whileHover: { scale: 1.12 },
transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
```

- hover 由 1.15→1.2 改为 1.08→1.12（12% 内，避免裁切/糊）；duration 1 → 0.2

```tsx
// Hero.tsx:80 — target
className="group relative px-8 py-4 bg-white text-stone-900 text-sm tracking-widest uppercase transition-transform duration-200 hover:-translate-y-1 active:scale-95"
// Hero.tsx:88 — target
className="px-8 py-4 border border-white/30 text-white text-sm tracking-widest uppercase transition-colors duration-200 hover:bg-white hover:text-stone-900 active:scale-95"
```

- 88 行 `transition-all` → `transition-colors duration-200`（属性受控），补 `active:scale-95` 按压反馈

## Repo conventions to follow

- Tailwind 原子类体系；active: 变体全站可用。

## Steps

1. About.tsx:27 `style` 内 `scale: 1.15` → `1.08`；33-34 改 `whileHover: { scale: 1.12 }`、`transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }`。
2. Hero.tsx:80 补 `duration-200` 与 `active:scale-95`。
3. Hero.tsx:88 改 `transition-all` → `transition-colors duration-200`，补 `active:scale-95`。

## Boundaries

- 不新增依赖；不改 Hero/About 布局与文案。
- 不批量改动其它按钮（后续按需推广按压反馈）。

## Verification

- **Mechanical**: build 通过。
- **Feel check**: 4173 悬停 About 图，缩放应"跟手"（200ms 内完成）；按住 Hero 两个 CTA 出现明显下压（scale 0.95），松开弹回。
- **Done when**: About 图 hover 不再拖 1 秒；按钮按下有明确反馈。
# Animation Improvement Plans — muqijiaju

依据 emilkowalski/skills `improve-animations` 审计（2026-10-13，commit 3bb329d）生成的动效修复计划。审计基线：Emil Kowalski 动画哲学（animations.dev）。

## 计划清单

| # | 计划 | 严重级 | 类别 | 状态 |
| --- | --- | --- | --- | --- |
| 001 | Reveal 入场：强 ease-out + 0.6s | HIGH | Easing & duration | DONE |
| 002 | 顶栏 transition-all → transition-colors 200ms | HIGH | Performance / Easing | DONE |
| 003 | About hover 1s→200ms + 按钮按压反馈 | HIGH | Physicality / Easing | DONE |
| 004 | scale(0) 消灭 + width 动画清理 | MEDIUM | Physicality / Performance | DONE |
| 005 | prefers-reduced-motion 全局降级 | MEDIUM | Accessibility | DONE |
| 006 | 移除 AdminPanel FAB 无限 bounce | MEDIUM | Purpose & frequency | DONE |
| 007 | 动效 token 集中 + 轮播缓动 | LOW | Cohesion & tokens | DONE |

## 执行顺序与依赖

1. **001 → 002 → 003**（HIGH 优先，互不依赖，可并行实施后统一构建）
2. **004**（独立）
3. **006**（独立，一行）
4. **005**（建议在 001 之后，避免 Reveal 数值被覆盖）
5. **007**（最后，token 集中不影响其它计划数值）

无硬依赖；每份计划自包含（含 file:line、当前代码、目标值、验证步骤）。实施后更新本表状态列。

## 审计发现的遗漏机会（未入计划，供后续）

- 全站按钮缺统一按压反馈（003 只覆盖 Hero；可推广 `active:scale-95`）
- 部门架构卡片（DepartmentGrid）hover 无微动（对比产品/项目卡有 scale）
- 懒加载图片出现时无淡入（blur-up），可做 `opacity` 过渡
# Arcory

Arcory 是一个面向「网站收藏 / 文章 / 插件 / 案例」的展示型项目，当前基于 Next.js + shadcn/ui 实现，核心页面风格参考了 Figma 设计稿与相关交互原型。

## 技术栈

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- tw-animate-css

## 主要组件

| 组件 | 文件 | 说明 |
| --- | --- | --- |
| HeroAsciiGrid | `components/hero-ascii-grid.tsx` | 首页 Hero ASCII 动态背景（20x11 网格 + 波动动画） |
| IdenticonAvatar | `components/identicon-avatar.tsx` | 默认头像组件，支持 Bayer 2x2 / 4x4 等变体 |
| ListEmptyState | `components/list-empty-state.tsx` | 列表空状态组件，可按分类动态复用（如 `SYSTEMS`） |
| Input（shadcn） | `components/ui/input.tsx` | 搜索输入框基础组件 |

## 头像算法能力

实现文件：`lib/identicon.ts`

支持的变体：

- `bayer-2x2`
- `bayer-4x4`
- `bayer-4x4-prod-hsl-triadic`
- `bayer-4x4-mono-oklch`

默认头像在列表中通过 `IdenticonAvatar` 调用并渲染为圆形 20px。

## 组件参考链接

- shadcn/ui: [https://ui.shadcn.com/](https://ui.shadcn.com/)
- identicon 原型参考: [https://identicon-prototype.labs.vercel.dev/](https://identicon-prototype.labs.vercel.dev/)
- Hero 动效参考: [https://hackathon.polar.sh/](https://hackathon.polar.sh/)
- 设计稿（Figma）: [https://www.figma.com/design/dCu7gQH1EvgLmQG3bRNopA/Arcory](https://www.figma.com/design/dCu7gQH1EvgLmQG3bRNopA/Arcory)

## 本地运行

```bash
pnpm install
pnpm dev
```

默认访问：

- [http://localhost:3000](http://localhost:3000)

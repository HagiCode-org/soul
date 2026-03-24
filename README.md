# Soul

Soul 是 `soul.hagicode.com` 的前端基线仓库。
当前版本只提供可运行的首页壳层、shadcn/ui 基础设施，以及后续页面扩展所需的目录与样式约定。

## 技术基线

- Vite 8
- React 19
- TypeScript 5.9
- Tailwind CSS 4
- shadcn/ui（`components.json` + `src/components/ui`）

## 目录说明

- `src/main.tsx`：应用挂载入口
- `src/App.tsx`：应用组合根
- `src/pages/HomePage.tsx`：默认首页壳层
- `src/components/site`：站点级分区组件
- `src/components/ui`：shadcn/ui 基础原语
- `src/lib/utils.ts`：`cn()` 工具
- `src/index.css`：主题变量与全局样式入口

## 启动方式

```bash
npm install
npm run dev
```

默认会启动本地 Vite 开发服务器。

## 构建与检查

```bash
npm run build
npm run lint
npm run preview
```

## shadcn/ui 基线约定

- `components.json` 作为 shadcn CLI 的单一配置入口
- 所有共享基础组件统一放在 `src/components/ui/`
- 所有别名统一走 `@/*`
- 主题变量统一收敛到 `src/index.css`
- 页面层不重复声明独立 token 系统

## 当前默认假设

- 首页文案为占位内容。暂未接入正式品牌内容流程
- 当前未接入 i18n、SEO、埋点与 CMS
- 当前不依赖后端接口。`npm run dev` 与 `npm run build` 可独立运行
- 主题切换仅处理前端视觉状态。暂未做持久化

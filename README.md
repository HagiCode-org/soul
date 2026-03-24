# Soul

Soul 是 `soul.hagicode.com` 的前端仓库。
当前默认首页已经切换为 editor-style Soul Builder 工作台。页面直接承接素材浏览、草稿拼装、实时预览、本地保存与导出流程。

## 当前首页能力

- Builder-first 默认首页：默认路由直接进入 Soul Builder 工作台
- 编辑器式首页外壳：中央工作区常驻，左右两侧通过命名槽位打开上下文抽屉
- 单抽屉生命周期：任意时刻只允许一个槽位抽屉打开；再次点击当前槽位、点击遮罩或按 `Esc` 都会关闭抽屉
- 本地参考素材：构建期从 `repos/web/docs` 的主 Catalog 与表达规则生成快照
- 可选远端增强：运行期尝试读取 `/api/soul-marketplace/items` 的官方灵感卡；失败时自动回退到本地示例卡
- 本地草稿：使用浏览器 `localStorage` 保存、恢复最近草稿，并兼容旧版本快照
- 稳定导出：支持导出 JSON，并复制当前 SOUL 预览文案

## 首页结构与状态边界

### 布局结构

- `src/pages/HomePage.tsx`：首页组合根，维护槽位注册表与内容映射
- `src/components/home/HomeEditorShell.tsx`：编辑器式首页骨架，组织中央工作区、左右槽位轨道与抽屉容器
- `src/components/home/HomeSlotRail.tsx`：槽位入口渲染，承载命名、激活态、悬停态和禁用态
- `src/components/home/HomeContextDrawer.tsx`：统一抽屉生命周期，负责遮罩、关闭按钮与 `Esc` 关闭
- `src/components/builder/PreviewPanel.tsx`：中央工作区主表面，常驻显示预览、保存、复制和导出操作
- `src/components/builder/MaterialLibraryPanel.tsx` / `CompositionPanel.tsx` / `SavedDraftRail.tsx` / `SourceFootnote.tsx`：以抽屉模式复用原有 Builder 能力

### 状态边界

- `src/hooks/use-soul-builder.ts`：只承载领域状态与副作用，包括素材加载、草稿聚合、预览编译、本地保存、恢复、复制和导出
- `src/hooks/use-home-editor-state.ts`：只承载表现层状态，包括 `activeSlot`、`drawerSide`、`drawerOpen` 与默认焦点规则
- 抽屉状态不会持久化，也不会直接写入 `SoulBuilderDraft`
- 关闭抽屉本身不会改写草稿；只有显式选择素材、恢复快照、保存、复制、导出等 Builder 动作才会产生状态变化或副作用
- 远端灵感失败不会阻断首页渲染；核心 Builder 流仍可完全依赖本地快照运行

## 数据来源与边界

### 参考输入

- 主 Catalog：`repos/web/docs/50组SOUL.md核心Catalog（风格差异化+高辨识度+强适配性）.md`
- 表达规则：`repos/web/docs/10组正交维度Catalog2（可与50组主Catalog交叉生成500个独家人设）.md`
- 官方灵感卡契约参考：`repos/web/src/services/soulMarketplaceApi.ts`
- 官方组合规则参考：`repos/hagicode-core/src/PCode.Application/SoulMarketplace/catalog-sources.json`

### 生成方案

- 生成脚本：`scripts/generate-reference-materials.mjs`
- 生成产物：`src/data/reference-materials.generated.ts`
- 同步命令：

```bash
npm run materials:sync
```

## 目录说明

- `src/pages/HomePage.tsx`：Builder 首页组合根
- `src/components/home/`：首页 editor shell、槽位轨道与抽屉原语
- `src/components/builder/`：素材库、拼装区、预览区、草稿区、来源说明区
- `src/components/site/SiteHeader.tsx`：站点导航与主题切换
- `src/lib/builder/`：领域类型、素材仓储、预览编译、本地存储、导出逻辑
- `src/data/reference-materials.generated.ts`：参考素材快照
- `src/test/`：Vitest 测试初始化

## 运行方式

```bash
npm install
npm run dev
```

默认会启动本地 Vite 开发服务器。

## 构建与检查

```bash
npm run lint
npm run test
npm run build
npm run preview
```

## 运行假设

- 首页必须在无后端场景下可进入；核心拼装依赖本地快照即可运行
- 官方灵感卡属于增强能力；读取失败不能阻断首页渲染
- 保存使用浏览器本地存储，不依赖登录态与云端接口
- 导出要求主 Catalog 与表达规则同时完成选择
- 主题切换仍然只处理前端视觉状态，暂未做持久化

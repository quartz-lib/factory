# Index Content Page

Quartz v5 的 PageType 插件，将子目录的 `index.md`（slug 形如 `dsa/index`）按 **Content 页**渲染。

Quartz 默认由 [FolderPage](https://github.com/quartz-community/folder-page) 处理这类页面：在 Markdown 正文下方追加 `.page-listing` 文件列表，并为没有 `index.md` 的文件夹自动生成虚拟索引页。本插件接管 `*/index` slug 的匹配，使用 `content` 布局（含右侧 TOC），只渲染正文，不生成文件列表，也不创建虚拟 folder 页。

仓库地址：[github.com/quartz-lib/index-content-page](https://github.com/quartz-lib/index-content-page)

## 功能

- 子目录 `index.md` 使用 `content` 布局，与普通内容页一致
- 右侧显示 TOC（目录导航）
- 只渲染 Markdown 正文，**不**追加 `.page-listing` 文件列表
- **不**为缺少 `index.md` 的文件夹生成虚拟索引页
- 根目录 `content/index.md`（slug 为 `index`）仍由 ContentPage 处理，不受影响

## 要求

- [Quartz](https://quartz.jzhao.xyz/) v5.0.0 及以上
- Node.js >= 22

> [!note]
> 启用本插件后，请将 [folder-page](https://github.com/quartz-community/folder-page) 设为 `enabled: false`。FolderPage 的 `priority` 为 10，与本插件（`priority: 11`）匹配同一 slug，两者不能同时启用。

## 安装

在你的 Quartz 站点根目录执行：

```bash
npx quartz plugin add github:quartz-lib/index-content-page
```

CLI 会自动将插件写入 `quartz.config.yaml` 和 `quartz.lock.json`。

安装后，**务必禁用** `folder-page`：

```yaml
plugins:
  - source: github:quartz-community/folder-page
    enabled: false

  - source: github:quartz-lib/index-content-page
    enabled: true
```

```bash
npx quartz plugin install --from-config
```

## 配置

安装后，`quartz.config.yaml` 中会出现类似配置：

```yaml
plugins:
  - source: github:quartz-lib/index-content-page
    enabled: true
```

本插件暂无可配置选项（`defaultOptions` 为空）。

### 示例：本地开发

在插件仓库旁的开发站点中，可用相对路径引用：

```yaml
plugins:
  - source: github:quartz-community/folder-page
    enabled: false

  - source: ../index-content-page
    enabled: true
```

改代码后执行 `npm run build`，再重启 Quartz dev server 即可验证。

### 示例：同步调整布局

启用本插件后，可删除 `layout.byPageType.folder` 段（已不再使用）：

```yaml
layout:
  byPageType:
    content: {}
    tag:
      exclude:
        - reader-mode
      positions:
        right: []
```

> [!tip]
> 若将来有「没有 `index.md` 的空文件夹」需要索引页，只能保留 FolderPage，或在本插件中自行实现 `generate`（通常不需要）。

## 在 quartz.ts 中使用

如需在 TypeScript 配置中手动注册：

```ts
import * as Plugin from "./.quartz/plugins"

Plugin.IndexContentPage()
```

## 行为对比

| 场景                     | 启用前（FolderPage）    | 启用后（IndexContentPage） |
| ------------------------ | ----------------------- | -------------------------- |
| `content/dsa/index.md`   | Markdown + 下方文件列表 | 纯 Markdown（Content 页）  |
| 没有 `index.md` 的文件夹 | 自动生成虚拟索引页      | **不再生成**               |
| `content/index.md`       | Content 页（不变）      | Content 页（不变）         |
| `content/tags/*.md`      | Tag 页（不变）          | Tag 页（不变）             |

## 工作原理

插件注册一个 PageType，做三件事：

1. **slug 匹配**：`slug.endsWith("/index")` 时命中（如 `dsa/index`），但不影响根目录的 `index`。
2. **布局选择**：使用 `layout: "content"`，与普通内容页共享同一套侧边栏与 TOC 配置。
3. **正文渲染**：通过自包含的 `ContentBody` 组件（与 [content-page](https://github.com/quartz-community/content-page) 一致）将 HTML AST 转为 JSX，不实现 `generate`，因此不会创建虚拟 folder 页。

> [!note]
> [ContentPage](https://github.com/quartz-community/content-page) 硬编码排除 `slug.endsWith("/index")` 的页面；FolderPage 无法通过 YAML 配置去掉文件列表。因此必须用本插件替换 FolderPage 对子目录 index 的处理逻辑。

匹配优先级：

| 插件                 | priority | 匹配范围                              |
| -------------------- | -------- | ------------------------------------- |
| ContentPage          | 0        | 除 `*/index` 和 `tags/*` 外的所有页面 |
| FolderPage           | 10       | `*/index`（含虚拟 folder 页）         |
| **IndexContentPage** | **11**   | `*/index`（仅已有 `index.md` 的页面） |
| TagPage              | —        | `tags/*`                              |

## 开发

```bash
git clone git@github.com:quartz-lib/index-content-page.git
cd index-content-page
npm install
npm run build
npm run typecheck
```

常用命令：

| 命令                | 说明                 |
| ------------------- | -------------------- |
| `npm run build`     | 构建并输出到 `dist/` |
| `npm run typecheck` | TypeScript 类型检查  |

> [!important]
> `dist/` 目录需要提交到仓库。Quartz 安装插件时优先使用预构建产物，可跳过本地编译，安装更快。

## 验证

启用插件并禁用 `folder-page` 后，访问 `/dsa/` 或 `/dsa/index`，确认：

- 右侧有 TOC
- 正文下方**没有** `.page-listing` 文件列表
- 页面布局与普通 Content 页一致

## 相关文档

- [Making your own plugins](https://quartz.jzhao.xyz/advanced/making-plugins) — Quartz 插件类型与生命周期
- [Creating Component Plugins](https://quartz.jzhao.xyz/advanced/creating-components) — Component 与 JSX 编写规范（本插件为 PageType，正文组件遵循同一套 `QuartzComponent` 约定）
- [ContentPage](https://quartz.jzhao.xyz/plugins/ContentPage) — 默认内容页插件
- [FolderPage](https://quartz.jzhao.xyz/plugins/FolderPage) — 本插件所替代的 folder 索引行为

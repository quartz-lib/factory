# Quartz 即用模板

这是一个基于 Quartz v5 的公共模板仓库，用于把 Quartz 程序、插件配置和内容仓库拆开管理。内容仓库只需要维护 `content/` 和 `site.yaml`，即可复用本仓库的 GitHub Pages workflow 自动构建发布。

上游 Quartz 文档见 [quartz.jzhao.xyz](https://quartz.jzhao.xyz/)，本模板仓库地址为 [quartz-lib/factory](https://github.com/quartz-lib/factory)。

## 特性

- 基于 Quartz v5 和 `quartz-community/*` 插件体系。
- 预置 Obsidian 风格 Markdown、搜索、图谱、反向链接、目录、RSS、站点地图等常用能力。
- 预装 `quartz-lib/full-width-tables`、`quartz-lib/index-content-page`、`quartz-lib/sort-by-order`、`quartz-lib/heading-format`。
- 提供可复用 GitHub Pages workflow，内容仓库无需复制完整 Quartz 源码。
- 构建时强制内容仓库提供 `configuration.pageTitle` 和 `configuration.baseUrl`，避免误用模板默认站点信息。

## 内容仓库结构

内容仓库推荐只保留以下结构：

```text
.
├── content/
│   └── index.md
└── site.yaml
```

`site.yaml` 至少需要包含：

```yaml
configuration:
  pageTitle: 我的站点
  baseUrl: example.com
```

> [!NOTE]
> `baseUrl` 不要包含 `https://`，也不要带首尾斜杠。如果使用 GitHub Pages 的项目页，例如 `https://owner.github.io/repo`，应写成 `owner.github.io/repo`。

如需覆盖 footer 链接、评论或其他插件配置，可继续在 `site.yaml` 中添加：

```yaml
footerLinks:
  GitHub: https://github.com/owner/repo

pluginOverrides:
  - name: comments
    enabled: true
    options:
      provider: giscus
      options:
        repo: owner/repo
```

如果站点使用自定义域名，并且需要 GitHub Pages 发布 `CNAME` 文件，可以在 `site.yaml` 中启用 `cname` 插件：

```yaml
pluginOverrides:
  - name: cname
    enabled: true
```

## GitHub Pages 部署

在内容仓库创建 `.github/workflows/deploy-pages.yaml`：

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    uses: quartz-lib/factory/.github/workflows/deploy-pages.yaml@master
    with:
      quartz-repository: quartz-lib/factory
      quartz-ref: master
      content-directory: "."
```

然后在仓库 `Settings -> Pages` 中将 Source 设置为 `GitHub Actions`。

## 本地构建

需要 Node.js 22 及以上版本。

```bash
npm ci
npx quartz plugin install
node scripts/build-content-site.mjs ../your-content-repo ./public
```

脚本会读取内容仓库的 `site.yaml`，合并到本仓库的 `quartz.config.yaml`，并把站点输出到指定目录。

本地预览某个内容仓库时，可以直接运行：

```bash
make blog ../your-content-repo/content
```

这会读取 `../your-content-repo/site.yaml` 和 `../your-content-repo/content/`，启动 Quartz 本地服务。需要指定端口时传 `PORT`：

```bash
make blog ../your-content-repo/content PORT=3000
```

## 模板配置

共享配置位于 `quartz.config.yaml`。它只保存模板层面的默认插件、布局和样式；具体站点标题、域名、footer 链接和站点级插件开关应放在内容仓库的 `site.yaml` 中。

插件版本锁定在 `quartz.lock.json`。更新或新增插件后，请提交对应 lock 文件，确保所有内容仓库构建结果一致。

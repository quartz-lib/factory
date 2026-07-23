# Heading Format

Quartz v5 的 Transformer 插件，为二级、三级、四级标题提供差异化样式，让层级结构一目了然。

Quartz 默认的 h2 / h3 / h4 仅靠字号区分，视觉层次不够明显。本插件通过 rehype 处理与 CSS 注入，为各级标题附加专用 class 并应用预设样式，无需手动修改 `custom.scss`。

仓库地址：https://github.com/quartz-lib/heading-format

## 功能

- 为 `h2`、`h3`、`h4` 分别注入 `hf-h2`、`hf-h3`、`hf-h4` class
- 提供 4 套开箱即用的样式预设，通过 `style` 选项一键切换
- 样式限定在 `article` 正文区域内，不影响侧边栏、目录等布局组件
- 使用 Quartz CSS 变量（`--secondary`、`--tertiary`、`--gray` 等），自动适配亮色 / 暗色主题
- 与 `rehype-slug` 锚点链接兼容，不干扰现有标题 ID 生成

## 样式预设

| `style` 值 | 名称   | 说明                               |
| ---------- | ------ | ---------------------------------- |
| `accent`   | 强调条 | 左侧色条 + 浅背景，适合技术文档    |
| `minimal`  | 极简   | 颜色 / 字重 / 缩进递进，克制不抢眼 |
| `gradient` | 渐变线 | 渐变底线 + 递进下划线，清爽利落    |
| `card`     | 卡片   | 阴影卡片 + 嵌套色块，层次感强      |

本地预览：在仓库根目录打开 `preview.html`，或运行 `python3 -m http.server 8765` 后访问 `http://localhost:8765/preview.html`。

## 要求

- Quartz v5.0.0 及以上
- Node.js >= 22

## 安装

在你的 Quartz 站点根目录执行：

```bash
npx quartz plugin add github:quartz-lib/heading-format
```

CLI 会自动将插件写入 `quartz.config.yaml` 和 `quartz.lock.json`。

## 配置

安装后，`quartz.config.yaml` 中会出现类似配置：

```yaml
plugins:
  - source: github:quartz-lib/heading-format
    enabled: true
    options:
      style: accent
```

### 选项说明

| 选项    | 类型                                                  | 默认值     | 说明                                      |
| ------- | ----------------------------------------------------- | ---------- | ----------------------------------------- |
| `style` | `"accent"` \| `"minimal"` \| `"gradient"` \| `"card"` | `"accent"` | 标题样式预设。传入无效值时回退为 `accent` |

### 示例：极简风格

```yaml
plugins:
  - source: github:quartz-lib/heading-format
    enabled: true
    options:
      style: minimal
```

### 示例：渐变线风格

```yaml
plugins:
  - source: github:quartz-lib/heading-format
    enabled: true
    options:
      style: gradient
```

### 示例：卡片风格

```yaml
plugins:
  - source: github:quartz-lib/heading-format
    enabled: true
    options:
      style: card
```

## 在 quartz.ts 中使用

如需在 TypeScript 配置中手动注册：

```ts
import * as Plugin from "./.quartz/plugins"

export default {
  plugins: {
    transformers: [
      Plugin.HeadingFormat({
        style: "accent",
      }),
    ],
  },
}
```

## 工作原理

插件做两件事：

1. **rehype 插件**：在 HTML AST 阶段，遍历所有 `h2`、`h3`、`h4` 元素，分别添加 `hf-h2`、`hf-h3`、`hf-h4` class。
2. **CSS 注入**：通过 Transformer 的 `externalResources()` 钩子，按所选 `style` 预设向页面注入内联样式。

所有 CSS 选择器以 `article` 为作用域（如 `article h2.hf-h2`），确保只影响正文内容区的标题，不会污染全局布局。

> [!NOTE]
> 本插件为 Transformer 类型，负责处理 Markdown 渲染后的 HTML 内容。与负责页面布局的 [Component 插件](https://quartz.jzhao.xyz/advanced/creating-components) 不同，无需在 `layout` 中配置位置。

## 开发

```bash
git clone git@github.com:quartz-lib/heading-format.git
cd heading-format
npm install
npm run build
npm run typecheck
```

常用命令：

| 命令                | 说明                 |
| ------------------- | -------------------- |
| `npm run build`     | 构建并输出到 `dist/` |
| `npm run dev`       | 监听模式构建         |
| `npm run typecheck` | TypeScript 类型检查  |

> [!IMPORTANT]
> `dist/` 目录需要提交到仓库。Quartz 安装插件时优先使用预构建产物，可跳过本地编译，安装更快。

## 相关文档

- [Making your own plugins](https://quartz.jzhao.xyz/advanced/making-plugins) — Quartz 插件类型与生命周期
- [Creating Component Plugins](https://quartz.jzhao.xyz/advanced/creating-components) — Component 插件（本插件为 Transformer，与此不同）
- [full-width-tables](https://github.com/quartz-lib/full-width-tables) — 同类型的 Transformer 插件参考实现

## License

MIT

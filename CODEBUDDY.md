# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Commands

```bash
# 本地开发（Next.js dev server，默认 http://localhost:3000）
npm run dev

# 生产构建
npm run build

# 运行生产构建
npm run start

# ESLint 代码检查
npm run lint

# Cloudflare Workers 本地预览（需先 build）
npm run preview

# 部署到 Cloudflare Workers
npm run deploy

# 上传到 Cloudflare（不上线）
npm run upload

# 生成 Cloudflare 环境类型定义
npm run cf-typegen
```

## Architecture

### 项目概览

**证照优化大师** 是一个部署在 Cloudflare Workers 上的 Next.js 15 单页应用。用户上传人像照片，选择背景色和服装款式，应用通过外部 AI 图像生成 API（豆包 Seedream 4.5 模型）将照片优化为专业证件照。

### 技术栈

- **Next.js 15** (App Router) + React 19 + TypeScript 5.5 (strict)
- **Tailwind CSS 3.4** + `tailwindcss-animate` 插件
- **lucide-react 0.400** 图标库
- **Cloudflare Workers** 运行时（通过 `@opennextjs/cloudflare` 适配器）
- **wrangler 4.x** 管理 Cloudflare 部署

### 路由结构

整个应用是单页，只有一个页面路由：

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `app/page.tsx` | 唯一页面，包含全部业务逻辑和状态管理 |
| `/api/optimize` | `app/api/optimize/route.ts` | POST API，接收 `{ imageBase64, prompt }`，调用 AI 接口生成图片并返回 `{ resultImageUrl }` |
| `/api/download` | `app/api/download/` | 预留，未实现 |
| `/api/upload` | `app/api/upload/` | 预留，未实现 |

`app/layout.tsx` 提供全局布局：`<GlobalNav />` 固定顶部导航 + `<main>` 内容区 + `<Footer />`。

### 数据流（单向，无全局状态库）

所有状态集中在 `app/page.tsx`（Home 组件）中，通过 React `useState` 管理：

```
imageBase64 (string | null)      ← ImageUploader.onImageReady
background (BackgroundOption)     ← BackgroundSelector.onSelect
clothing (ClothingItem | null)    ← ClothingSelector.onSelect
resultImageUrl (string | null)    ← POST /api/optimize 响应
isOptimizing (boolean)            ← API 调用期间为 true
error (string | null)             ← API 错误或校验失败
```

**核心流程**：

1. 用户上传图片 → `ImageUploader` 通过 `FileReader` 将文件转为 base64 → 回调 `onImageReady(base64)` → 设置 `imageBase64`
2. 用户选择背景色和服装 → 分别回调设置 `background` 和 `clothing`
3. 点击"开始优化" → `handleOptimize()` 调用 `assemblePrompt()` 构建 prompt → `fetch('/api/optimize', { imageBase64, prompt })` → 设置 `resultImageUrl`
4. 有结果后，左侧面板从 `ImageUploader` 切换为 `ResultDisplay`（互斥渲染）
5. "下载图片"通过创建临时 `<a>` 元素触发浏览器下载
6. "重新开始" → `handleReset()` 清空全部状态

**触发条件**：`canOptimize = imageBase64 && background && !isOptimizing`，三者缺一不可。

### 组件职责

所有组件均为 `"use client"` 客户端组件：

- **GlobalNav** (`components/GlobalNav.tsx`)：固定顶部导航栏，玻璃态模糊背景，深色主题，44px 高
- **ImageUploader** (`components/ImageUploader.tsx`)：拖拽/点击上传，文件验证（仅图片，≤10MB），三种状态（空/读取中/已上传预览）
- **BackgroundSelector** (`components/BackgroundSelector.tsx`)：白/蓝/红三色圆形按钮，`role="radio"` + `aria-checked` 无障碍
- **ClothingSelector** (`components/ClothingSelector.tsx`)：三组（通用8款/男8款/女8款），4列网格，通用组首项为"原始服装"对应 `selected=null`
- **ResultDisplay** (`components/ResultDisplay.tsx`)：加载态旋转动画 + 倒计时提示（15-30秒），结果态展示 `next/image` + 下载按钮
- **Footer** (`components/Footer.tsx`)：纯展示版权信息

### lib/ 模块

- **lib/coze.ts**：AI 图像生成客户端。端点 `http://plugin.aiconductor.fun/api/generate_image`，Bearer Token 认证（环境变量 `IMAGE_API_KEY`），超时 90 秒（AbortController），模型 `doubao-seedream-4-5-251128`，以图生图模式（`image` 参数传 base64），分辨率 2K，比例 3:4，返回格式 `url`
- **lib/prompt.ts**：`BASE_PROMPT` 包含老照片修复 + 背景替换 + 姿态校正 + 灯光优化的中文 prompt 模板。`assemblePrompt(bgColor, clothing)` 将背景色和服装描述填入模板。核心要求：**严格 100% 保留原图五官轮廓、面部细节、发型**
- **lib/clothing-data.ts**：`clothingData`（24 款服装的 name/id/gender/description）和 `backgroundOptions`（白/蓝/红三色），数据源文件，不导出函数

### 类型定义

`types/index.ts` 定义两个接口：
- `ClothingItem`: `{ id, name, gender: "通用"|"男"|"女", description }`
- `BackgroundOption`: `{ id, name, color (CSS), promptColor (中文) }`

### 样式方案

Tailwind CSS 3.4，配置在 `tailwind.config.ts` 中定义了 Apple 风格 design tokens：
- **颜色**：`primary`(蓝)、`canvas`(白/米白)、`surface`(暗色 tile, #141414/#1a1a1a)、`ink`(文字灰阶)、`body`/`divider`
- **字号**：`hero-display`(56px) 到 `micro-legal`(10px) 共 10 级
- **圆角**：`xs`(5px) → `pill`(9999px) 阶梯式
- **阴影**：`product` Apple 风格阴影
- **字体**：SF Pro Display/Text 优先，后备 Inter + system-ui

`globals.css` 做全局重置（`* { margin:0; padding:0; box-sizing:border-box }`）。

布局为双栏响应式：左侧 42% 暗色展示区 + 右侧 58% 白色配置区，移动端纵向堆叠。

### 部署架构

部署目标为 Cloudflare Workers：

- `wrangler.jsonc`：定义 Worker 入口 `.open-next/worker.js`，静态资源 `.open-next/assets`，绑定 `ASSETS`、`IMAGES`、`WORKER_SELF_REFERENCE`，兼容性标志 `nodejs_compat` + `global_fetch_strictly_public`
- `open-next.config.ts`：仅一行 `defineCloudflareConfig()`，使用默认配置
- `next.config.js`：`images.remotePatterns` 允许所有 HTTPS 域名（AI 返回的图片 URL 域名不固定），`unoptimized: false`

**环境变量**：`.env.local` 中配置 `IMAGE_API_KEY`（AI 接口 Bearer Token），服务端 `lib/coze.ts` 通过 `process.env.IMAGE_API_KEY` 读取。

### 关键约束与注意事项

1. **AI API 端点走 HTTP 而非 HTTPS**（`http://plugin.aiconductor.fun`），在 Cloudflare Workers 中 `global_fetch_strictly_public` 兼容性标志确保 fetch 能访问外网
2. **图片以 base64 在整个流程中传递**，不涉及文件存储（`/api/upload` 和 `/api/download` 预留但未实现）
3. **GenerateResponse 的 images 数组**中每项可能包含 `url` 或 `b64_json`，当前代码只处理 `url` 形式
4. **API 超时 90 秒**，但页面提示用户"15-30 秒"，超时后返回 504
5. **所有组件都是客户端组件**（`"use client"`），不存在 RSC（React Server Components）逻辑
6. **navigator.onLine 检测**：优化按钮的点击处理中会检查 `navigator.onLine`，离线时直接报错

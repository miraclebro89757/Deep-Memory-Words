# 🚀 项目设置指南

## 快速开始

### 1. 安装依赖

```bash
cnpm install
```

### 2. 启动开发服务器

```bash
cnpm run dev
```

项目将在 http://localhost:3000 启动

### 3. 构建生产版本

```bash
cnpm run build
```

### 4. 预览生产版本

```bash
cnpm run preview
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 头部组件
│   ├── Footer.tsx      # 底部组件
│   ├── InputForm.tsx   # 输入表单组件
│   ├── StoryDisplay.tsx # 故事展示组件
│   └── ApiConfig.tsx   # API配置组件
├── services/           # 服务层
│   ├── aliyunApi.ts    # 阿里云API服务
│   └── storageService.ts # 本地存储服务
├── stores/             # 状态管理
│   └── storyStore.ts   # 故事状态管理
├── types/              # TypeScript类型定义
│   └── index.ts
├── styles/             # 样式文件
│   └── index.css       # 全局样式
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **Ant Design** - UI组件库
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Lucide React** - 图标库

## 开发说明

### 添加新组件

1. 在 `src/components/` 目录下创建新的 `.tsx` 文件
2. 使用 TypeScript 接口定义 props
3. 使用 Tailwind CSS 进行样式设计
4. 遵循 React Hooks 最佳实践

### 状态管理

使用 Zustand 进行状态管理：

```typescript
import { useStoryStore } from '../stores/storyStore'

const { stories, loading, generateStory } = useStoryStore()
```

### API 集成

1. 在 `src/services/` 目录下添加新的服务文件
2. 使用 Axios 进行 HTTP 请求
3. 在组件中调用服务方法

### 样式指南

- 使用 Tailwind CSS 类名
- 自定义样式在 `src/styles/index.css` 中定义
- 组件特定样式使用 CSS Modules 或内联样式

## 部署

### 构建生产版本

```bash
cnpm run build
```

### 部署到静态服务器

将 `dist` 目录的内容部署到任何静态文件服务器。

### 环境变量

创建 `.env` 文件来配置环境变量：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=单词记忆故事生成器
```

## 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   rm -rf node_modules package-lock.json
   cnpm install
   ```

2. **TypeScript 错误**
   ```bash
   cnpm run lint
   ```

3. **构建失败**
   ```bash
   rm -rf dist
   cnpm run build
   ```

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License 
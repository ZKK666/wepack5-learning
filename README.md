# Webpack 5 + React 18 学习项目

> 面试高频知识点实战项目，帮助你快速掌握 Webpack 5 和 React 18 的核心特性

## 项目特点

- **Webpack 5 完整配置**：包含开发/生产环境配置、代码分割、缓存优化等
- **React 18 新特性示例**：自动批处理、useTransition、useDeferredValue、useId、Suspense 改进
- **面试知识点详解**：代码中包含详细的面试要点注释
- **实战功能模块**：登录注册、数据表格、购物车等真实项目功能

## 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0

推荐使用 Node.js 18.x 或 20.x LTS 版本。

## 快速开始

```bash
# 检查 Node 版本
node -v

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 带分析的生产构建
npm run build:analyze
```

## 项目结构

```
├── webpack.common.js      # Webpack 公共配置
├── webpack.dev.js         # 开发环境配置
├── webpack.prod.js        # 生产环境配置
├── babel.config.js        # Babel 配置
├── src/
│   ├── index.js           # 入口文件（createRoot API）
│   ├── App.jsx            # 主应用（懒加载示例）
│   ├── index.html         # HTML 模板
│   ├── styles/
│   │   └── global.css     # 全局样式
│   ├── components/        # React 18 特性示例
│   │   ├── AutoBatching.jsx       # 自动批处理
│   │   ├── UseTransition.jsx      # useTransition
│   │   ├── UseDeferredValue.jsx   # useDeferredValue
│   │   ├── UseId.jsx              # useId
│   │   ├── SuspenseExample.jsx    # Suspense 数据获取
│   │   └── CodeSplitting.jsx      # 代码分割示例
│   └── utils/
│       └── mathUtils.js   # 动态导入示例
```

## Webpack 5 知识点

### 1. 入口与输出
- 单入口/多入口配置
- Hash 类型：`[hash]` vs `[chunkhash]` vs `[contenthash]`
- `clean: true` 替代 clean-webpack-plugin

### 2. Loader 与 Plugin
- Loader 执行顺序：从右到左，从下到上
- 常用 Loader：babel-loader、css-loader、style-loader
- 常用 Plugin：HtmlWebpackPlugin、MiniCssExtractPlugin

### 3. Asset Modules（Webpack 5 新特性）
- `asset/resource`：替代 file-loader
- `asset/inline`：替代 url-loader
- `asset/source`：替代 raw-loader
- `asset`：自动选择

### 4. 代码分割
- SplitChunksPlugin 配置
- 动态导入 `import()`
- React.lazy + Suspense
- webpackPrefetch / webpackPreload

### 5. 缓存优化
- 持久化缓存 `cache: { type: 'filesystem' }`
- 确定性 ID `moduleIds: 'deterministic'`

### 6. Tree Shaking
- 使用 ES6 模块语法
- `sideEffects: false`
- `usedExports: true`

### 7. DevServer 配置
- HMR 热模块替换
- 代理配置解决跨域
- historyApiFallback

## React 18 新特性

### 1. createRoot API
```jsx
import { createRoot } from 'react-dom/client';
const root = createRoot(container);
root.render(<App />);
```

### 2. 自动批处理
```jsx
// React 18 所有更新都自动批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只触发一次渲染
}, 0);
```

### 3. useTransition
```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setSearchResults(search(query));
});
```

### 4. useDeferredValue
```jsx
const deferredQuery = useDeferredValue(query);
```

### 5. useId
```jsx
const id = useId();
<label htmlFor={id}>Name</label>
<input id={id} />
```

## 面试常见问题

1. **Webpack 的构建流程是什么？**
2. **Loader 和 Plugin 的区别？**
3. **Hash、ChunkHash、ContentHash 的区别？**
4. **如何优化 Webpack 构建速度？**
5. **如何实现代码分割？**
6. **Tree Shaking 的原理和条件？**
7. **React 18 的 Concurrent 模式是什么？**
8. **useTransition 和 useDeferredValue 的区别？**

详细答案请查看代码中的注释。

## License

MIT

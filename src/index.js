/**
 * React 18 入口文件
 *
 * 【React 18 新特性】createRoot API
 *
 * React 18 之前：
 * import ReactDOM from 'react-dom';
 * ReactDOM.render(<App />, document.getElementById('root'));
 *
 * React 18：
 * import { createRoot } from 'react-dom/client';
 * const root = createRoot(document.getElementById('root'));
 * root.render(<App />);
 *
 * 区别：
 * 1. createRoot 启用了 React 18 的所有新特性
 * 2. 支持 Concurrent 并发模式
 * 3. 支持自动批处理（Automatic Batching）
 */
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// 获取根节点
const container = document.getElementById('root');

// 创建 React 根节点
const root = createRoot(container);

// 渲染应用
root.render(<App />);

/**
 * 【Webpack 知识点】动态导入实现代码分割
 *
 * 使用 import() 动态导入，Webpack 会自动进行代码分割
 * 生成单独的 chunk 文件，实现按需加载
 *
 * 示例：
 * const LazyComponent = lazy(() => import('./components/LazyComponent'));
 */

/**
 * 主应用组件
 *
 * 展示 React 18 新特性示例
 */
import { useState, lazy, Suspense } from 'react';

// 【Webpack 知识点】懒加载 - 使用 lazy + Suspense
// Webpack 会自动为这些组件生成单独的 chunk
const AutoBatching = lazy(() => import('./components/AutoBatching'));
const UseTransition = lazy(() => import('./components/UseTransition'));
const UseDeferredValue = lazy(() => import('./components/UseDeferredValue'));
const UseId = lazy(() => import('./components/UseId'));
const SuspenseExample = lazy(() => import('./components/SuspenseExample'));
const CodeSplitting = lazy(() => import('./components/CodeSplitting'));

// 示例列表
const examples = [
  { id: 'auto-batching', name: '自动批处理', component: AutoBatching },
  { id: 'use-transition', name: 'useTransition', component: UseTransition },
  { id: 'use-deferred-value', name: 'useDeferredValue', component: UseDeferredValue },
  { id: 'use-id', name: 'useId', component: UseId },
  { id: 'suspense', name: 'Suspense 数据获取', component: SuspenseExample },
  { id: 'code-splitting', name: '代码分割示例', component: CodeSplitting },
];

function App() {
  const [activeExample, setActiveExample] = useState('auto-batching');

  // 获取当前示例组件
  const ActiveComponent = examples.find(e => e.id === activeExample)?.component;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Webpack 5 + React 18 学习项目</h1>
        <p>面试高频知识点 & 新特性实战</p>
      </header>

      {/* 导航 */}
      <nav className="nav">
        {examples.map(example => (
          <button
            key={example.id}
            className={activeExample === example.id ? 'active' : ''}
            onClick={() => setActiveExample(example.id)}
          >
            {example.name}
          </button>
        ))}
      </nav>

      {/* 示例内容 - 使用 Suspense 包裹懒加载组件 */}
      <Suspense fallback={<div className="loading">加载中...</div>}>
        {ActiveComponent && <ActiveComponent />}
      </Suspense>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        <p>查看源码学习更多 Webpack 5 和 React 18 知识点</p>
      </footer>
    </div>
  );
}

export default App;

/**
 * Webpack 5 代码分割示例
 *
 * 【面试重点】代码分割的三种方式：
 *
 * 1. 入口起点：使用 entry 配置手动分离代码
 * 2. 防止重复：使用 SplitChunksPlugin 去重和分离 chunk
 * 3. 动态导入：通过模块的内联函数调用 import()
 *
 * 本示例演示动态导入（Dynamic Import）
 */
import { useState, lazy, Suspense } from 'react';

// 【Webpack 知识点】使用 webpackChunkName 魔法注释自定义 chunk 名称
const HeavyComponent = lazy(() =>
  import(/* webpackChunkName: "heavy-component" */ './HeavyComponent')
);

// 【Webpack 知识点】webpackPrefetch 预获取
// 会在浏览器空闲时提前加载
const PrefetchComponent = lazy(() =>
  import(/* webpackChunkName: "prefetch", webpackPrefetch: true */ './PrefetchComponent')
);

// 【Webpack 知识点】webpackPreload 预加载
// 会与父 chunk 并行加载
const PreloadComponent = lazy(() =>
  import(/* webpackChunkName: "preload", webpackPreload: true */ './PreloadComponent')
);

function CodeSplitting() {
  const [showHeavy, setShowHeavy] = useState(false);
  const [showPrefetch, setShowPrefetch] = useState(false);
  const [showPreload, setShowPreload] = useState(false);
  const [dynamicResult, setDynamicResult] = useState(null);

  // 【Webpack 知识点】动态导入模块
  const loadDynamicModule = async () => {
    const module = await import(
      /* webpackChunkName: "math-utils" */
      '../utils/mathUtils'
    );
    const result = module.add(10, 20);
    setDynamicResult(result);
  };

  return (
    <div className="example-section">
      <span className="feature-tag">Webpack 5 特性</span>
      <h2>代码分割（Code Splitting）</h2>

      <div className="tip-box">
        <strong>代码分割的作用：</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>减少初始加载体积</li>
          <li>按需加载，提升首屏速度</li>
          <li>更好的缓存利用</li>
        </ul>
      </div>

      <h3>1. 懒加载组件（React.lazy + Suspense）</h3>
      <div className="demo-area">
        <p>点击按钮加载组件，查看 Network 面板观察 chunk 加载：</p>
        <button
          className="btn btn-primary"
          onClick={() => setShowHeavy(!showHeavy)}
        >
          {showHeavy ? '隐藏' : '加载'} Heavy Component
        </button>

        {showHeavy && (
          <Suspense fallback={<div className="loading">加载组件中...</div>}>
            <HeavyComponent />
          </Suspense>
        )}
      </div>

      <h3>2. 预获取（Prefetch）</h3>
      <div className="demo-area">
        <p>
          <code>webpackPrefetch: true</code> - 浏览器空闲时预先加载
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setShowPrefetch(!showPrefetch)}
        >
          {showPrefetch ? '隐藏' : '显示'} Prefetch Component
        </button>

        {showPrefetch && (
          <Suspense fallback={<div className="loading">加载中...</div>}>
            <PrefetchComponent />
          </Suspense>
        )}
      </div>

      <h3>3. 预加载（Preload）</h3>
      <div className="demo-area">
        <p>
          <code>webpackPreload: true</code> - 与父 chunk 并行加载
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setShowPreload(!showPreload)}
        >
          {showPreload ? '隐藏' : '显示'} Preload Component
        </button>

        {showPreload && (
          <Suspense fallback={<div className="loading">加载中...</div>}>
            <PreloadComponent />
          </Suspense>
        )}
      </div>

      <h3>4. 动态导入模块</h3>
      <div className="demo-area">
        <button className="btn btn-primary" onClick={loadDynamicModule}>
          动态加载 mathUtils 模块
        </button>
        {dynamicResult !== null && (
          <p style={{ marginTop: '10px' }}>
            计算结果: 10 + 20 = <strong>{dynamicResult}</strong>
          </p>
        )}
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`// 1. React.lazy 懒加载组件
const LazyComp = lazy(() => import('./Component'));

// 2. 魔法注释 - 自定义 chunk 名称
const Comp = lazy(() =>
  import(/* webpackChunkName: "my-chunk" */ './Component')
);

// 3. Prefetch - 浏览器空闲时加载（用于未来可能需要的资源）
import(/* webpackPrefetch: true */ './Component');
// 生成: <link rel="prefetch" href="component.js">

// 4. Preload - 与父 chunk 并行加载（用于当前页面必需的资源）
import(/* webpackPreload: true */ './Component');
// 生成: <link rel="preload" href="component.js">

// 5. SplitChunksPlugin 配置
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        test: /[\\\\/]node_modules[\\\\/]/,
        name: 'vendors',
      }
    }
  }
}`}
      </div>
    </div>
  );
}

export default CodeSplitting;

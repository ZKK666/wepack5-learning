/**
 * React 18 新特性：Suspense 改进
 *
 * 【面试重点】
 *
 * React 18 对 Suspense 的改进：
 * 1. 支持服务端渲染（SSR）的流式传输
 * 2. 更好的数据获取支持
 * 3. 与 useTransition 配合使用
 *
 * Suspense 边界：
 * - 包裹可能"暂停"的组件
 * - 在内容加载时显示 fallback
 * - 支持嵌套
 */
import { Suspense, useState } from 'react';

// 模拟数据获取的简单缓存
const cache = new Map();

function fetchData(key, delay = 1000) {
  if (!cache.has(key)) {
    cache.set(
      key,
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: `数据 "${key}" 加载完成！(延迟 ${delay}ms)`,
            timestamp: new Date().toLocaleTimeString()
          });
        }, delay);
      })
    );
  }
  return cache.get(key);
}

// 简单的 use 模拟（React 未来会提供 use hook）
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
    throw promise;
  }
}

// 数据展示组件
function DataDisplay({ dataKey, delay }) {
  const { data, timestamp } = use(fetchData(dataKey, delay));

  return (
    <div style={{
      padding: '15px',
      background: '#e8f4fd',
      borderRadius: '8px',
      marginBottom: '10px'
    }}>
      <p><strong>{data}</strong></p>
      <p style={{ fontSize: '12px', color: '#666' }}>时间: {timestamp}</p>
    </div>
  );
}

// 用户信息组件
function UserInfo() {
  const user = use(fetchData('user', 800));
  return (
    <div className="tip-box success">
      <strong>用户信息:</strong> {user.data}
    </div>
  );
}

// 用户文章组件
function UserPosts() {
  const posts = use(fetchData('posts', 1500));
  return (
    <div className="tip-box">
      <strong>用户文章:</strong> {posts.data}
    </div>
  );
}

function SuspenseExample() {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    cache.clear();
    setKey(k => k + 1);
  };

  return (
    <div className="example-section" key={key}>
      <span className="feature-tag">React 18 改进</span>
      <h2>Suspense 数据获取</h2>

      <div className="tip-box warning">
        <strong>注意：</strong>
        这是 Suspense 数据获取的演示。实际项目中推荐使用 React Query、SWR 或框架内置的数据获取方案。
      </div>

      <h3>基本使用</h3>
      <div className="demo-area">
        <button className="btn btn-primary" onClick={handleRefresh}>
          刷新数据
        </button>

        <div style={{ marginTop: '15px' }}>
          <Suspense fallback={<div className="loading">加载数据中...</div>}>
            <DataDisplay dataKey="demo" delay={1000} />
          </Suspense>
        </div>
      </div>

      <h3>嵌套 Suspense</h3>
      <div className="demo-area">
        <p>外层 Suspense 处理用户信息，内层处理文章（独立加载）：</p>

        <Suspense fallback={<div className="loading">加载用户信息...</div>}>
          <UserInfo />

          <Suspense fallback={<div className="loading">加载文章...</div>}>
            <UserPosts />
          </Suspense>
        </Suspense>
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`import { Suspense } from 'react';

// 基本用法
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  );
}

// 嵌套 Suspense - 独立加载状态
function UserPage() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserInfo />
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts />
      </Suspense>
    </Suspense>
  );
}

// React 18 改进：
// 1. SSR 支持 - 流式传输
// 2. 配合 useTransition - 控制加载状态
// 3. 更好的错误边界集成

// 配合 lazy 实现代码分割
const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>`}
      </div>
    </div>
  );
}

export default SuspenseExample;

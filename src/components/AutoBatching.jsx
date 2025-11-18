/**
 * React 18 新特性：自动批处理（Automatic Batching）
 *
 * 【面试重点】
 *
 * React 17 及之前：
 * - 只有在 React 事件处理函数中的 setState 会被批处理
 * - 在 setTimeout、Promise、原生事件中的多个 setState 会触发多次渲染
 *
 * React 18：
 * - 所有更新都会自动批处理，包括 setTimeout、Promise、原生事件
 * - 大幅减少不必要的重新渲染，提升性能
 *
 * 如何退出批处理：
 * import { flushSync } from 'react-dom';
 * flushSync(() => { setState(value); }); // 立即同步更新
 */
import { useState } from 'react';
import { flushSync } from 'react-dom';

function AutoBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // 每次组件渲染时更新计数
  console.log('组件渲染了！渲染次数:', renderCount + 1);

  // 示例1: React 事件中的批处理（React 17/18 都支持）
  const handleClickEvent = () => {
    setRenderCount(r => r + 1);
    setCount(c => c + 1);
    setFlag(f => !f);
    // React 会将这三次 setState 合并为一次渲染
  };

  // 示例2: setTimeout 中的批处理（React 18 新特性）
  const handleClickTimeout = () => {
    setTimeout(() => {
      setRenderCount(r => r + 1);
      setCount(c => c + 1);
      setFlag(f => !f);
      // React 17: 会触发3次渲染
      // React 18: 自动批处理，只触发1次渲染
    }, 0);
  };

  // 示例3: Promise 中的批处理（React 18 新特性）
  const handleClickPromise = () => {
    Promise.resolve().then(() => {
      setRenderCount(r => r + 1);
      setCount(c => c + 1);
      setFlag(f => !f);
      // React 18: 自动批处理
    });
  };

  // 示例4: 使用 flushSync 退出批处理
  const handleClickFlushSync = () => {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // 这里 count 已经更新
    flushSync(() => {
      setFlag(f => !f);
    });
    // 这里 flag 已经更新
    setRenderCount(r => r + 1);
    // 使用 flushSync 会触发3次渲染
  };

  // 重置
  const handleReset = () => {
    setCount(0);
    setFlag(false);
    setRenderCount(0);
  };

  return (
    <div className="example-section">
      <span className="feature-tag">React 18 新特性</span>
      <h2>自动批处理（Automatic Batching）</h2>

      <div className="tip-box">
        <strong>什么是批处理？</strong>
        <p>将多个状态更新合并为一次重新渲染，以获得更好的性能。</p>
      </div>

      <h3>当前状态</h3>
      <div className="demo-area">
        <p>Count: <strong>{count}</strong></p>
        <p>Flag: <strong>{flag ? 'true' : 'false'}</strong></p>
        <p>渲染次数: <strong>{renderCount}</strong></p>
      </div>

      <h3>测试批处理</h3>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={handleClickEvent}>
          React 事件（批处理）
        </button>
        <button className="btn btn-primary" onClick={handleClickTimeout}>
          setTimeout（React 18 批处理）
        </button>
        <button className="btn btn-primary" onClick={handleClickPromise}>
          Promise（React 18 批处理）
        </button>
        <button className="btn btn-secondary" onClick={handleClickFlushSync}>
          flushSync（强制同步）
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          重置
        </button>
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`// React 18 自动批处理示例
setTimeout(() => {
  setCount(c => c + 1);  // 不会立即渲染
  setFlag(f => !f);      // 不会立即渲染
  // React 18 会批处理，只渲染一次
}, 0);

// 如需退出批处理，使用 flushSync
import { flushSync } from 'react-dom';
flushSync(() => {
  setCount(c => c + 1);  // 立即渲染
});`}
      </div>
    </div>
  );
}

export default AutoBatching;

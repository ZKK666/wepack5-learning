/**
 * React 18 新特性：useDeferredValue
 *
 * 【面试重点】
 *
 * useDeferredValue 接受一个值，返回该值的"延迟"版本
 * 当有更紧急的更新时，会返回旧值，避免阻塞紧急更新
 *
 * 与 useTransition 的区别：
 * - useTransition: 包装更新函数，控制状态更新的优先级
 * - useDeferredValue: 包装值，当组件接收的值来自 props 或外部时使用
 *
 * 使用场景：
 * 1. 无法控制状态更新源时（如来自 props）
 * 2. 展示旧值直到新值准备好
 * 3. 配合 memo 避免子组件不必要的重渲染
 */
import { useState, useDeferredValue, memo } from 'react';

// 模拟耗时的列表渲染组件
const SlowList = memo(function SlowList({ text }) {
  console.log('SlowList 渲染了，text:', text);

  // 故意减慢渲染
  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(
      <div key={i} style={{ padding: '2px 0' }}>
        {text ? `搜索 "${text}" 的结果 #${i + 1}` : `项目 #${i + 1}`}
      </div>
    );
  }

  return (
    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
      {items}
    </div>
  );
});

function UseDeferredValue() {
  const [input, setInput] = useState('');

  // 使用 useDeferredValue 延迟更新
  const deferredInput = useDeferredValue(input);

  // 判断是否显示旧值
  const isStale = input !== deferredInput;

  return (
    <div className="example-section">
      <span className="feature-tag">React 18 新特性</span>
      <h2>useDeferredValue</h2>

      <div className="tip-box">
        <strong>作用：</strong>
        延迟更新某个值，让 React 优先处理其他紧急更新，避免界面卡顿。
      </div>

      <h3>演示</h3>
      <div className="demo-area">
        <p>输入内容会立即更新，但列表会使用延迟值渲染：</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入搜索内容..."
        />
        <div style={{ marginTop: '10px' }}>
          <p>当前输入值: <strong>{input}</strong></p>
          <p>延迟值: <strong>{deferredInput}</strong></p>
          <p>
            状态: {isStale ? (
              <span className="status loading">正在更新...</span>
            ) : (
              <span className="status complete">已同步</span>
            )}
          </p>
        </div>

        {/* 列表使用延迟值，配合 memo 避免不必要的重渲染 */}
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: 'opacity 0.2s',
          marginTop: '15px'
        }}>
          <SlowList text={deferredInput} />
        </div>
      </div>

      <h3>useTransition vs useDeferredValue</h3>
      <div className="code-block">
{`// useTransition - 控制状态更新
const [isPending, startTransition] = useTransition();
const handleChange = (e) => {
  setInput(e.target.value);           // 紧急
  startTransition(() => {
    setSearchResults(search(value));  // 非紧急
  });
};

// useDeferredValue - 延迟值
const deferredQuery = useDeferredValue(query);
// 当 query 来自 props 时很有用
<SlowList query={deferredQuery} />`}
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`import { useDeferredValue, memo } from 'react';

function SearchResults({ query }) {
  // 延迟 query 值的更新
  const deferredQuery = useDeferredValue(query);

  // 判断是否显示旧数据
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {/* 使用 memo 包装，只有 deferredQuery 变化时才重渲染 */}
      <ResultList query={deferredQuery} />
    </div>
  );
}

// 配合 memo 使用效果更好
const ResultList = memo(function ResultList({ query }) {
  // 耗时的渲染逻辑
  return <div>{/* 渲染结果 */}</div>;
});`}
      </div>
    </div>
  );
}

export default UseDeferredValue;

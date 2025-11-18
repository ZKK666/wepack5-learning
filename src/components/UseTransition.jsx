/**
 * React 18 新特性：useTransition
 *
 * 【面试重点】
 *
 * useTransition 用于标记非紧急更新，让 React 可以中断这些更新来处理更紧急的更新
 *
 * 返回值：
 * - isPending: 是否有等待中的 transition
 * - startTransition: 将更新标记为 transition
 *
 * 使用场景：
 * 1. 大量数据的过滤/搜索
 * 2. 页面导航
 * 3. 标签页切换
 * 4. 任何不需要立即响应的 UI 更新
 *
 * 与 setTimeout 的区别：
 * - useTransition 会立即开始更新，只是优先级低
 * - setTimeout 会延迟开始更新
 * - useTransition 可以被中断，setTimeout 不能
 */
import { useState, useTransition } from 'react';

// 生成大量数据用于演示
const generateItems = (filter) => {
  const items = [];
  for (let i = 0; i < 10000; i++) {
    items.push(`Item ${i + 1}`);
  }
  return filter
    ? items.filter(item => item.toLowerCase().includes(filter.toLowerCase()))
    : items;
};

function UseTransition() {
  const [input, setInput] = useState('');
  const [list, setList] = useState(generateItems(''));
  const [isPending, startTransition] = useTransition();

  // 使用 useTransition 的搜索
  const handleChangeWithTransition = (e) => {
    const value = e.target.value;
    // 紧急更新：更新输入框（用户输入需要立即响应）
    setInput(value);

    // 非紧急更新：过滤列表（可以稍后处理）
    startTransition(() => {
      setList(generateItems(value));
    });
  };

  // 不使用 useTransition 的搜索（对比用）
  const [input2, setInput2] = useState('');
  const [list2, setList2] = useState(generateItems(''));

  const handleChangeWithoutTransition = (e) => {
    const value = e.target.value;
    setInput2(value);
    setList2(generateItems(value)); // 同步更新，会阻塞输入
  };

  return (
    <div className="example-section">
      <span className="feature-tag">React 18 新特性</span>
      <h2>useTransition</h2>

      <div className="tip-box">
        <strong>作用：</strong>
        标记非紧急更新，优先处理用户输入等紧急更新，避免界面卡顿。
      </div>

      {/* 使用 useTransition */}
      <h3>使用 useTransition（流畅）</h3>
      <div className="demo-area">
        <input
          type="text"
          value={input}
          onChange={handleChangeWithTransition}
          placeholder="搜索 10000 个项目..."
        />
        <p style={{ marginTop: '10px' }}>
          状态: {isPending ? (
            <span className="status loading">正在更新列表...</span>
          ) : (
            <span className="status complete">更新完成</span>
          )}
        </p>
        <p>找到 {list.length} 个结果</p>
        <div style={{ maxHeight: '150px', overflow: 'auto', marginTop: '10px' }}>
          {list.slice(0, 100).map((item, index) => (
            <div key={index} style={{ padding: '2px 0' }}>{item}</div>
          ))}
          {list.length > 100 && <div>... 还有 {list.length - 100} 项</div>}
        </div>
      </div>

      {/* 不使用 useTransition */}
      <h3>不使用 useTransition（卡顿）</h3>
      <div className="demo-area">
        <input
          type="text"
          value={input2}
          onChange={handleChangeWithoutTransition}
          placeholder="搜索 10000 个项目..."
        />
        <p style={{ marginTop: '10px' }}>找到 {list2.length} 个结果</p>
        <div style={{ maxHeight: '150px', overflow: 'auto', marginTop: '10px' }}>
          {list2.slice(0, 100).map((item, index) => (
            <div key={index} style={{ padding: '2px 0' }}>{item}</div>
          ))}
          {list2.length > 100 && <div>... 还有 {list2.length - 100} 项</div>}
        </div>
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`import { useTransition } from 'react';

function SearchComponent() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 紧急更新：用户输入
    setInput(e.target.value);

    // 非紧急更新：搜索结果
    startTransition(() => {
      setResults(search(e.target.value));
    });
  };

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList results={results} />
    </>
  );
}`}
      </div>
    </div>
  );
}

export default UseTransition;

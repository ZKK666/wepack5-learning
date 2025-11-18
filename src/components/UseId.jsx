/**
 * React 18 新特性：useId
 *
 * 【面试重点】
 *
 * useId 生成唯一 ID，主要用于关联 label 和 input 等无障碍功能
 *
 * 特点：
 * 1. 服务端和客户端生成相同的 ID（SSR 友好）
 * 2. 每次调用生成唯一 ID
 * 3. 在组件内稳定（不会随重渲染改变）
 *
 * 注意：
 * - 不要用于列表的 key（应使用数据中的 ID）
 * - 不要用于 CSS 选择器（生成的 ID 包含冒号）
 */
import { useId } from 'react';

// 自定义输入组件
function LabeledInput({ label, type = 'text', ...props }) {
  const id = useId();

  return (
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '5px' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        style={{
          padding: '8px 12px',
          border: '2px solid #e0e0e0',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '300px'
        }}
        {...props}
      />
    </div>
  );
}

// 带有多个关联元素的组件
function FormField({ label, hint, error }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={`${hintId} ${errorId}`}
        style={{
          padding: '8px 12px',
          border: `2px solid ${error ? '#dc3545' : '#e0e0e0'}`,
          borderRadius: '4px',
          width: '100%',
          maxWidth: '300px'
        }}
      />
      {hint && (
        <p id={hintId} style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function UseId() {
  const id1 = useId();
  const id2 = useId();

  return (
    <div className="example-section">
      <span className="feature-tag">React 18 新特性</span>
      <h2>useId</h2>

      <div className="tip-box">
        <strong>作用：</strong>
        生成唯一且稳定的 ID，用于无障碍属性关联，支持 SSR。
      </div>

      <h3>基本用法</h3>
      <div className="demo-area">
        <p>生成的 ID: <code>{id1}</code>, <code>{id2}</code></p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          注意：ID 包含冒号（:），不适合用作 CSS 选择器
        </p>
      </div>

      <h3>实际应用：Label 关联</h3>
      <div className="demo-area">
        <LabeledInput label="用户名" placeholder="请输入用户名" />
        <LabeledInput label="邮箱" type="email" placeholder="请输入邮箱" />
        <LabeledInput label="密码" type="password" placeholder="请输入密码" />
      </div>

      <h3>高级用法：多个关联元素</h3>
      <div className="demo-area">
        <FormField
          label="手机号码"
          hint="请输入11位手机号码"
          error=""
        />
        <FormField
          label="验证码"
          hint="6位数字验证码"
          error="验证码格式错误"
        />
      </div>

      <h3>面试要点</h3>
      <div className="code-block">
{`import { useId } from 'react';

function MyInput({ label }) {
  // 生成唯一 ID
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}

// 一个 ID 派生多个相关 ID
function FormField({ label, hint }) {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-describedby={\`\${id}-hint\`}
      />
      <p id={\`\${id}-hint\`}>{hint}</p>
    </>
  );
}

// 注意事项：
// ❌ 不要用于列表 key
// ❌ 不要用于 CSS 选择器（包含冒号）
// ✅ 用于无障碍属性关联`}
      </div>
    </div>
  );
}

export default UseId;

/**
 * Prefetch 预获取组件示例
 *
 * 使用 webpackPrefetch: true
 * 浏览器会在空闲时预先加载这个组件
 */
function PrefetchComponent() {
  return (
    <div style={{
      marginTop: '15px',
      padding: '20px',
      background: '#cce5ff',
      borderRadius: '8px',
      border: '2px solid #007bff'
    }}>
      <h4 style={{ margin: '0 0 10px', color: '#004085' }}>
        Prefetch Component
      </h4>
      <p style={{ margin: 0, color: '#004085' }}>
        这个组件使用了 <code>webpackPrefetch: true</code>。
        浏览器会在空闲时自动预获取，适用于用户可能访问的页面。
      </p>
      <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#004085' }}>
        生成的 HTML: <code>&lt;link rel="prefetch" href="prefetch.chunk.js"&gt;</code>
      </p>
    </div>
  );
}

export default PrefetchComponent;

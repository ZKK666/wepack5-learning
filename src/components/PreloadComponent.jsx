/**
 * Preload 预加载组件示例
 *
 * 使用 webpackPreload: true
 * 会与父 chunk 并行加载，适用于当前页面必需的资源
 */
function PreloadComponent() {
  return (
    <div style={{
      marginTop: '15px',
      padding: '20px',
      background: '#fff3cd',
      borderRadius: '8px',
      border: '2px solid #ffc107'
    }}>
      <h4 style={{ margin: '0 0 10px', color: '#856404' }}>
        Preload Component
      </h4>
      <p style={{ margin: 0, color: '#856404' }}>
        这个组件使用了 <code>webpackPreload: true</code>。
        会与父 chunk 并行加载，适用于当前页面必需的重要资源。
      </p>
      <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#856404' }}>
        生成的 HTML: <code>&lt;link rel="preload" href="preload.chunk.js"&gt;</code>
      </p>
    </div>
  );
}

export default PreloadComponent;

/**
 * 模拟重量级组件
 *
 * 这个组件会被单独打包成一个 chunk
 * 使用 React.lazy 进行懒加载
 */
function HeavyComponent() {
  return (
    <div style={{
      marginTop: '15px',
      padding: '20px',
      background: '#d4edda',
      borderRadius: '8px',
      border: '2px solid #28a745'
    }}>
      <h4 style={{ margin: '0 0 10px', color: '#155724' }}>
        Heavy Component 已加载！
      </h4>
      <p style={{ margin: 0, color: '#155724' }}>
        这个组件被单独打包，只有在需要时才会加载。
        打开开发者工具的 Network 面板可以看到单独的 chunk 文件。
      </p>
    </div>
  );
}

export default HeavyComponent;

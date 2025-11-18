/**
 * 企业级特性示例
 *
 * 展示真实企业项目中常见的场景和解决方案
 */
import { useState, useEffect } from 'react';
// 导入 Markdown 文件（使用自定义 loader）
import markdownContent from '../assets/example.md';

function EnterpriseExamples() {
  const [activeTab, setActiveTab] = useState('mock');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      setUsers(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取产品列表
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setProducts(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 模拟登录
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: '123456' }),
      });
      const result = await response.json();
      alert(`登录成功！Token: ${result.data.token.substring(0, 20)}...`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="example-section">
      <span className="feature-tag">企业级特性</span>
      <h2>真实项目场景</h2>

      {/* 标签导航 */}
      <div className="nav" style={{ marginBottom: '20px' }}>
        <button
          className={activeTab === 'mock' ? 'active' : ''}
          onClick={() => setActiveTab('mock')}
        >
          Mock API
        </button>
        <button
          className={activeTab === 'loader' ? 'active' : ''}
          onClick={() => setActiveTab('loader')}
        >
          自定义 Loader
        </button>
        <button
          className={activeTab === 'plugin' ? 'active' : ''}
          onClick={() => setActiveTab('plugin')}
        >
          自定义 Plugin
        </button>
        <button
          className={activeTab === 'optimize' ? 'active' : ''}
          onClick={() => setActiveTab('optimize')}
        >
          性能优化
        </button>
      </div>

      {/* Mock API 示例 */}
      {activeTab === 'mock' && (
        <div>
          <h3>Mock API 示例</h3>
          <div className="tip-box">
            <strong>场景：</strong>前后端分离开发时，前端需要模拟后端 API 进行开发
          </div>

          <div className="demo-area">
            <div style={{ marginBottom: '15px' }}>
              <button className="btn btn-primary" onClick={fetchUsers}>
                获取用户列表
              </button>
              <button className="btn btn-primary" onClick={fetchProducts}>
                获取产品列表
              </button>
              <button className="btn btn-secondary" onClick={handleLogin}>
                模拟登录
              </button>
            </div>

            {loading && <div className="loading">加载中...</div>}
            {error && <div className="tip-box warning">错误: {error}</div>}

            {users.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4>用户列表:</h4>
                <ul className="item-list">
                  {users.map(user => (
                    <li key={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {products.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4>产品列表:</h4>
                <ul className="item-list">
                  {products.map(product => (
                    <li key={product.id}>
                      {product.name} - ¥{product.price} (库存: {product.stock})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h3>面试要点</h3>
          <div className="code-block">
{`// webpack.dev.js 中配置 Mock
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // 设置 Mock 路由
    devServer.app.get('/api/users', (req, res) => {
      res.json({ code: 0, data: mockData.users });
    });
    return middlewares;
  },
}`}
          </div>
        </div>
      )}

      {/* 自定义 Loader 示例 */}
      {activeTab === 'loader' && (
        <div>
          <h3>自定义 Loader 示例</h3>
          <div className="tip-box">
            <strong>场景：</strong>将 Markdown 文件转换为可在 React 中使用的 HTML
          </div>

          <div className="demo-area">
            <h4>Markdown 转 HTML 效果：</h4>
            <div
              style={{
                padding: '15px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
              dangerouslySetInnerHTML={{ __html: markdownContent }}
            />
          </div>

          <h3>Loader 编写要点</h3>
          <div className="code-block">
{`// loaders/markdown-loader.js
module.exports = function(source) {
  // 获取异步回调（异步 Loader）
  const callback = this.async();

  // 启用缓存
  this.cacheable && this.cacheable();

  // 转换逻辑
  const html = markdownToHtml(source);

  // 返回 ES 模块代码
  const code = \`export default \${JSON.stringify(html)}\`;

  callback(null, code);
};

// 【面试重点】Loader 特性：
// 1. 从右到左执行
// 2. this.async() 支持异步
// 3. this.cacheable() 启用缓存
// 4. this.getOptions() 获取配置`}
          </div>
        </div>
      )}

      {/* 自定义 Plugin 示例 */}
      {activeTab === 'plugin' && (
        <div>
          <h3>自定义 Plugin 示例</h3>
          <div className="tip-box">
            <strong>场景：</strong>生成构建信息文件，用于版本追踪和问题排查
          </div>

          <div className="demo-area">
            <p>构建完成后会生成以下文件：</p>
            <ul className="item-list">
              <li><code>build-info.json</code> - 构建信息（版本、时间、模块数等）</li>
              <li><code>assets-manifest.md</code> - 资源清单（所有输出文件列表）</li>
            </ul>
          </div>

          <h3>Plugin 编写要点</h3>
          <div className="code-block">
{`// plugins/BuildInfoPlugin.js
class BuildInfoPlugin {
  apply(compiler) {
    // 【面试重点】Webpack 钩子系统

    // emit 钩子 - 输出资源前
    compiler.hooks.emit.tapAsync(
      'BuildInfoPlugin',
      (compilation, callback) => {
        // 添加文件到输出
        compilation.assets['build-info.json'] = {
          source: () => JSON.stringify(buildInfo),
          size: () => content.length,
        };
        callback();
      }
    );

    // done 钩子 - 构建完成
    compiler.hooks.done.tap('BuildInfoPlugin', (stats) => {
      console.log('构建完成！');
    });
  }
}

// 【面试重点】常用钩子：
// - compile: 开始编译
// - compilation: compilation 创建
// - emit: 输出资源前
// - done: 构建完成`}
          </div>
        </div>
      )}

      {/* 性能优化示例 */}
      {activeTab === 'optimize' && (
        <div>
          <h3>Webpack 性能优化策略</h3>

          <h4>1. 构建速度优化</h4>
          <div className="code-block">
{`// 【面试重点】提升构建速度

// 1. 持久化缓存（Webpack 5 新特性）
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename],
  },
}

// 2. 缩小搜索范围
resolve: {
  extensions: ['.js', '.jsx'], // 只查找必要的扩展名
  alias: { '@': path.resolve(__dirname, 'src') },
}

// 3. 使用 include/exclude
{
  test: /\\.js$/,
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/,
}

// 4. 多进程构建（thread-loader）
// 5. DLL 预编译（大型项目）`}
          </div>

          <h4>2. 打包体积优化</h4>
          <div className="code-block">
{`// 【面试重点】减小打包体积

// 1. Tree Shaking
optimization: {
  usedExports: true,
  sideEffects: true,
}
// package.json: "sideEffects": false

// 2. 代码分割
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        test: /[\\\\/]node_modules[\\\\/]/,
        name: 'vendors',
      },
    },
  },
}

// 3. 压缩代码
// TerserPlugin (JS) + CssMinimizerPlugin (CSS)

// 4. 外部化依赖
externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
}`}
          </div>

          <h4>3. 运行时性能优化</h4>
          <div className="code-block">
{`// 【面试重点】运行时性能

// 1. 懒加载
const Component = lazy(() => import('./Component'));

// 2. Prefetch/Preload
import(/* webpackPrefetch: true */ './Component');
import(/* webpackPreload: true */ './Component');

// 3. 长缓存策略
output: {
  filename: '[name].[contenthash:8].js',
}

// 4. Runtime Chunk 分离
optimization: {
  runtimeChunk: 'single',
}`}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnterpriseExamples;

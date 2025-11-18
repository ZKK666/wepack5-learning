/**
 * Webpack 开发环境配置
 */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { setupMockRoutes } = require('./mock');

// 自定义插件
const BuildInfoPlugin = require('./plugins/BuildInfoPlugin');
const FileListPlugin = require('./plugins/FileListPlugin');

module.exports = merge(common, {
  /**
   * 【面试重点】mode 配置
   *
   * - development: 启用开发相关优化（不压缩、详细错误信息等）
   * - production: 启用生产相关优化（压缩、Tree Shaking 等）
   * - none: 不使用任何默认优化
   */
  mode: 'development',

  /**
   * 【面试重点】Source Map 配置
   *
   * 常见类型：
   * - eval: 最快，但只能定位到文件
   * - eval-source-map: 最详细，但最慢（开发推荐）
   * - cheap-module-source-map: 较快，可定位到行
   * - source-map: 最详细，生成独立文件（生产推荐）
   * - hidden-source-map: 同 source-map，但不关联
   * - nosources-source-map: 显示行号但不显示源码
   */
  devtool: 'eval-source-map',

  /**
   * 【面试重点】resolveLoader - 配置 Loader 解析路径
   *
   * 可以让 Webpack 从指定目录查找 Loader
   */
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },

  /**
   * 【面试重点】DevServer 配置
   */
  devServer: {
    // 静态文件目录
    static: './dist',
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 启用热模块替换（HMR）
    hot: true,
    // 启用 gzip 压缩
    compress: true,
    // 客户端日志级别
    client: {
      logging: 'info',
      // 编译错误/警告时显示覆盖层
      overlay: {
        errors: true,
        warnings: false,
      },
      // 显示编译进度
      progress: true,
    },
    // 路由 history 模式支持
    historyApiFallback: true,

    /**
     * 【面试重点】setupMiddlewares - Webpack 5 新 API
     *
     * 替代了 before/after，用于设置自定义中间件
     * 常用于：Mock API、日志记录、认证检查等
     */
    setupMiddlewares: (middlewares, devServer) => {
      // 解析 JSON 请求体
      devServer.app.use(require('express').json());

      // 设置 Mock API 路由
      setupMockRoutes(devServer.app);

      return middlewares;
    },
  },

  // CSS 处理 - 开发环境使用 style-loader（支持 HMR）
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader', // 将 CSS 注入到 DOM
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              // CSS Modules 配置
              modules: {
                auto: true, // 只对 .module.css 文件启用
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      /**
       * 【面试重点】使用自定义 Loader
       */
      {
        test: /\.md$/,
        use: [
          {
            loader: 'markdown-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    // 使用自定义插件
    new BuildInfoPlugin({
      filename: 'build-info.json',
      extra: {
        environment: 'development',
      },
    }),
    new FileListPlugin({
      filename: 'assets-manifest.md',
    }),
  ],

  optimization: {
    // 开发环境不需要压缩
    minimize: false,
  },
});

/**
 * Webpack 公共配置
 *
 * 面试高频知识点都在注释中标注
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  /**
   * 【面试重点】入口配置
   *
   * 1. 单入口：entry: './src/index.js'
   * 2. 多入口：entry: { main: './src/index.js', vendor: './src/vendor.js' }
   * 3. 动态入口：entry: () => './src/index.js'
   */
  entry: {
    main: './src/index.js',
  },

  /**
   * 【面试重点】输出配置
   *
   * 1. filename - 输出文件名，支持占位符 [name] [hash] [chunkhash] [contenthash]
   * 2. path - 输出目录，必须是绝对路径
   * 3. clean - Webpack 5 新特性，自动清理输出目录
   * 4. publicPath - 资源访问路径前缀
   *
   * 【面试重点】Hash 类型区别：
   * - [hash]: 整个项目构建的 hash，任何文件变化都会改变
   * - [chunkhash]: 入口 chunk 的 hash，同一入口的文件共享
   * - [contenthash]: 文件内容的 hash，只有内容变化才改变（推荐用于缓存）
   */
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Webpack 5 内置，替代 clean-webpack-plugin
    publicPath: '/',
    // 资源模块输出配置
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
  },

  /**
   * 【面试重点】模块解析配置
   */
  resolve: {
    // 自动解析的扩展名
    extensions: ['.js', '.jsx', '.json'],
    // 路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },

  /**
   * 【面试重点】模块规则配置 - Loader
   *
   * Loader 执行顺序：从右到左，从下到上
   *
   * Webpack 5 新特性 - Asset Modules（资源模块）：
   * - asset/resource: 发送单独文件并导出 URL（替代 file-loader）
   * - asset/inline: 导出 data URI（替代 url-loader）
   * - asset/source: 导出源代码（替代 raw-loader）
   * - asset: 自动选择导出方式（替代 url-loader 的 limit 功能）
   */
  module: {
    rules: [
      // JavaScript/JSX 处理
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // 开启缓存，提升构建速度
            cacheDirectory: true,
          },
        },
      },

      // 图片资源处理 - Webpack 5 Asset Modules
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8KB 以下转 base64
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },

      // SVG 资源
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name].[hash:8][ext]',
        },
      },

      // 字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
    ],
  },

  /**
   * 【面试重点】插件配置
   *
   * Loader vs Plugin 区别：
   * - Loader: 转换特定类型的模块（文件级别）
   * - Plugin: 执行更广泛的任务，如打包优化、资源管理、环境变量注入等
   */
  plugins: [
    // 生成 HTML 文件并自动注入打包后的资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Webpack 5 + React 18 学习项目',
      // 压缩 HTML
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
  ],

  /**
   * 【面试重点】代码分割配置
   *
   * Webpack 5 默认配置已经很好，但了解配置项很重要
   */
  optimization: {
    // 模块 ID 使用确定性算法生成（Webpack 5 默认）
    moduleIds: 'deterministic',
    // Chunk ID 使用确定性算法
    chunkIds: 'deterministic',

    /**
     * 【面试重点】SplitChunks 代码分割
     *
     * 作用：将代码分割成多个 bundle，实现按需加载和并行加载
     */
    splitChunks: {
      chunks: 'all', // 对所有类型的 chunk 进行分割
      cacheGroups: {
        // 第三方库单独打包
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // React 相关库单独打包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        // 公共模块
        common: {
          name: 'common',
          minChunks: 2, // 被引用2次以上才提取
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },

    /**
     * 【面试重点】Runtime Chunk
     *
     * 将 webpack 运行时代码单独提取，避免影响业务代码的缓存
     */
    runtimeChunk: {
      name: 'runtime',
    },
  },

  /**
   * 【面试重点】缓存配置 - Webpack 5 新特性
   *
   * 持久化缓存大幅提升二次构建速度
   */
  cache: {
    type: 'filesystem', // 使用文件系统缓存
    buildDependencies: {
      config: [__filename], // 配置文件变化时使缓存失效
    },
  },
};

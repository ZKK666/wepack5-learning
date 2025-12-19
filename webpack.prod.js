/**
 * Webpack 生产环境配置
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
  const plugins = [
    /**
     * 【面试重点】MiniCssExtractPlugin
     *
     * 将 CSS 提取到单独文件，支持 CSS 文件的按需加载和缓存
     * 生产环境推荐使用，开发环境使用 style-loader（支持 HMR）
     */
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
  ];

  // 打包分析
  if (env && env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return merge(common, {
    mode: 'production',

    // 生产环境 Source Map
    devtool: 'source-map',

    // CSS 处理 - 生产环境提取到单独文件
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader, // 提取 CSS 到单独文件
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[hash:base64:8]',
                },
              },
            },
          ],
        },
      ],
    },

    plugins,

    /**
     * 【面试重点】生产环境优化配置
     */
    optimization: {
      minimize: true,
      minimizer: [
        /**
         * TerserPlugin - JS 压缩
         *
         * Webpack 5 默认使用，但可以自定义配置
         */
        new TerserPlugin({
          parallel: true, // 多进程并行压缩
          terserOptions: {
            compress: {
              drop_console: true, // 移除 console
              drop_debugger: true, // 移除 debugger
              pure_funcs: ['console.log'], // 移除指定函数
            },
            format: {
              comments: false, // 移除注释
            },
          },
          extractComments: false, // 不提取注释到单独文件
        }),

        /**
         * CssMinimizerPlugin - CSS 压缩
         */
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],

      /**
       * 【面试重点】Tree Shaking
       *
       * 移除未使用的代码，减小打包体积
       * 前提条件：
       * 1. 使用 ES6 模块语法（import/export）
       * 2. package.json 中设置 "sideEffects": false 缺少这个表示让树摇效果打折
       * 3. mode: 'production'
       *
       * usedExports: 标记未使用的导出
       * sideEffects: 跳过整个模块/文件
       */
      usedExports: true,
      sideEffects: true,
    },

    /**
     * 【面试重点】性能提示配置
     */
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000, // 入口文件最大体积 500KB
      maxAssetSize: 512000, // 单个资源最大体积 500KB
    },
  });
};

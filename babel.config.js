/**
 * Babel 配置
 *
 * 面试知识点：
 * 1. @babel/preset-env - 根据目标环境自动确定需要的转换
 * 2. @babel/preset-react - 转换 JSX 语法
 * 3. runtime: 'automatic' - React 17+ 新的 JSX 转换，无需手动 import React
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 按需加载 polyfill
        useBuiltIns: 'usage',
        corejs: 3,
        // 指定目标浏览器
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        }
      }
    ],
    [
      '@babel/preset-react',
      {
        // React 17+ 新的 JSX 转换
        runtime: 'automatic'
      }
    ]
  ]
};

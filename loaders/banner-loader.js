/**
 * 自定义 Loader 示例：Banner Loader
 *
 * 【面试重点】Loader 的本质和编写规范
 *
 * Loader 是什么？
 * - 一个导出函数的 JavaScript 模块
 * - 接收源文件内容，返回转换后的内容
 * - 可以是同步或异步的
 *
 * Loader 执行顺序：
 * - 从右到左，从下到上（pitch 阶段除外）
 *
 * Loader 类型：
 * - 同步 Loader：直接 return 或使用 this.callback
 * - 异步 Loader：使用 this.async()
 *
 * 功能：在文件头部添加版权信息
 */

// 引入 loader-utils 获取 options（Webpack 5 也可以用 this.getOptions()）
// const { getOptions } = require('loader-utils');

/**
 * @param {string} source - 源文件内容
 * @returns {string} - 转换后的内容
 */
module.exports = function bannerLoader(source) {
  // 【面试重点】获取 loader 配置选项
  // Webpack 5 推荐使用 this.getOptions()
  const options = this.getOptions() || {};

  const {
    author = 'Your Company',
    version = '1.0.0',
    date = new Date().toISOString().split('T')[0]
  } = options;

  // 生成 banner 注释
  const banner = `/**
 * @author ${author}
 * @version ${version}
 * @date ${date}
 * @description This file is auto-generated, do not edit manually.
 */

`;

  // 【面试重点】返回转换后的内容
  // 同步 loader 可以直接 return
  return banner + source;
};

/**
 * 【面试重点】Loader 的 raw 属性
 *
 * 默认情况下，Loader 接收 UTF-8 编码的字符串
 * 设置 raw = true 时，Loader 接收原始 Buffer
 * 适用于处理图片、字体等二进制文件
 */
// module.exports.raw = true;

/**
 * 【面试重点】Loader 的 pitch 方法
 *
 * pitch 方法在 loader 链从左到右执行
 * 如果 pitch 返回值，则跳过剩余 loader
 *
 * 执行顺序示例（loader1, loader2, loader3）：
 * pitch1 -> pitch2 -> pitch3 -> loader3 -> loader2 -> loader1
 */
// module.exports.pitch = function(remainingRequest, precedingRequest, data) {
//   // 可以在这里做一些准备工作
//   data.value = 'shared data';
// };

/**
 * 自定义 Loader 示例：Markdown Loader
 *
 * 【面试重点】异步 Loader 的编写
 *
 * 功能：将 Markdown 文件转换为 React 组件
 */

/**
 * @param {string} source - Markdown 源文件内容
 */
module.exports = function markdownLoader(source) {
  // 【面试重点】获取异步回调
  // 调用 this.async() 后，Loader 变成异步模式
  const callback = this.async();

  // 【面试重点】启用缓存
  // Webpack 会缓存 Loader 的处理结果
  // 当文件或依赖没有变化时，直接使用缓存
  this.cacheable && this.cacheable();

  try {
    // 简单的 Markdown 转 HTML 实现
    // 真实项目中可以使用 marked、markdown-it 等库
    const html = simpleMarkdownToHtml(source);

    // 【面试重点】导出为 ES 模块
    // Loader 可以返回 JavaScript 代码字符串
    const code = `
      export default ${JSON.stringify(html)};
      export const raw = ${JSON.stringify(source)};
    `;

    // 异步返回结果
    // callback(error, content, sourceMap, meta)
    callback(null, code);
  } catch (error) {
    // 【面试重点】错误处理
    callback(error);
  }
};

/**
 * 简单的 Markdown 转 HTML 函数
 */
function simpleMarkdownToHtml(markdown) {
  return markdown
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // 代码块
    .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // 列表
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // 段落
    .replace(/\n\n/gim, '</p><p>')
    // 换行
    .replace(/\n/gim, '<br>');
}

/**
 * 【面试重点】Loader Schema 验证
 *
 * 可以使用 schema-utils 验证 options
 *
 * const { validate } = require('schema-utils');
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     option1: { type: 'boolean' }
 *   }
 * };
 * validate(schema, options, { name: 'Markdown Loader' });
 */

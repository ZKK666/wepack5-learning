/**
 * 自定义 Loader 示例：Style Inject Loader
 *
 * 【面试重点】Loader 链式调用和 this.callback
 *
 * 功能：在 CSS 中注入全局变量
 * 常用于：主题色注入、响应式断点变量等
 */

module.exports = function styleInjectLoader(source) {
  const options = this.getOptions() || {};

  // 默认注入的 CSS 变量
  const defaultVariables = {
    '--primary-color': '#667eea',
    '--secondary-color': '#764ba2',
    '--font-size-base': '14px',
    '--border-radius': '8px',
    '--spacing-unit': '8px',
  };

  const variables = { ...defaultVariables, ...options.variables };

  // 生成 CSS 变量声明
  const cssVariables = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  const injection = `:root {\n${cssVariables}\n}\n\n`;

  // 【面试重点】使用 this.callback 返回多个值
  // this.callback(err, content, sourceMap, meta)
  // - err: 错误信息
  // - content: 转换后的内容
  // - sourceMap: source map（可选）
  // - meta: 元数据，传递给下一个 loader（可选）
  this.callback(null, injection + source);

  // 当使用 callback 时，必须返回 undefined
  return;
};

/**
 * 【面试重点】Loader Context 常用属性
 *
 * this.context - 模块所在目录
 * this.resource - 请求的资源路径
 * this.resourcePath - 资源的绝对路径
 * this.resourceQuery - 资源的 query 参数
 * this.target - 编译目标（web、node 等）
 * this.webpack - 是否由 webpack 编译
 * this.sourceMap - 是否生成 source map
 * this.emitFile - 输出文件
 * this.addDependency - 添加文件依赖
 * this.addContextDependency - 添加目录依赖
 * this.clearDependencies - 清除依赖
 * this.getDependencies - 获取依赖
 */

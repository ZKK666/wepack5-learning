/**
 * 数学工具函数
 *
 * 这个模块用于演示动态导入
 * Webpack 会将其打包成单独的 chunk
 *
 * 【Webpack 知识点】Tree Shaking
 * 如果只使用了 add 函数，multiply 函数会被 Tree Shaking 移除
 */

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// 默认导出
export default {
  add,
  subtract,
  multiply,
  divide
};

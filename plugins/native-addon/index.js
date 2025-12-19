/**
 * Native Addon 入口文件
 */
try {
  // 尝试加载编译好的二进制文件
  module.exports = require('./build/Release/console_cleaner.node');
} catch (err) {
  console.error('Failed to load native addon:', err.message);
  console.error('Please run: cd plugins/native-addon && npm install');

  // 降级到 JavaScript 实现
  module.exports = {
    removeConsole: (source, methods) => {
      let result = source;
      methods.forEach(method => {
        const regex = new RegExp(
          `console\\.${method}\\s*\\([^)]*\\)\\s*;?`,
          'g'
        );
        result = result.replace(regex, '');
      });
      return result;
    }
  };
}

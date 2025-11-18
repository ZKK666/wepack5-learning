/**
 * 自定义 Plugin 示例：Console Clean Plugin
 *
 * 【面试重点】使用 compilation hooks 修改代码
 *
 * 功能：在生产环境移除 console.log（演示用，实际推荐用 TerserPlugin）
 */

class ConsoleCleanPlugin {
  constructor(options = {}) {
    this.options = {
      // 要移除的 console 方法
      remove: ['log', 'info', 'debug'],
      // 是否保留 console.error 和 console.warn
      keepErrors: true,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'ConsoleCleanPlugin';

    // 只在生产环境执行
    if (compiler.options.mode !== 'production') {
      return;
    }

    /**
     * 【面试重点】processAssets 钩子（Webpack 5 新增）
     *
     * Webpack 5 引入了 processAssets 钩子来处理资源
     * 替代了之前在 emit 中直接修改 assets 的方式
     *
     * 执行阶段（stage）：
     * - PROCESS_ASSETS_STAGE_ADDITIONAL: 添加额外资源
     * - PROCESS_ASSETS_STAGE_PRE_PROCESS: 预处理
     * - PROCESS_ASSETS_STAGE_OPTIMIZE: 优化
     * - PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE: 体积优化
     * - PROCESS_ASSETS_STAGE_SUMMARIZE: 汇总
     */
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          // 在优化阶段执行
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          // 遍历所有 JS 资源
          Object.keys(assets).forEach((filename) => {
            if (!filename.endsWith('.js')) return;

            const asset = assets[filename];
            let source = asset.source();

            // 移除指定的 console 方法
            this.options.remove.forEach((method) => {
              // 简单的正则替换（实际应使用 AST）
              const regex = new RegExp(
                `console\\.${method}\\s*\\([^)]*\\)\\s*;?`,
                'g'
              );
              source = source.replace(regex, '');
            });

            // 【面试重点】更新资源
            compilation.updateAsset(filename, {
              source: () => source,
              size: () => source.length,
            });
          });
        }
      );
    });
  }
}

module.exports = ConsoleCleanPlugin;

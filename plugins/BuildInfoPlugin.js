/**
 * 自定义 Plugin 示例：Build Info Plugin
 *
 * 【面试重点】Plugin 的本质和编写规范
 *
 * Plugin 是什么？
 * - 一个具有 apply 方法的 JavaScript 对象
 * - 通过钩子（hooks）介入 Webpack 构建流程
 * - 可以访问 compiler 和 compilation 对象
 *
 * Plugin vs Loader：
 * - Loader：转换特定类型文件，在模块级别工作
 * - Plugin：扩展 Webpack 功能，可以访问整个构建流程
 *
 * 功能：生成构建信息文件（版本、时间、Git 信息等）
 */

class BuildInfoPlugin {
  constructor(options = {}) {
    // 【面试重点】插件配置
    this.options = {
      filename: 'build-info.json',
      ...options
    };
  }

  /**
   * 【面试重点】apply 方法
   *
   * Webpack 会调用插件的 apply 方法，传入 compiler 对象
   * compiler 包含了 Webpack 的所有配置信息和构建方法
   */
  apply(compiler) {
    const pluginName = 'BuildInfoPlugin';

    /**
     * 【面试重点】Webpack Hooks 系统
     *
     * Webpack 5 使用 tapable 库实现钩子系统
     *
     * 钩子类型：
     * - SyncHook: 同步钩子
     * - SyncBailHook: 同步熔断钩子（返回非 undefined 停止）
     * - SyncWaterfallHook: 同步瀑布钩子（上一个返回值传给下一个）
     * - AsyncSeriesHook: 异步串行钩子
     * - AsyncParallelHook: 异步并行钩子
     *
     * 注册方式：
     * - tap: 同步注册
     * - tapAsync: 异步注册（callback）
     * - tapPromise: 异步注册（Promise）
     */

    /**
     * 【面试重点】使用 processAssets 钩子（Webpack 5 推荐方式）
     */
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          const buildInfo = {
            // 构建时间
            buildTime: new Date().toISOString(),
            // Webpack 版本
            webpackVersion: compiler.webpack.version,
            // 构建模式
            mode: compiler.options.mode,
            // 入口信息
            entry: Object.keys(compiler.options.entry),
            // 输出信息
            output: {
              path: compiler.options.output.path,
              publicPath: compiler.options.output.publicPath,
            },
            // 模块数量
            modulesCount: compilation.modules.size,
            // Chunk 数量
            chunksCount: compilation.chunks.size,
            // 资源数量
            assetsCount: Object.keys(assets).length,
            // 环境变量
            nodeEnv: process.env.NODE_ENV || 'development',
            // 自定义信息
            ...this.options.extra,
          };

          // 【Webpack 5 推荐】使用 emitAsset 添加文件
          const content = JSON.stringify(buildInfo, null, 2);

          // 检查资源是否已存在，避免冲突
          if (compilation.getAsset(this.options.filename)) {
            compilation.updateAsset(
              this.options.filename,
              new compiler.webpack.sources.RawSource(content)
            );
          } else {
            compilation.emitAsset(
              this.options.filename,
              new compiler.webpack.sources.RawSource(content)
            );
          }
        }
      );
    });

    // 【面试重点】done 钩子 - 构建完成后
    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log('\n📦 Build Info Plugin:');
      console.log(`   - Build time: ${stats.endTime - stats.startTime}ms`);
      console.log(`   - Generated: ${this.options.filename}\n`);
    });
  }
}

module.exports = BuildInfoPlugin;

/**
 * 【面试重点】常用 Compiler Hooks
 *
 * - environment: 环境准备好之后
 * - afterEnvironment: 环境设置完成后
 * - entryOption: 处理 entry 配置后
 * - afterPlugins: 插件初始化完成后
 * - afterResolvers: resolver 设置完成后
 * - beforeRun: 开始构建前
 * - run: 开始构建
 * - watchRun: 监听模式构建开始
 * - compile: 创建 compilation 之前
 * - thisCompilation: 初始化 compilation
 * - compilation: compilation 创建完成
 * - make: 从 entry 开始构建模块
 * - afterCompile: 构建完成
 * - emit: 输出资源前
 * - afterEmit: 输出资源后
 * - done: 构建完成
 * - failed: 构建失败
 */

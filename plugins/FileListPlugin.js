/**
 * 自定义 Plugin 示例：File List Plugin
 *
 * 【面试重点】遍历 compilation 获取构建信息
 *
 * 功能：生成构建资源清单
 */

class FileListPlugin {
  constructor(options = {}) {
    this.options = {
      filename: 'file-list.md',
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'FileListPlugin';

    /**
     * 【面试重点】使用 processAssets 钩子（Webpack 5 推荐方式）
     *
     * 替代直接修改 compilation.assets，避免废弃警告
     */
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          // 生成文件列表
          let content = '# 构建资源清单\n\n';
          content += `生成时间: ${new Date().toLocaleString()}\n\n`;

          // 【面试重点】遍历 chunks
          content += '## Chunks\n\n';
          compilation.chunks.forEach((chunk) => {
            content += `### ${chunk.name || chunk.id}\n`;
            content += `- ID: ${chunk.id}\n`;
            content += `- Files: ${[...chunk.files].join(', ')}\n`;
            content += `- Entry: ${chunk.hasRuntime()}\n\n`;
          });

          // 【面试重点】遍历 assets
          content += '## Assets\n\n';
          content += '| 文件名 | 大小 |\n';
          content += '|--------|------|\n';

          const assetList = compilation.getAssets();
          assetList
            .sort((a, b) => b.source.size() - a.source.size())
            .forEach(({ name, source }) => {
              const size = this.formatSize(source.size());
              content += `| ${name} | ${size} |\n`;
            });

          // 【面试重点】遍历 modules
          content += '\n## Modules 统计\n\n';
          const moduleStats = {
            total: compilation.modules.size,
            nodeModules: 0,
            source: 0,
          };

          compilation.modules.forEach((module) => {
            if (module.resource) {
              if (module.resource.includes('node_modules')) {
                moduleStats.nodeModules++;
              } else {
                moduleStats.source++;
              }
            }
          });

          content += `- 总模块数: ${moduleStats.total}\n`;
          content += `- node_modules: ${moduleStats.nodeModules}\n`;
          content += `- 源代码模块: ${moduleStats.source}\n`;

          // 【Webpack 5 推荐】使用 emitAsset 添加资源
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
  }

  formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

module.exports = FileListPlugin;

/**
 * 【面试重点】Compilation 对象常用属性
 *
 * - modules: 所有模块
 * - chunks: 所有 chunk
 * - assets: 所有输出资源
 * - entries: 入口模块
 * - errors: 构建错误
 * - warnings: 构建警告
 * - fileDependencies: 文件依赖
 * - contextDependencies: 目录依赖
 *
 * 常用方法：
 * - getAssets(): 获取所有资源
 * - updateAsset(): 更新资源
 * - deleteAsset(): 删除资源
 * - emitAsset(): 输出资源
 */

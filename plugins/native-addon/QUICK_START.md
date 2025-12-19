# 快速开始：5 分钟发布你的第一个 Native NPM 包

## 🎯 目标

将这个 C++ Native Addon 发布到 npm，让全世界的开发者都能使用。

## ⚡ 3 步完成发布

### 1️⃣ 修改包信息（2 分钟）

编辑 [package.json](package.json)，修改这 3 处：

```json
{
  "name": "@yourname/console-cleaner-native",    // ← 改成你的 npm 用户名
  "author": "Your Name <email@example.com>",     // ← 改成你的信息
  "repository": {
    "url": "https://github.com/yourname/xxx.git" // ← 改成你的仓库
  }
}
```

### 2️⃣ 登录 npm（1 分钟）

```bash
# 如果还没注册，先注册：https://www.npmjs.com/signup
npm login
```

### 3️⃣ 发布（1 分钟）

```bash
cd plugins/native-addon
npm publish --access public
```

✅ **完成！** 你的包现在可以通过 `npm install @yourname/console-cleaner-native` 安装了。

## 📦 使用你发布的包

### 在其他项目中安装

```bash
npm install @yourname/console-cleaner-native
```

### 简单使用

```javascript
const { removeConsole } = require('@yourname/console-cleaner-native');

const code = `
  console.log('这行会被移除');
  const result = 42;
  console.info('这行也会被移除');
`;

const cleaned = removeConsole(code, ['log', 'info']);
console.log(cleaned);
// 输出: "const result = 42;"
```

### 在 Webpack 中使用

```javascript
// webpack.config.js
const { removeConsole } = require('@yourname/console-cleaner-native');

class ConsoleCleanPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('ConsoleCleanPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ConsoleCleanPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            if (filename.endsWith('.js')) {
              const source = assets[filename].source();
              const cleaned = removeConsole(source, ['log', 'info', 'debug']);

              compilation.updateAsset(filename, {
                source: () => cleaned,
                size: () => cleaned.length,
              });
            }
          });
        }
      );
    });
  }
}

module.exports = {
  plugins: [new ConsoleCleanPlugin()]
};
```

## 🔄 发布新版本

```bash
# 修复 bug
npm version patch   # 1.0.0 → 1.0.1

# 新功能
npm version minor   # 1.0.0 → 1.1.0

# 破坏性变更
npm version major   # 1.0.0 → 2.0.0

# 发布
npm publish --access public
```

## 💡 关键概念

### 为什么用 `@yourname/` 前缀？

这叫 **scoped package**（作用域包）：

```
@yourname/console-cleaner-native
^         ^
作用域      包名
```

**优势：**
- 避免包名冲突（npm 上已有几百万个包）
- 明确所有权
- 可以组织相关的包

### 编译策略：用户编译 vs 预编译

**当前方案**（用户编译）：
```
npm install → 触发 node-gyp rebuild → 在用户机器上编译
```

- ✅ 包体积小
- ✅ 自动适配用户平台
- ❌ 需要编译工具（已提供 fallback）

**预编译方案**（未来可选）：
```
发布前 → 为各平台编译 → 上传二进制 → 用户下载对应版本
```

- ✅ 用户无需编译工具
- ✅ 安装快速
- ❌ 包体积大
- ❌ 需要 CI/CD 支持多平台

## 🚨 常见错误

### ❌ 错误 1: 包名已存在

```
npm ERR! 403 You do not have permission to publish "@npm/console-cleaner-native"
```

**解决：** 改用你自己的用户名
```json
"name": "@yourname/console-cleaner-native"  // 改这里
```

### ❌ 错误 2: 未登录

```
npm ERR! need auth This command requires you to be logged in.
```

**解决：**
```bash
npm login
```

### ❌ 错误 3: 用户安装时编译失败

这是 **正常的**！我们已经提供了 JavaScript fallback。

用户会看到：
```
⚠ Native addon not available, using JavaScript fallback
```

包依然能正常工作，只是稍慢一点。

## 📊 查看你的包

发布成功后，访问：
```
https://www.npmjs.com/package/@yourname/console-cleaner-native
```

你会看到：
- 📈 下载统计
- 📖 README 文档
- 📦 版本历史
- 🔗 GitHub 链接

## 🎓 进阶学习

详细内容请查看：
- [NPM_PUBLISH_GUIDE.md](NPM_PUBLISH_GUIDE.md) - 完整发布指南
- [README.md](README.md) - 技术文档
- [../NATIVE_ADDON_GUIDE.md](../NATIVE_ADDON_GUIDE.md) - Native Addon 详解

## ✨ 祝贺

你现在已经是 npm 包作者了！🎉

分享你的包：
- 在 README 中添加 npm badge
- 在 Twitter/微博上宣传
- 写博客介绍你的包
- 在相关项目的 issue 中推荐

## 📝 下一步

1. [ ] 添加单元测试
2. [ ] 设置 GitHub Actions CI/CD
3. [ ] 编写详细文档
4. [ ] 收集用户反馈
5. [ ] 持续改进性能

## 🤝 获取帮助

- NPM 文档: https://docs.npmjs.com/
- Node.js Addon 文档: https://nodejs.org/api/addons.html
- 提 Issue: https://github.com/yourname/console-cleaner-native/issues

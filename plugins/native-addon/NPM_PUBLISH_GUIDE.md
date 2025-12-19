# NPM 包发布完整指南

## 📦 为什么封装成 NPM 包？

### ✅ 优势

1. **通用性**
   - 任何项目都可以通过 `npm install` 使用
   - 统一的版本管理和依赖处理

2. **易维护**
   - 集中管理代码
   - 统一更新和 bug 修复
   - 自动化测试和发布

3. **专业性**
   - 规范的目录结构
   - TypeScript 类型定义
   - 完善的文档

4. **可发现性**
   - npmjs.com 上可搜索
   - 方便其他开发者使用

## 🚀 发布前准备

### 1. 目录结构

```
console-cleaner-native/
├── index.js              # 入口文件
├── index.d.ts            # TypeScript 类型定义
├── package.json          # 包配置
├── binding.gyp           # 编译配置
├── console_cleaner.cc    # C++ 源码
├── LICENSE               # 开源协议
├── README.md             # 说明文档
├── .npmignore           # npm 发布忽略文件
├── scripts/
│   └── build-conditional.js  # 条件编译脚本
├── test-performance.js  # 性能测试（开发用）
└── .github/
    └── workflows/
        └── build-and-test.yml  # CI/CD 配置
```

### 2. 修改 package.json 关键字段

```json
{
  "name": "@yourname/console-cleaner-native",  // ← 改成你的名字
  "version": "1.0.0",
  "description": "High-performance console cleaning using native C++ addon",
  "author": "Your Name <your.email@example.com>",  // ← 改成你的信息
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/console-cleaner-native.git"  // ← 改成你的仓库
  }
}
```

### 3. 选择开源协议

已创建 MIT License（最宽松的协议）

其他选择：
- **Apache 2.0**: 企业友好，有专利保护
- **GPL**: 要求衍生作品也开源
- **BSD**: 类似 MIT，但有更多免责声明

## 📝 发布步骤

### 第一步：注册 npm 账号

```bash
# 访问 https://www.npmjs.com/ 注册账号

# 或使用命令行
npm adduser
```

### 第二步：登录 npm

```bash
npm login
```

输入：
- Username
- Password
- Email
- 2FA Code (如果启用了双因素认证)

### 第三步：检查包名是否可用

```bash
npm search @yourname/console-cleaner-native
```

如果找不到，说明名称可用！

### 第四步：本地测试

```bash
# 1. 清理旧的 build
npm run clean

# 2. 重新编译
npm run build

# 3. 运行测试
npm test

# 4. 测试安装（在其他目录）
cd /tmp
npm pack /path/to/console-cleaner-native
npm install ./console-cleaner-native-1.0.0.tgz
```

### 第五步：发布到 npm

```bash
# 发布公开包（推荐 scoped package）
npm publish --access public

# 或发布私有包（需要付费）
npm publish
```

### 第六步：验证发布

访问：`https://www.npmjs.com/package/@yourname/console-cleaner-native`

## 🎯 使用你的 NPM 包

### 安装

```bash
npm install @yourname/console-cleaner-native
```

### 使用示例

#### 1. 直接调用 API

```javascript
const { removeConsole } = require('@yourname/console-cleaner-native');

const source = `
  console.log('test');
  const result = 42;
`;

const cleaned = removeConsole(source, ['log']);
console.log(cleaned); // "const result = 42;"
```

#### 2. 在 Webpack Plugin 中使用

```javascript
// webpack.config.js
const { removeConsole } = require('@yourname/console-cleaner-native');

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'MyPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            if (!filename.endsWith('.js')) return;

            const source = assets[filename].source();
            const cleaned = removeConsole(source, ['log', 'info']);

            compilation.updateAsset(filename, {
              source: () => cleaned,
              size: () => cleaned.length,
            });
          });
        }
      );
    });
  }
}
```

#### 3. TypeScript 项目

```typescript
import { removeConsole, ConsoleCleanOptions } from '@yourname/console-cleaner-native';

const options: ConsoleCleanOptions = {
  remove: ['log', 'info'],
  keepErrors: true
};

const cleaned = removeConsole(sourceCode, options.remove);
```

## 🔄 版本管理

### 语义化版本（Semver）

格式：`MAJOR.MINOR.PATCH`

- **MAJOR**: 不兼容的 API 变更（1.0.0 → 2.0.0）
- **MINOR**: 向后兼容的新功能（1.0.0 → 1.1.0）
- **PATCH**: 向后兼容的 bug 修复（1.0.0 → 1.0.1）

### 发布新版本

```bash
# 1. 修改代码

# 2. 更新版本号
npm version patch   # 1.0.0 → 1.0.1 (bug fix)
npm version minor   # 1.0.0 → 1.1.0 (new feature)
npm version major   # 1.0.0 → 2.0.0 (breaking change)

# 3. 自动 git commit 和 tag
git push && git push --tags

# 4. 发布
npm publish --access public
```

## 🤝 多平台支持策略

### 方案 1：用户自行编译（当前方案）

**优点：**
- 包体积小（不包含二进制）
- 自动适配用户平台

**缺点：**
- 用户需要安装编译工具
- 安装时间较长

**实现：**
```json
{
  "scripts": {
    "install": "node-gyp rebuild"
  }
}
```

### 方案 2：预编译二进制（推荐）

使用 `prebuild` 或 `node-pre-gyp`

**优点：**
- 用户无需编译工具
- 安装快速

**缺点：**
- 包体积大
- 需要为每个平台编译

**实现：**

```bash
npm install --save-dev @mapbox/node-pre-gyp
```

```json
{
  "binary": {
    "module_name": "console_cleaner",
    "module_path": "./lib/binding/{platform}-{arch}",
    "host": "https://github.com/yourname/console-cleaner-native/releases/download/"
  }
}
```

### 方案 3：Fallback 策略（最稳健）

**实现：** 已在 [index.js](index.js) 中实现

```javascript
try {
  module.exports = require('./build/Release/console_cleaner.node');
} catch (err) {
  // 降级到 JavaScript 实现
  module.exports = { /* JS fallback */ };
}
```

## 🔧 CI/CD 自动化

### GitHub Actions 配置

已创建：[.github/workflows/build-and-test.yml](.github/workflows/build-and-test.yml)

**功能：**
1. 多平台测试（Linux, macOS, Windows）
2. 多 Node.js 版本测试（14, 16, 18, 20）
3. 自动发布到 npm（打 tag 时）

### 设置 npm token

```bash
# 1. 生成 token
# 访问 https://www.npmjs.com/settings/YOUR_USERNAME/tokens
# 创建 "Automation" 类型的 token

# 2. 添加到 GitHub Secrets
# 访问 https://github.com/yourname/console-cleaner-native/settings/secrets
# 添加名为 NPM_TOKEN 的 secret
```

### 自动发布流程

```bash
# 1. 提交代码
git commit -am "feat: add new feature"

# 2. 更新版本并打 tag
npm version minor
git push && git push --tags

# 3. GitHub Actions 自动：
#    - 运行测试
#    - 编译多平台
#    - 发布到 npm
```

## 📊 包的流行度指标

发布后，关注这些指标：

1. **下载量**: npmjs.com 上显示
2. **GitHub Stars**: 反映受欢迎程度
3. **Issues**: 用户反馈和 bug 报告
4. **依赖数**: 有多少项目在使用

## 🎓 最佳实践

### 1. 文档完善

- README 要清晰（安装、使用、示例）
- API 文档详细
- 提供 TypeScript 类型定义

### 2. 测试覆盖

```bash
npm install --save-dev jest
```

```javascript
// test/index.test.js
const { removeConsole } = require('../index');

test('should remove console.log', () => {
  const source = 'console.log("test");';
  const result = removeConsole(source, ['log']);
  expect(result).not.toContain('console.log');
});
```

### 3. 版本兼容

- 遵循语义化版本
- CHANGELOG.md 记录变更
- 不要随意改变 API

### 4. 安全性

```bash
# 定期检查安全漏洞
npm audit

# 自动修复
npm audit fix
```

### 5. 性能监控

在 README 中展示性能对比：

```markdown
## Performance

| Method | 1MB Code | 10MB Code |
|--------|----------|-----------|
| JavaScript | 100ms | 1000ms |
| Native C++ | 15ms | 150ms |
| **Speedup** | **6.7x** | **6.7x** |
```

## 📋 发布前检查清单

- [ ] `package.json` 信息完整
- [ ] README.md 文档清晰
- [ ] LICENSE 文件存在
- [ ] TypeScript 类型定义（.d.ts）
- [ ] 本地测试通过
- [ ] 代码已提交到 Git
- [ ] npm 账号已登录
- [ ] 包名可用且合适
- [ ] .npmignore 配置正确
- [ ] 版本号符合语义化

## 🚨 常见问题

### Q1: 发布失败 "You do not have permission to publish"

**原因：** 包名已被占用或无权限

**解决：**
```bash
# 使用 scoped package
npm init --scope=@yourname
```

### Q2: 用户安装时编译失败

**原因：** 用户没有编译工具

**解决：**
- 使用 fallback 策略（已实现）
- 提供预编译二进制

### Q3: 多平台兼容问题

**原因：** 不同系统编译器行为不同

**解决：**
- 使用 CI/CD 多平台测试
- 使用标准 C++ 特性

### Q4: 包体积太大

**原因：** 包含了不必要的文件

**解决：**
```bash
# 检查哪些文件会被发布
npm pack --dry-run

# 在 .npmignore 中排除
```

## 🎯 进阶：发布到多个源

### 1. 发布到 GitHub Packages

```bash
npm config set @yourname:registry https://npm.pkg.github.com
npm publish
```

### 2. 发布到私有 npm 源

```bash
npm publish --registry=https://your-private-registry.com
```

### 3. 同时发布到多个源

使用 `np` 工具：

```bash
npm install -g np
np
```

## 📚 参考资源

- [npm 官方文档](https://docs.npmjs.com/)
- [语义化版本规范](https://semver.org/)
- [node-gyp 文档](https://github.com/nodejs/node-gyp)
- [N-API 文档](https://nodejs.org/api/n-api.html)
- [如何发布 npm 包](https://zellwk.com/blog/publish-to-npm/)

## 🎉 恭喜

完成上述步骤后，你就有了一个专业的、可复用的 npm 包！

其他开发者可以通过：
```bash
npm install @yourname/console-cleaner-native
```
来使用你的工作成果。

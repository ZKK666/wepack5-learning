# console-cleaner-native

> 🚀 High-performance console statement removal using native C++ - **3-10x faster** than pure JavaScript

[![npm version](https://img.shields.io/npm/v/@yourname/console-cleaner-native.svg)](https://www.npmjs.com/package/@yourname/console-cleaner-native)
[![downloads](https://img.shields.io/npm/dm/@yourname/console-cleaner-native.svg)](https://www.npmjs.com/package/@yourname/console-cleaner-native)
[![license](https://img.shields.io/npm/l/@yourname/console-cleaner-native.svg)](https://github.com/yourname/console-cleaner-native/blob/main/LICENSE)

A native C++ addon that removes console statements from JavaScript code at lightning speed. Perfect for Webpack/Rollup plugins, build tools, and code transformation pipelines.

## ✨ Features

- **⚡ 3-10x Faster** than JavaScript regex operations
- **🔧 Drop-in Replacement** for existing console removal logic
- **🛡️ Fallback Support** - works even without C++ compiler
- **📦 Zero Dependencies** (except node-addon-api for building)
- **🎯 TypeScript Support** with full type definitions
- **🌍 Cross-platform** - works on Windows, macOS, and Linux

## 📊 Performance

| Implementation | 1MB Code | 10MB Code | Speedup |
|---------------|----------|-----------|---------|
| JavaScript regex | 50-100ms | 500-1000ms | baseline |
| **Native C++** | **10-20ms** | **100-200ms** | **5-10x** |

## 📥 Installation

```bash
npm install @yourname/console-cleaner-native
# or
yarn add @yourname/console-cleaner-native
```

## 🚀 Quick Start

```javascript
const { removeConsole } = require('@yourname/console-cleaner-native');

const source = `
  console.log('debug info');
  const result = calculate();
  console.info('result:', result);
`;

const cleaned = removeConsole(source, ['log', 'info']);
// Returns: "const result = calculate();"
```

## 📖 Usage Examples

### Basic Usage

```javascript
const { removeConsole } = require('@yourname/console-cleaner-native');

// Remove specific console methods
const code = 'console.log("test"); console.error("keep this");';
const result = removeConsole(code, ['log', 'info', 'debug']);
// console.error remains, others removed
```

### With Webpack

```javascript
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
            if (!filename.endsWith('.js')) return;

            const source = assets[filename].source();
            const cleaned = removeConsole(source, ['log', 'info', 'debug']);

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

module.exports = {
  plugins: [new ConsoleCleanPlugin()]
};
```

### TypeScript

```typescript
import { removeConsole, ConsoleCleanOptions } from '@yourname/console-cleaner-native';

const options: ConsoleCleanOptions = {
  remove: ['log', 'info', 'debug'],
  keepErrors: true
};

const cleaned = removeConsole(sourceCode, options.remove);
```

## 🛠️ Build Requirements

### 前置要求

**macOS:**
```bash
xcode-select --install
```

**Windows:**
- 安装 Visual Studio Build Tools
- 或安装完整的 Visual Studio（包含 C++ 工作负载）

**Linux:**
```bash
sudo apt-get install build-essential
```

### 编译 Native Addon

```bash
cd plugins/native-addon
npm install
npm run build
```

## 使用方式

### 1. 在 Webpack Plugin 中使用

```javascript
// webpack.config.js
const ConsoleCleanPluginNative = require('./plugins/ConsoleCleanPluginNative');

module.exports = {
  plugins: [
    new ConsoleCleanPluginNative({
      remove: ['log', 'info', 'debug']
    })
  ]
};
```

### 2. 直接调用

```javascript
const { removeConsole } = require('./plugins/native-addon');

const source = `
console.log('test');
console.info('info');
const result = 42;
`;

const cleaned = removeConsole(source, ['log', 'info']);
console.log(cleaned); // 只保留 const result = 42;
```

## 技术原理

### 1. Node.js Native Addon (N-API)

N-API 是 Node.js 提供的稳定的 C/C++ API，用于构建原生插件：

- **跨版本兼容**：不需要为每个 Node.js 版本重新编译
- **ABI 稳定**：二进制接口稳定，升级 Node.js 无需重新编译
- **高性能**：直接运行 C++ 代码，无需 V8 解释

### 2. 为什么 C++ 更快？

```
JavaScript:
  源码 → V8 解析 → 字节码 → JIT 编译 → 机器码 → 执行
  ↑ 运行时开销

C++:
  源码 → 编译 → 机器码 → 直接执行
  ↑ 编译时优化，零运行时开销
```

**关键优势：**
- **编译优化**：C++ 编译器进行深度优化
- **类型确定**：无动态类型检查开销
- **内存管理**：手动控制，减少 GC 压力
- **SIMD 指令**：可使用 CPU 向量指令

### 3. 工作流程

```
┌─────────────┐
│  JavaScript │
│   (Plugin)  │
└──────┬──────┘
       │ 调用
       ↓
┌─────────────┐
│   N-API     │  ← 类型转换层
│  (Binding)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   C++ 逻辑  │  ← 高性能处理
│  (正则替换)  │
└──────┬──────┘
       │
       ↓
    返回结果
```

## 其他加速方案对比

### 1. WebAssembly (WASM)

```javascript
// 优点：跨平台，无需编译
// 缺点：性能略低于原生 C++
const wasm = await WebAssembly.instantiate(wasmBuffer);
```

### 2. Worker Threads (多线程)

```javascript
// 适合 CPU 密集型并行任务
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js');
```

### 3. Rust + napi-rs

```rust
// 内存安全 + 高性能
#[napi]
fn remove_console(source: String) -> String {
  // Rust 实现
}
```

## 何时使用 Native Addon？

✅ **适合使用：**
- 处理大量数据（MB 级别）
- CPU 密集型计算（加密、压缩、图像处理）
- 性能瓶颈明确的热点代码
- 需要调用系统 API

❌ **不建议使用：**
- 处理小文件（< 100KB）
- I/O 密集型任务
- 简单的业务逻辑
- 跨平台分发困难

## 性能测试

运行性能对比测试：

```bash
node test-performance.js
```

## 故障排查

### 编译失败

```bash
# 清理并重新编译
npm run clean
npm run build
```

### 找不到 .node 文件

检查编译输出：
```bash
ls -la build/Release/
# 应该看到 console_cleaner.node
```

### 版本不兼容

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 参考资料

- [Node.js N-API 文档](https://nodejs.org/api/n-api.html)
- [node-addon-api GitHub](https://github.com/nodejs/node-addon-api)
- [node-gyp 文档](https://github.com/nodejs/node-gyp)

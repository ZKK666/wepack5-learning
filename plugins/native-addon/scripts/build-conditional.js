#!/usr/bin/env node

/**
 * 条件编译脚本
 *
 * 功能：
 * 1. 检测编译环境是否可用
 * 2. 有编译工具时才编译，否则跳过（降级到 JS）
 * 3. 避免用户安装时因缺少编译工具而失败
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasCompilerTools() {
  try {
    // 检查是否有 node-gyp
    execSync('node-gyp --version', { stdio: 'ignore' });

    // 检查是否有 C++ 编译器
    if (process.platform === 'win32') {
      // Windows: 检查 MSVC
      execSync('cl.exe', { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      // macOS: 检查 clang
      execSync('clang --version', { stdio: 'ignore' });
    } else {
      // Linux: 检查 g++
      execSync('g++ --version', { stdio: 'ignore' });
    }

    return true;
  } catch (err) {
    return false;
  }
}

function shouldBuild() {
  // 如果已经编译过了，跳过
  const buildPath = path.join(__dirname, '..', 'build', 'Release', 'console_cleaner.node');
  if (fs.existsSync(buildPath)) {
    console.log('✓ Native addon already built, skipping compilation');
    return false;
  }

  // 检查是否设置了跳过编译的环境变量
  if (process.env.SKIP_NATIVE_ADDON_BUILD === 'true') {
    console.log('⚠ Skipping native addon build (SKIP_NATIVE_ADDON_BUILD=true)');
    return false;
  }

  return true;
}

function main() {
  console.log('Checking build environment...');

  if (!shouldBuild()) {
    return;
  }

  if (!hasCompilerTools()) {
    console.log('⚠ Native compilation tools not found');
    console.log('  The package will work with JavaScript fallback');
    console.log('');
    console.log('  To enable native acceleration, install build tools:');

    if (process.platform === 'darwin') {
      console.log('    xcode-select --install');
    } else if (process.platform === 'win32') {
      console.log('    Install Visual Studio Build Tools');
    } else {
      console.log('    sudo apt-get install build-essential');
    }

    console.log('');
    return;
  }

  // 执行编译
  console.log('✓ Build tools detected, compiling native addon...');

  try {
    execSync('node-gyp rebuild', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✓ Native addon compiled successfully');
  } catch (err) {
    console.error('✗ Failed to compile native addon');
    console.error('  Error:', err.message);
    console.error('  The package will work with JavaScript fallback');
  }
}

if (require.main === module) {
  main();
}

module.exports = { hasCompilerTools, shouldBuild };

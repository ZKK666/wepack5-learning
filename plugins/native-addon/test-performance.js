/**
 * 性能对比测试：JavaScript vs C++
 */

// 生成测试数据
function generateTestCode(size) {
  const lines = [];
  const methods = ['log', 'info', 'debug', 'warn', 'error'];

  for (let i = 0; i < size; i++) {
    const method = methods[i % methods.length];
    lines.push(`console.${method}('Line ${i}', { data: ${i} });`);
    lines.push(`const variable${i} = ${i};`);
  }

  return lines.join('\n');
}

// JavaScript 实现
function removeConsoleJS(source, methods) {
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

// 性能测试
function benchmark(name, fn, iterations = 10) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    fn();
    const end = Date.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`\n${name}:`);
  console.log(`  平均: ${avg.toFixed(2)}ms`);
  console.log(`  最小: ${min}ms`);
  console.log(`  最大: ${max}ms`);

  return avg;
}

// 主测试函数
function runTests() {
  console.log('=================================');
  console.log('性能对比测试：JavaScript vs C++');
  console.log('=================================');

  const testSizes = [
    { name: '小文件 (100 行)', lines: 100 },
    { name: '中等文件 (1000 行)', lines: 1000 },
    { name: '大文件 (10000 行)', lines: 10000 },
  ];

  const methods = ['log', 'info', 'debug'];

  testSizes.forEach(({ name, lines }) => {
    console.log(`\n\n📊 测试: ${name}`);
    console.log('---------------------------------');

    const testCode = generateTestCode(lines);
    const sizeKB = (testCode.length / 1024).toFixed(2);
    console.log(`代码大小: ${sizeKB} KB`);

    // JavaScript 测试
    const jsTime = benchmark(
      '  JavaScript 实现',
      () => removeConsoleJS(testCode, methods),
      5
    );

    // C++ 测试
    let cppTime;
    let nativeAddon;
    let hasNative = false;

    try {
      nativeAddon = require('./index.js');
      hasNative = true;

      cppTime = benchmark(
        '  C++ Native 实现',
        () => nativeAddon.removeConsole(testCode, methods),
        5
      );

      // 计算性能提升
      const speedup = (jsTime / cppTime).toFixed(2);
      console.log(`\n  🚀 性能提升: ${speedup}x 倍`);

    } catch (err) {
      console.log('\n  ⚠️  C++ Native Addon 未安装');
      console.log('  运行以下命令安装:');
      console.log('    cd plugins/native-addon && npm install');
    }
  });

  console.log('\n\n=================================');
  console.log('测试完成');
  console.log('=================================\n');
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = { generateTestCode, removeConsoleJS, benchmark };

/**
 * 多环境配置
 *
 * 【面试重点】企业项目中的多环境管理
 *
 * 常见环境：
 * - development: 本地开发
 * - test: 测试环境
 * - staging: 预发布环境
 * - production: 生产环境
 *
 * 配置管理方式：
 * 1. 环境变量文件（.env, .env.local, .env.production）
 * 2. 配置文件（config/env.xxx.js）
 * 3. 命令行参数（--env production）
 */

const envConfig = {
  // 开发环境
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    CDN_URL: '/',
    ENABLE_MOCK: true,
    ENABLE_DEVTOOLS: true,
    LOG_LEVEL: 'debug',
  },

  // 测试环境
  test: {
    API_BASE_URL: 'https://test-api.example.com',
    CDN_URL: 'https://test-cdn.example.com/',
    ENABLE_MOCK: false,
    ENABLE_DEVTOOLS: true,
    LOG_LEVEL: 'info',
  },

  // 预发布环境
  staging: {
    API_BASE_URL: 'https://staging-api.example.com',
    CDN_URL: 'https://staging-cdn.example.com/',
    ENABLE_MOCK: false,
    ENABLE_DEVTOOLS: true,
    LOG_LEVEL: 'warn',
  },

  // 生产环境
  production: {
    API_BASE_URL: 'https://api.example.com',
    CDN_URL: 'https://cdn.example.com/',
    ENABLE_MOCK: false,
    ENABLE_DEVTOOLS: false,
    LOG_LEVEL: 'error',
  },
};

/**
 * 获取当前环境配置
 */
function getEnvConfig(env = process.env.APP_ENV || 'development') {
  const config = envConfig[env];

  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }

  return {
    ...config,
    ENV: env,
    IS_DEV: env === 'development',
    IS_PROD: env === 'production',
  };
}

module.exports = {
  envConfig,
  getEnvConfig,
};

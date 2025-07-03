/**
 * 应用程序配置
 * 
 * 这个文件从环境变量中读取配置，并提供一个统一的接口供应用程序使用。
 * 环境变量在不同的环境文件中定义：
 * - .env：默认环境变量
 * - .env.development：开发环境变量
 * - .env.production：生产环境变量
 * - .env.test：测试环境变量
 */

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2567';

// 当前环境
export const NODE_ENV = import.meta.env.MODE;

// 是否为开发环境
export const IS_DEV = NODE_ENV === 'development';

// 是否为生产环境
export const IS_PROD = NODE_ENV === 'production';

// 是否为测试环境
export const IS_TEST = NODE_ENV === 'test';

// 导出默认配置对象
const envConfig = {
  apiBaseUrl: API_BASE_URL,
  env: NODE_ENV,
  isDev: IS_DEV,
  isProd: IS_PROD,
  isTest: IS_TEST,
};

export default envConfig;
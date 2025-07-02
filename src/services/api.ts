import axios from 'axios';
import config from '../config';

/**
 * 创建一个预配置的axios实例
 * 
 * 这个实例使用config.ts中定义的API_BASE_URL作为baseURL
 * 所有API请求都应该使用这个实例，而不是直接使用axios
 */
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证令牌等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API错误:', error.response.data);
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        // 清除本地存储的认证信息
        localStorage.removeItem('token');
        // 可以在这里添加重定向到登录页面的逻辑
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误:', error.request);
    } else {
      // 设置请求时发生错误
      console.error('请求错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
import api from './api';

/**
 * 认证服务
 * 
 * 这个服务处理所有与认证相关的API请求，包括登录、注册、密码重置等。
 */

// 邮箱登录
export interface EmailLoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    // 其他用户信息字段
  };
}

export const emailLogin = async (params: EmailLoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login/email', params);
  return response.data;
};

// 用户名登录
export interface UsernameLoginParams {
  username: string;
  password: string;
}

export const usernameLogin = async (params: UsernameLoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login/username', params);
  return response.data;
};

// 邮箱验证码登录
export interface EmailCodeLoginParams {
  email: string;
  code: string;
}

export const emailCodeLogin = async (params: EmailCodeLoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login/email-code', params);
  return response.data;
};

// 发送邮箱验证码
export interface SendEmailCodeParams {
  email: string;
  purpose: 'login' | 'register' | 'reset-password';
}

export const sendEmailCode = async (params: SendEmailCodeParams): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/email-code', params);
  return response.data;
};

// 注册
export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  code?: string; // 如果需要验证码
}

export const register = async (params: RegisterParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/register', params);
  return response.data;
};

// 重置密码
export interface ResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

export const resetPassword = async (params: ResetPasswordParams): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/reset-password', params);
  return response.data;
};

// 退出登录
export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/logout');
  // 清除本地存储的认证信息
  localStorage.removeItem('token');
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<LoginResponse['user']> => {
  const response = await api.get<LoginResponse['user']>('/auth/me');
  return response.data;
};

// 检查认证状态
export const checkAuth = (): boolean => {
  return !!localStorage.getItem('token');
};
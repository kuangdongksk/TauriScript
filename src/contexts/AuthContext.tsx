import { AuthenticationService } from "@/services/AuthenticationService";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAuth,
  emailCodeLogin,
  EmailCodeLoginParams,
  EmailLoginParams,
  getCurrentUser,
  LoginResponse,
  logout,
  register,
  RegisterParams,
  sendEmailCode,
  SendEmailCodeParams,
  usernameLogin,
  UsernameLoginParams,
} from "../services/auth";
import { toast } from "sonner";

// 定义认证上下文的类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginResponse["user"] | null;
  loading: boolean;
  login: {
    email: (params: EmailLoginParams) => Promise<void>;
    username: (params: UsernameLoginParams) => Promise<void>;
    emailCode: (params: EmailCodeLoginParams) => Promise<void>;
    sendEmailCode: (params: SendEmailCodeParams) => Promise<void>;
  };
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件的属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 在组件挂载时检查认证状态
  useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("获取用户信息失败:", error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuthentication();
  }, [isAuthenticated]);

  // 处理登录成功
  const handleLoginSuccess = (response: LoginResponse) => {
    localStorage.setItem("token", response.token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  // 处理错误
  const handleError = (error: any) => {
    toast.error(error.response?.data?.message || "发生错误，请稍后再试");
    setLoading(false);
  };

  // 发送邮箱验证码
  const handleSendEmailCode = async (params: SendEmailCodeParams) => {
    setLoading(true);
    try {
      await sendEmailCode(params);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 邮箱登录
  const handleEmailLogin = async (params: EmailLoginParams) => {
    setLoading(true);
    AuthenticationService.email({ body: params })
      .then((response) => {
        handleLoginSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 用户名登录
  const handleUsernameLogin = async (params: UsernameLoginParams) => {
    setLoading(true);
    try {
      const response = await usernameLogin(params);
      handleLoginSuccess(response);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 邮箱验证码登录
  const handleEmailCodeLogin = async (params: EmailCodeLoginParams) => {
    setLoading(true);
    try {
      const response = await emailCodeLogin(params);
      handleLoginSuccess(response);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const handleRegister = async (params: RegisterParams) => {
    setLoading(true);
    try {
      const response = await register(params);
      handleLoginSuccess(response);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 提供的上下文值
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login: {
      email: handleEmailLogin,
      username: handleUsernameLogin,
      emailCode: handleEmailCodeLogin,
      sendEmailCode: handleSendEmailCode,
    },
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 自定义hook，用于在组件中访问认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  return context;
};

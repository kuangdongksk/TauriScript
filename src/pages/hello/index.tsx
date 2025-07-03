import { authTokenA, userInfoA } from "@/store/authStore";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailCodeLogin from "./EmailCodeLogin";
import EmailLogin from "./EmailLogin";
import EmailRegister from "./EmailRegister";
import ForgotPassword from "./ForgotPassword";
import UsernameLogin from "./UsernameLogin";

export interface IHelloProps {}

type AuthView =
  | "邮箱密码登录"
  | "emailRegister"
  | "usernameLogin"
  | "emailCodeLogin"
  | "忘记密码";

function Hello(_props: IHelloProps) {
  const navigate = useNavigate();
  const setAuthToken = useSetAtom(authTokenA);
  const setUserInfo = useSetAtom(userInfoA);

  const [currentView, setCurrentView] = useState<AuthView>("邮箱密码登录");

  // 导航处理函数
  const handleSwitchToEmailLogin = () => setCurrentView("邮箱密码登录");
  const handleSwitchToRegister = () => setCurrentView("emailRegister");
  const handleSwitchToUsernameLogin = () => setCurrentView("usernameLogin");
  const handleSwitchToEmailCodeLogin = () => setCurrentView("emailCodeLogin");
  const handleSwitchToForgotPassword = () => setCurrentView("忘记密码");

  const onLoginSuccess = (
    token: string,
    user: {
      username: string;
      email: string;
    }
  ) => {
    setAuthToken(token);
    setUserInfo(user);
    navigate("/");
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {currentView === "邮箱密码登录" && (
        <EmailLogin
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToUsernameLogin={handleSwitchToUsernameLogin}
          onSwitchToEmailCodeLogin={handleSwitchToEmailCodeLogin}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {currentView === "emailRegister" && (
        <EmailRegister
          onLoginSuccess={onLoginSuccess}
          onSwitchToLogin={handleSwitchToEmailLogin}
        />
      )}

      {currentView === "usernameLogin" && (
        <UsernameLogin
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToEmailLogin={handleSwitchToEmailLogin}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {currentView === "emailCodeLogin" && (
        <EmailCodeLogin
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToEmailLogin={handleSwitchToEmailLogin}
          onSwitchToUsernameLogin={handleSwitchToUsernameLogin}
        />
      )}
      {currentView === "忘记密码" && (
        <ForgotPassword onSwitchToLogin={handleSwitchToEmailLogin} />
      )}
    </div>
  );
}

export default Hello;

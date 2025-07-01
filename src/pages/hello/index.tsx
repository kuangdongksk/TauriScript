import { useState } from "react";
import EmailLogin from "./EmailLogin";
import EmailRegister from "./EmailRegister";
import UsernameLogin from "./UsernameLogin";
import EmailCodeLogin from "./EmailCodeLogin";
import ForgotPassword from "./ForgotPassword";

export interface IHelloProps {}

type AuthView =
  | "邮箱密码登录"
  | "emailRegister"
  | "usernameLogin"
  | "emailCodeLogin"
  | "忘记密码";

function Hello(_props: IHelloProps) {
  const [currentView, setCurrentView] = useState<AuthView>("邮箱密码登录");

  // 导航处理函数
  const handleSwitchToEmailLogin = () => setCurrentView("邮箱密码登录");
  const handleSwitchToRegister = () => setCurrentView("emailRegister");
  const handleSwitchToUsernameLogin = () => setCurrentView("usernameLogin");
  const handleSwitchToEmailCodeLogin = () => setCurrentView("emailCodeLogin");
  const handleSwitchToForgotPassword = () => setCurrentView("忘记密码");

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {currentView === "邮箱密码登录" && (
        <EmailLogin
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToUsernameLogin={handleSwitchToUsernameLogin}
          onSwitchToEmailCodeLogin={handleSwitchToEmailCodeLogin}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {currentView === "emailRegister" && (
        <EmailRegister onSwitchToLogin={handleSwitchToEmailLogin} />
      )}

      {currentView === "usernameLogin" && (
        <UsernameLogin
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToEmailLogin={handleSwitchToEmailLogin}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {currentView === "emailCodeLogin" && (
        <EmailCodeLogin
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

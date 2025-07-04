import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface IForgotPasswordProps {
  onSwitchToLogin: () => void;
}

function ForgotPassword(props: IForgotPasswordProps) {
  const { onSwitchToLogin } = props;
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<"sendCode" | "resetPassword">("sendCode");

  const handleSendCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || countdown > 0) return;
    
    // 这里将来会添加发送验证码的逻辑
    console.log("发送验证码到:", email);
    
    // 开始倒计时
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加验证码验证逻辑
    console.log("验证码:", { email, code });
    
    // 验证成功后进入重置密码步骤
    setStep("resetPassword");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加重置密码逻辑
    console.log("重置密码:", { email, newPassword, confirmPassword });
    
    // 重置成功后返回登录页面
    onSwitchToLogin();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>找回密码</CardTitle>
        <CardDescription>
          {step === "sendCode" 
            ? "请输入您的邮箱地址获取验证码" 
            : "请设置新密码"}
        </CardDescription>
        <div className="flex justify-end">
          <Button variant="link" onClick={onSwitchToLogin}>返回登录</Button>
        </div>
      </CardHeader>
      <CardContent>
        {step === "sendCode" ? (
          <form onSubmit={handleVerifyCode}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="forgot-email">邮箱</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="forgot-code">验证码</Label>
                <div className="flex gap-2">
                  <Input 
                    id="forgot-code" 
                    type="text" 
                    required 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入验证码"
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="w-32"
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : "发送验证码"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="至少6位字符"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">确认新密码</Label>
                <Input 
                  id="confirm-new-password" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                />
              </div>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          onClick={step === "sendCode" ? handleVerifyCode : handleResetPassword}
        >
          {step === "sendCode" ? "验证" : "重置密码"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ForgotPassword;
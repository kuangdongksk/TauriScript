import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface IEmailCodeLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToEmailLogin: () => void;
  onSwitchToUsernameLogin: () => void;
}

function EmailCodeLogin(props: IEmailCodeLoginProps) {
  const { onSwitchToRegister, onSwitchToEmailLogin, onSwitchToUsernameLogin } =
    props;

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加验证码登录逻辑
    console.log("验证码登录:", { email, code });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>验证码登录</CardTitle>
        <CardDescription>使用邮箱验证码登录</CardDescription>
        <CardAction>
          <Button variant="link" onClick={onSwitchToRegister}>
            注册
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="code-email">邮箱</Label>
              <Input
                id="code-email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verification-code">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="verification-code"
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
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          登录
        </Button>
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSwitchToUsernameLogin}
          >
            用户名登录
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSwitchToEmailLogin}
          >
            密码登录
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EmailCodeLogin;

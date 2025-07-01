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

export interface IEmailLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToUsernameLogin: () => void;
  onSwitchToEmailCodeLogin: () => void;
  onSwitchToForgotPassword: () => void;
}

function EmailLogin(props: IEmailLoginProps) {
  const {
    onSwitchToRegister,
    onSwitchToUsernameLogin,
    onSwitchToEmailCodeLogin,
    onSwitchToForgotPassword,
  } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加登录逻辑
    console.log("邮箱登录:", { email, password });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>请使用邮箱登录</CardDescription>
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
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">密码</Label>
                <Button
                  variant="link"
                  className="ml-auto p-0 h-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchToForgotPassword();
                  }}
                >
                  忘记密码
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
            onClick={onSwitchToEmailCodeLogin}
          >
            验证码登录
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EmailLogin;

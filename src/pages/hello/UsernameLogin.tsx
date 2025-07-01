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

export interface IUsernameLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToEmailLogin: () => void;
  onSwitchToForgotPassword: () => void;
}

function UsernameLogin(props: IUsernameLoginProps) {
  const { onSwitchToRegister, onSwitchToEmailLogin, onSwitchToForgotPassword } =
    props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加登录逻辑
    console.log("用户名登录:", { username, password });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>请使用用户名登录</CardDescription>
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
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="username-password">密码</Label>
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
                id="username-password"
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
        <Button
          variant="outline"
          className="w-full"
          onClick={onSwitchToEmailLogin}
        >
          邮箱登录
        </Button>
      </CardFooter>
    </Card>
  );
}

export default UsernameLogin;

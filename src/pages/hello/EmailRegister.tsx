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

export interface IEmailRegisterProps {
  onSwitchToLogin: () => void;
}

function EmailRegister(props: IEmailRegisterProps) {
  const { onSwitchToLogin } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会添加注册逻辑
    console.log("邮箱注册:", { email, password, confirmPassword });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>创建您的账户</CardDescription>
        <CardAction>
          <Button variant="link" onClick={onSwitchToLogin}>
            已有账户？登录
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="register-email">邮箱</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">密码</Label>
              <Input
                id="register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位字符"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">确认密码</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          注册
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EmailRegister;

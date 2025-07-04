import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthenticationService } from "@/services/AuthenticationService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export interface IEmailRegisterProps {
  onLoginSuccess: (token: string, user: any) => void;
  onSwitchToLogin: () => void;
}

// 定义表单验证模式
const formSchema = z
  .object({
    username: z.string().min(3, { message: "用户名至少需要3个字符" }),
    email: z.string().email({ message: "请输入有效的邮箱地址" }),
    code: z.string().min(6, { message: "请输入6位验证码" }).max(6),
    password: z.string().min(6, { message: "密码至少需要6个字符" }),
    confirmPassword: z.string().min(6, { message: "请确认您的密码" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不匹配",
    path: ["confirmPassword"],
  });

function EmailRegister(props: IEmailRegisterProps) {
  const { onLoginSuccess, onSwitchToLogin } = props;
  const [countdown, setCountdown] = useState(0);

  // 使用 useForm hook 创建表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = form.watch("email");

  const handleSendCode = () => {
    if (!email || countdown > 0) return;

    // 验证邮箱格式
    if (!z.string().email().safeParse(email).success) {
      form.setError("email", { message: "请输入有效的邮箱地址" });
      return;
    }

    AuthenticationService.sendVerificationCode({
      email,
    })
      .then(() => {
        toast.success("验证码已发送");
      })
      .catch((err) => {
        toast.error(err.response?.data?.msg || "发送失败");
      });

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

  // 表单提交处理
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { username, email, password, code } = values;

    AuthenticationService.register({
      body: {
        username,
        email,
        password,
        code,
      },
    })
      .then((res) => {
        onLoginSuccess(res.data.token, res.data.user);
      })
      .catch((err) => {
        toast.error(err.response?.data?.msg || "注册失败");
      });
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">注册</CardTitle>
          <Button variant="link" onClick={onSwitchToLogin} className="p-0">
            已有账户？登录
          </Button>
        </div>
        <CardDescription>创建您的账户</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>验证码</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="请输入验证码"
                        maxLength={6}
                        className="flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      className="w-32 shrink-0"
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : "发送验证码"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="至少6位字符"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="再次输入密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          注册
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EmailRegister;

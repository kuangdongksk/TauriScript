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

export interface IEmailCodeLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToEmailLogin: () => void;
  onSwitchToUsernameLogin: () => void;
}

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  code: z.string().min(6, { message: "请输入6位验证码" }).max(6),
});

function EmailCodeLogin(props: IEmailCodeLoginProps) {
  const { onSwitchToRegister, onSwitchToEmailLogin, onSwitchToUsernameLogin } =
    props;

  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 使用 useForm hook 创建表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const email = form.watch("email");

  const handleSendCode = async () => {
    if (!email || countdown > 0 || sendingCode) return;

    // 验证邮箱格式
    if (!z.string().email().safeParse(email).success) {
      form.setError("email", { message: "请输入有效的邮箱地址！" });
      return;
    }

    setLoading(true);
    AuthenticationService.sendVerificationCode({
      email,
    })
      .then(() => {
        setSendingCode(true);

        toast.success("验证码已发送，请查收邮件！");

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
      })
      .catch((err: Error) => {
        toast.error(err.message || "发送失败！");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    AuthenticationService.emailCode({
      body: {
        email: values.email,
        code: values.code,
      },
    })
      .then(() => {
        toast.success("登录成功");
        navigate("/");
      })
      .catch((err: Error) => {
        toast.error(err.message);
      });
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">验证码登录</CardTitle>
          <Button variant="link" onClick={onSwitchToRegister} className="p-0">
            注册
          </Button>
        </div>
        <CardDescription>使用邮箱验证码登录</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      disabled={countdown > 0 || sendingCode || loading}
                      className="w-32 shrink-0"
                    >
                      {sendingCode
                        ? "发送中..."
                        : countdown > 0
                        ? `${countdown}秒后重试`
                        : "发送验证码"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? "登录中..." : "登录"}
        </Button>
        <div className="flex w-full gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSwitchToUsernameLogin}
            disabled={loading}
          >
            用户名登录
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSwitchToEmailLogin}
            disabled={loading}
          >
            密码登录
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EmailCodeLogin;

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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "../../contexts/AuthContext";

export interface IEmailLoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
  onSwitchToUsernameLogin: () => void;
  onSwitchToEmailCodeLogin: () => void;
  onSwitchToForgotPassword: () => void;
}

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string().min(6, { message: "密码至少需要6个字符" }),
});

function EmailLogin(props: IEmailLoginProps) {
  const {
    onSwitchToRegister,
    onSwitchToUsernameLogin,
    onSwitchToEmailCodeLogin,
    onSwitchToForgotPassword,
  } = props;

  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  // 如果已经登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // 使用 useForm hook 创建表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    AuthenticationService.email({
      body: values,
    })
      .then((res) => {
        if (res.data) {
          localStorage.setItem("token", res.data.token);
        }
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.msg);
      });
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <Button variant="link" onClick={onSwitchToRegister} className="p-0">
            注册
          </Button>
        </div>
        <CardDescription>请使用邮箱登录</CardDescription>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>密码</FormLabel>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={onSwitchToForgotPassword}
                    >
                      忘记密码?
                    </Button>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
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
            onClick={onSwitchToEmailCodeLogin}
            disabled={loading}
          >
            验证码登录
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EmailLogin;

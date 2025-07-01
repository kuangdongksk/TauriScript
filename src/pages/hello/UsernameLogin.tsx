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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export interface IUsernameLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToEmailLogin: () => void;
  onSwitchToForgotPassword: () => void;
}

// 定义表单验证模式
const formSchema = z.object({
  username: z.string().min(3, { message: "用户名至少需要3个字符" }),
  password: z.string().min(6, { message: "密码至少需要6个字符" }),
});

function UsernameLogin(props: IUsernameLoginProps) {
  const { onSwitchToRegister, onSwitchToEmailLogin, onSwitchToForgotPassword } =
    props;

  // 使用 useForm hook 创建表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 表单提交处理
  function onSubmit(values: z.infer<typeof formSchema>) {
    // 这里将来会添加登录逻辑
    console.log("用户名登录:", values);
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
        <CardDescription>请使用用户名登录</CardDescription>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>密码</FormLabel>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={onSwitchToForgotPassword}
                      type="button"
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
        >
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
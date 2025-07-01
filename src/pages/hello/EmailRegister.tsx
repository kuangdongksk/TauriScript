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
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export interface IEmailRegisterProps {
  onSwitchToLogin: () => void;
}

// 定义表单验证模式
const formSchema = z
  .object({
    username: z.string().min(3, { message: "用户名至少需要3个字符" }),
    email: z.string().email({ message: "请输入有效的邮箱地址" }),
    password: z.string().min(6, { message: "密码至少需要6个字符" }),
    confirmPassword: z.string().min(6, { message: "请确认您的密码" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不匹配",
    path: ["confirmPassword"],
  });

function EmailRegister(props: IEmailRegisterProps) {
  const { onSwitchToLogin } = props;

  // 使用 useForm hook 创建表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 表单提交处理
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, password } = values;
    
    axios
      .post("http://localhost:2567/user/create", {
        username,
        email,
        password,
      })
      .then(() => {
        toast.success("注册成功");
        onSwitchToLogin();
      })
      .catch((err) => {
        toast.error(err.response?.data?.msg || "注册失败");
      });
  }

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
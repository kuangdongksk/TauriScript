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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export interface IForgotPasswordProps {
  onSwitchToLogin: () => void;
}

// 验证码步骤的表单验证模式
const verifyCodeSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  code: z.string().min(6, { message: "请输入6位验证码" }).max(6),
});

// 重置密码步骤的表单验证模式
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: "密码至少需要6个字符" }),
    confirmPassword: z.string().min(6, { message: "请确认您的密码" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不匹配",
    path: ["confirmPassword"],
  });

function ForgotPassword(props: IForgotPasswordProps) {
  const { onSwitchToLogin } = props;
  
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<"sendCode" | "resetPassword">("sendCode");
  const [userEmail, setUserEmail] = useState("");

  // 验证码步骤的表单
  const verifyForm = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  // 重置密码步骤的表单
  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const email = verifyForm.watch("email");

  const handleSendCode = () => {
    if (!email || countdown > 0) return;
    
    // 验证邮箱格式
    if (!z.string().email().safeParse(email).success) {
      verifyForm.setError("email", { message: "请输入有效的邮箱地址" });
      return;
    }
    
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

  // 验证码表单提交处理
  function onVerifySubmit(values: z.infer<typeof verifyCodeSchema>) {
    // 这里将来会添加验证码验证逻辑
    console.log("验证码:", values);
    
    // 保存邮箱以便在重置密码步骤使用
    setUserEmail(values.email);
    
    // 验证成功后进入重置密码步骤
    setStep("resetPassword");
  }

  // 重置密码表单提交处理
  function onResetSubmit(values: z.infer<typeof resetPasswordSchema>) {
    // 这里将来会添加重置密码逻辑
    console.log("重置密码:", { email: userEmail, ...values });
    
    // 重置成功后返回登录页面
    onSwitchToLogin();
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">找回密码</CardTitle>
          <Button variant="link" onClick={onSwitchToLogin} className="p-0">
            返回登录
          </Button>
        </div>
        <CardDescription>
          {step === "sendCode" 
            ? "请输入您的邮箱地址获取验证码" 
            : "请设置新密码"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "sendCode" ? (
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
              <FormField
                control={verifyForm.control}
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
                control={verifyForm.control}
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
            </form>
          </Form>
        ) : (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
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
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认新密码</FormLabel>
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
        )}
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          onClick={
            step === "sendCode" 
              ? verifyForm.handleSubmit(onVerifySubmit) 
              : resetForm.handleSubmit(onResetSubmit)
          }
        >
          {step === "sendCode" ? "验证" : "重置密码"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ForgotPassword;
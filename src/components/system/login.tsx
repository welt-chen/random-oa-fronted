import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { login } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({
  onLoginSuccess,
  open,
  onOpenChange,
}: LoginFormProps) {
  const { login: authLogin } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!username.trim()) {
      toast.error("请输入用户名");
      return;
    }

    if (!password.trim()) {
      toast.error("请输入密码");
      return;
    }

    if (password.length < 6) {
      toast.error("密码长度不能少于6位");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        realName: username.trim(),
        password: password.trim(),
      });

      if (response.status === 0) {
        // 登录成功 - 使用auth store
        authLogin(response.result.token, response.result.user);

        toast.success("登录成功！", {
          description: `欢迎回来，${response.result.user.realName}`,
          duration: 3000,
        });
        if (onOpenChange) {
          onOpenChange(false);
        }
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        toast.error("登录失败", {
          description: response.msg || "用户名或密码错误",
        });
      }
    } catch (error) {
      console.error("登录请求失败：", error);
      toast.error("登录失败", {
        description: "网络连接失败，请稍后重试",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>用户登录</DialogTitle>
          <DialogDescription>请输入您的用户名和密码进行登录</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">用户名</Label>
            <Input
              id="login-username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">密码</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              "登录"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import "./LoginPage.css";

const getRedirectTarget = (search: string) => {
  const redirect = new URLSearchParams(search).get("redirect");
  if (redirect && redirect.startsWith("/")) {
    return redirect;
  }
  return "/";
};

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = useMemo(
    () => getRedirectTarget(location.search),
    [location.search]
  );
  const { login: authLogin, isAuthenticated } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
        authLogin(response.result.token, response.result.user);
        toast.success("登录成功！", {
          description: `欢迎回来，${response.result.user.realName}`,
          duration: 3000,
        });
        navigate(redirectTarget, { replace: true });
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
    <div className="login-page">
      <div className="login-ambient">
        <span className="login-orb orb-1" />
        <span className="login-orb orb-2" />
        <span className="login-orb orb-3" />
      </div>
      <div className="login-scanlines" aria-hidden />

      <div className="login-grid">
        <section className="login-hero">
          <div className="login-sigil login-reveal delay-1">
            <span className="login-sigil-runes" aria-hidden />
            <span className="login-sigil-scan" aria-hidden />
            <div className="login-sigil-core">
              <span className="login-sigil-label">ACCESS</span>
              <span className="login-sigil-code">GATE-07</span>
            </div>
          </div>

          <p className="login-kicker login-reveal delay-2">劳动管理系统</p>
          <h1 className="login-title login-reveal delay-3">
            终焉结界 · 指挥中枢
          </h1>
          <p className="login-subtitle login-reveal delay-4">
            在此宣誓权限，唤醒封印核心。白名单为钥，令牌为印。
          </p>

          <div className="login-tags login-reveal delay-5">
            <span>白名单启封</span>
            <span>令牌巡游</span>
            <span>审计校验中</span>
          </div>
        </section>

        <section className="login-panel login-reveal delay-3">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="login-card-kicker">契约入口</p>
                <h2 className="login-card-title">秘仪登录</h2>
              </div>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <label className="login-label" htmlFor="login-username-page">
                账号
              </label>
              <Input
                id="login-username-page"
                type="text"
                placeholder="输入真实姓名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                className="login-input"
              />

              <label className="login-label" htmlFor="login-password-page">
                密钥
              </label>
              <div className="login-password">
                <Input
                  id="login-password-page"
                  type={showPassword ? "text" : "password"}
                  placeholder="输入密钥"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                variant="ghost"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    结界校验中...
                  </>
                ) : (
                  "启 动 结 界"
                )}
              </Button>
            </form>

            <div className="login-footnote">
              请确保网络环境稳定，登录信息将用于权限审计。
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

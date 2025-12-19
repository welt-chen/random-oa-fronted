import { create } from "zustand";
import { toast } from "sonner";
import type { SecurityUser } from "@/types/api";
import { getToken, getCurrentUser, loginSuccess, logout as authLogout, isAuthenticated } from "@/utils/auth";

interface AuthState {
  token: string | null;
  user: SecurityUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 初始化认证状态
  initializeAuth: () => Promise<void>;
  // 登录
  login: (token: string, user: SecurityUser) => void;
  // 登出
  logout: () => void;
  // 检查认证状态
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // 初始化认证状态 - 从localStorage读取token和用户信息
  initializeAuth: async () => {
    try {
      const token = getToken();
      const user = getCurrentUser();
      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        if (token && !user) {
          authLogout(); 
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("初始化认证状态失败:", error);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // 登录成功
  login: (token: string, user: SecurityUser) => {
    loginSuccess(token, user);
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  // 登出
  logout: () => {
    authLogout();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    toast.success("已登出", {
      duration: 2000,
    });
  },

  // 检查认证状态
  checkAuth: () => {
    const authenticated = isAuthenticated();
    const currentState = get();
    
    // 如果状态不匹配，更新状态
    if (currentState.isAuthenticated !== authenticated) {
      set({ isAuthenticated: authenticated });
    }
    
    return authenticated;
  },
}));
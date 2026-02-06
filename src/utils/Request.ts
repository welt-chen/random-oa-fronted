import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { getToken, logout as authLogout } from "@/utils/auth";
import { useAuthStore } from "@/store/useAuthStore";

const service: AxiosInstance = axios.create({
  // baseURL: "http://115.190.219.146:9010",
  baseURL: "http://localhost:9010",
  timeout: 15000, // 超时时间15秒
});

let isAuthRedirecting = false;

const isLoginRequest = (url?: string) => {
  if (!url) return false;
  return url.includes("/login");
};

const redirectToLogin = (message?: string) => {
  if (isAuthRedirecting) return;
  isAuthRedirecting = true;
  setTimeout(() => {
    isAuthRedirecting = false;
  }, 1000);

  authLogout();
  useAuthStore.setState({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  if (message) {
    toast.error(message);
  }

  if (window.location.pathname !== "/login") {
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const redirectParam = encodeURIComponent(current);
    window.location.replace(`/login?redirect=${redirectParam}`);
  }
};

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers["Authorization"] = `${token}`
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.status === 401 && !isLoginRequest(response.config?.url)) {
      redirectToLogin(res.msg || "登录失效");
      return Promise.reject(new Error(res.msg || "登录失效"));
    }
    // 根据后端返回格式，status 为 0 表示成功
    if (res.status !== 0) {
      console.error("Response error:", res.msg || "Unknown error");
      toast.error(res.msg || "请求失败");
      return Promise.reject(new Error(res.msg || "Unknown error"));
    }
    return res;
  },
  (error) => {
    // 获取后端返回的错误信息（即使HTTP状态码是500）
    const errorStatus = error.response?.data?.status;
    const isAuthError = errorStatus === 401 && !isLoginRequest(error.response?.config?.url);
    if (isAuthError) {
      redirectToLogin(error.response?.data?.msg || "登录失效");
    }
    const errorMessage = error.response?.data?.msg || error.message || "网络请求失败";
    console.error("Response error:", errorMessage);
    if (!isAuthError) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.patch(url, data, config);
  },
};

export default service;

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

const service: AxiosInstance = axios.create({
  baseURL: "http://115.190.219.146:9010",
  // baseURL: "http://localhost:9010",
  timeout: 15000, // 超时时间15秒
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
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
    // 根据后端返回格式，status 为 0 表示成功
    if (res.status !== 0) {
      console.error("Response error:", res.msg || "Unknown error");
      toast.error(res.msg || "请求失败");
      return Promise.reject(new Error(res.msg || "Unknown error"));
    }
    return res;
  },
  (error) => {
    console.error("Response error:", error.message);
    toast.error(error.message || "网络请求失败");
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

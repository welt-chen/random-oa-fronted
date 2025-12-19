// 用户认证相关工具函数

import type { SecurityUser } from '@/types/api'

const TOKEN_KEY = 'token'
const USER_KEY = 'currentUser'

// 获取token
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token
}

// 设置token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 获取当前用户信息
export const getCurrentUser = (): SecurityUser | null => {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error("解析用户数据失败:", error)
    return null
  }
}
// 设置当前用户信息
export const setCurrentUser = (user: SecurityUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
// 移除当前用户信息
export const removeCurrentUser = (): void => {
  localStorage.removeItem(USER_KEY)
}
// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken()
}
// 登出
export const logout = (): void => {
  removeToken()
  removeCurrentUser()
  // 触发自定义事件，通知组件状态变化
  window.dispatchEvent(new CustomEvent('auth-change'))
}
// 登录成功处理
export const loginSuccess = (token: string, user: SecurityUser): void => {
  setToken(token)
  setCurrentUser(user)
  // 触发自定义事件，通知组件状态变化
  window.dispatchEvent(new CustomEvent('auth-change'))
}
// 添加认证监听器
export const addAuthListener = (callback: () => void): (() => void) => {
  window.addEventListener('auth-change', callback)
  return () => window.removeEventListener('auth-change', callback)
}
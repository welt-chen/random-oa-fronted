// 全局登出工具函数 - 清除所有存储的数据

import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'
import { useProjectStore } from '@/store/useProjectStore'
import { logout as authLogout } from '@/utils/auth'

/**
 * 执行完整的登出操作，清除所有存储数据
 */
export const performLogout = () => {
  try {
    // 1. 清除认证相关的localStorage数据
    authLogout()
    
    // 2. 清除Zustand auth store
    const authStore = useAuthStore.getState()
    authStore.logout()
    
    // 3. 清除用户数据存储
    const userStore = useUserStore.getState()
    userStore.users = []
    userStore.initialized = false
    
    const projectStore = useProjectStore.getState()
    projectStore.projects = []
    projectStore.initialized = false
  } catch (error) {
    console.error('登出过程中发生错误:', error)
    // 即使出错也要确保基本的localStorage数据被清除
    authLogout()
  }
}
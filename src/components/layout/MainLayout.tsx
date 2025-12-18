import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { performLogout } from '@/utils/logout'
import { toast } from 'sonner'

export function MainLayout() {
  const handleLogout = () => {
    try {
      performLogout()
      toast.success('登出成功', {
        description: '已清空所有用户数据',
        duration: 2000,
      })
    } catch (error) {
      console.error('登出失败:', error)
      toast.error('登出失败', {
        description: '请稍后重试',
        duration: 3000,
      })
    }
  }
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
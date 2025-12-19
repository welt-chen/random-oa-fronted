import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { LoginDialog } from '@/components/system/login'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Shuffle, 
  LogOut, 
  LogIn,
  User,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  onLogout?: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  const handleLogout = () => {
    logout()
    onLogout?.()
  }

  const handleLoginSuccess = () => {
    setLoginDialogOpen(false)
  }

  const menuItems = [
    {
      id: 'lottery',
      label: '抽签',
      icon: Shuffle,
      path: '/lottery',
      requiresAuth: true
    },
    {
      id: 'employees',
      label: '员工管理',
      icon: Users,
      path: '/employees',
      requiresAuth: true
    },
    {
      id: 'project-management',
      label: '项目管理',
      icon: Settings,
      path: '/project-management',
      requiresAuth: true
    },
    {
      id: 'logs',
      label: '操作日志',
      icon: FileText,
      path: '/logs',
      requiresAuth: true
    }
  ]

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r transition-all duration-300",
      isCollapsed ? "w-14" : "w-48"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">劳动管理系统</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Section */}
      <div className="flex items-start justify-start ml-4 p-3 border-b">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.realName || '用户'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.jobPosition || '未知职位'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">未登录</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-2 flex flex-col items-center">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/lottery')
          const isDisabled = item.requiresAuth && !isAuthenticated

          const handleNavigation = () => {
            if (!isDisabled) {
              navigate(item.path)
            }
          }

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleNavigation}
              disabled={isDisabled}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Login/Logout Section */}
      <div className="p-3 border-t flex justify-center">
        {isAuthenticated ? (
          <Button
            variant="ghost"
            className={cn("w-full justify-center", !isCollapsed && "justify-start")}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2 text-xs">退出登录</span>}
          </Button>
        ) : (
          <Button
            variant="default"
            className={cn("w-full justify-center", !isCollapsed && "justify-start")}
            onClick={() => setLoginDialogOpen(true)}
          >
            <LogIn className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2 text-xs">登录</span>}
          </Button>
        )}
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LoginDialog } from './login'
import { useAuthStore } from '@/store/useAuthStore'

export function LoginButton() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  const handleLoginSuccess = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  if (isAuthenticated) {
    // 登录成功后显示用户信息
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          欢迎回来，{user?.realName || '用户'}！
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          退出
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        登录
      </Button>
      <LoginDialog
        open={open}
        onOpenChange={setOpen}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
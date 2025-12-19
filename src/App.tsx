import { AppRouter } from './router'
import './App.css'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'

function App() {
  const { initializeAuth, isLoading } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">正在初始化认证状态...</div>
      </div>
    )
  }

  return <AppRouter />
}

export default App

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'
import { UserTable, type User, Position, InjuryStatus } from '@/components/usermanage/UserTable'
import { UserDialog } from '@/components/usermanage/UserDialog'

// 模拟数据
const mockUsers: User[] = [
  {
    id: 1,
    realName: '张三',
    birthDate: '1990-05-15',
    jobPosition: Position.MANAGER,
    laborValue: 850,
    injuryStatus: InjuryStatus.HEALTHY,
  },
  {
    id: 2,
    realName: '李四',
    birthDate: '1992-08-20',
    jobPosition: Position.DEVELOPER,
    laborValue: 720,
    injuryStatus: InjuryStatus.HEALTHY,
  },
  {
    id: 3,
    realName: '王五',
    birthDate: '1988-12-10',
    jobPosition: Position.DEVELOPER,
    laborValue: 650,
    injuryStatus: InjuryStatus.MINOR_INJURY,
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 添加用户
  const handleAddUser = () => {
    setCurrentUser(null)
    setDialogOpen(true)
  }

  // 编辑用户
  const handleEdit = (user: User) => {
    setCurrentUser(user)
    setDialogOpen(true)
  }

  // 删除用户
  const handleDelete = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id))
  }

  // 保存用户（添加或编辑）
  const handleSave = (user: User) => {
    if (currentUser) {
      // 更新现有用户
      setUsers(users.map(u => u.id === user.id ? user : u))
    } else {
      // 添加新用户
      setUsers([...users, user])
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">用户管理</h1>
          <p className="text-sm text-muted-foreground">管理系统用户信息</p>
        </div>

        {/* 用户表格 */}
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* 底部信息和添加按钮 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {users.length} 个用户
          </div>
          <Button size="sm" onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            添加用户
          </Button>
        </div>
      </div>

      {/* 用户编辑弹窗 */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={currentUser}
        onSave={handleSave}
      />
    </div>
  )
}

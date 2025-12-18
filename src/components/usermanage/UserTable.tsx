import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2 } from 'lucide-react'

// 岗位枚举
export enum Position {
  HR = 'hr',
  DEVELOPER = 'developer',
  PRODUCT = 'product',
  UI = 'ui',
  FINANCE = 'finance',
  MANAGER = 'manager',
}

// 岗位显示名称映射
export const PositionLabels: Record<Position, string> = {
  [Position.HR]: '人事',
  [Position.DEVELOPER]: '开发',
  [Position.PRODUCT]: '产品',
  [Position.UI]: 'UI',
  [Position.FINANCE]: '财务',
  [Position.MANAGER]: '管理者',
}

// 伤病状态枚举
export enum InjuryStatus {
  HEALTHY = 0,
  MINOR_INJURY = 1,
  SEVERE_INJURY = 2,
  SICK_LEAVE = 3,
}

// 伤病状态显示名称映射
export const InjuryStatusLabels: Record<InjuryStatus, string> = {
  [InjuryStatus.HEALTHY]: '健康',
  [InjuryStatus.MINOR_INJURY]: '轻伤',
  [InjuryStatus.SEVERE_INJURY]: '中度',
  [InjuryStatus.SICK_LEAVE]: '重度',
}

// 用户数据类型
export interface User {
  id: number
  realName: string
  birthDate: string
  laborValue: number
  injuryStatus: number  // 0-健康 1-轻伤 2-重伤 3-病假
  jobPosition: Position
}

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  isHR?: boolean
}

export function UserTable({ users, onEdit, onDelete, isHR = false }: UserTableProps) {
  const handleDelete = (user: User) => {
    onDelete(user)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>真实姓名</TableHead>
            <TableHead>出生日期</TableHead>
            <TableHead>岗位</TableHead>
            <TableHead className="text-center">劳动值</TableHead>
            <TableHead>伤病状态</TableHead>
            <TableHead className="text-center w-[160px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                暂无用户数据
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.realName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.birthDate}</TableCell>
                <TableCell>{PositionLabels[user.jobPosition]}</TableCell>
                <TableCell className="text-center font-medium">{user.laborValue}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.injuryStatus === InjuryStatus.HEALTHY
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : user.injuryStatus === InjuryStatus.MINOR_INJURY
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : user.injuryStatus === InjuryStatus.SEVERE_INJURY
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}>
                    {InjuryStatusLabels[user.injuryStatus as InjuryStatus]}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    {isHR && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

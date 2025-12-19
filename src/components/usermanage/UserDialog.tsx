import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Loader2 } from 'lucide-react'
import type { User } from './UserTable'
import { Position, PositionLabels, InjuryStatus, InjuryStatusLabels } from './UserTable'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (user: User) => void
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const isEdit = !!user
  const [isLoading, setIsLoading] = useState(false)
  
  // 表单数据
  const [formData, setFormData] = useState({
    realName: '',
    birthDate: '',
    jobPosition: Position.DEVELOPER,
    laborValue: 0,
    injuryStatus: InjuryStatus.HEALTHY,
  })

  // 当用户数据变化时更新表单
  useEffect(() => {
    if (user) {
      setFormData({
        realName: user.realName,
        birthDate: user.birthDate,
        jobPosition: user.jobPosition,
        laborValue: user.laborValue,
        injuryStatus: user.injuryStatus,
      })
    } else {
      // 重置表单
      setFormData({
        realName: '',
        birthDate: '',
        jobPosition: Position.DEVELOPER,
        laborValue: 0,
        injuryStatus: InjuryStatus.HEALTHY,
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    if (!formData.realName.trim()) {
      toast.error('请输入真实姓名')
      return
    }

    if (!formData.birthDate) {
      toast.error('请选择出生日期')
      return
    }

    if (!formData.jobPosition.trim()) {
      toast.error('请选择岗位')
      return
    }

    if (formData.laborValue < 0 || formData.laborValue > 300) {
      toast.error('劳动值必须在0-300之间')
      return
    }

    setIsLoading(true)

    try {
      const userData: User = {
        ...(user || {
          id: 0, 
        }),
        realName: formData.realName,
        birthDate: formData.birthDate,
        jobPosition: formData.jobPosition,
        laborValue: formData.laborValue,
        injuryStatus: formData.injuryStatus,
      }
      onSave(userData)
      if (!isEdit) {
        setFormData({
          realName: '',
          birthDate: '',
          jobPosition: Position.DEVELOPER,
          laborValue: 0,
          injuryStatus: InjuryStatus.HEALTHY,
        })
        toast.success('用户添加成功')
      } else {
        // 编辑完成后关闭弹窗
        onOpenChange(false)
        toast.success('用户更新成功')
      }
    } catch (error) {
      console.error('准备保存用户失败：', error)
      toast.error(isEdit ? '更新失败' : '创建失败', {
        description: '请稍后重试',
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑用户' : '添加用户'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '修改用户信息' : '填写新用户的详细信息'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="realName">真实姓名 *</Label>
                <Input
                  id="realName"
                  value={formData.realName}
                  onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                  placeholder="请输入真实姓名"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">出生日期 *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobPosition">岗位 *</Label>
                <select
                  id="jobPosition"
                  value={formData.jobPosition}
                  onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value as Position })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value={Position.HR}>{PositionLabels[Position.HR]}</option>
                  <option value={Position.DEVELOPER}>{PositionLabels[Position.DEVELOPER]}</option>
                  <option value={Position.PRODUCT}>{PositionLabels[Position.PRODUCT]}</option>
                  <option value={Position.UI}>{PositionLabels[Position.UI]}</option>
                  <option value={Position.FINANCE}>{PositionLabels[Position.FINANCE]}</option>
                  <option value={Position.MANAGER}>{PositionLabels[Position.MANAGER]}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborValue">劳动值 *</Label>
                <Input
                  id="laborValue"
                  type="number"
                  value={formData.laborValue}
                  onChange={(e) => setFormData({ ...formData, laborValue: Number(e.target.value) })}
                  placeholder="请输入劳动值"
                  disabled={isLoading}
                  min="0"
                  max="300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="injuryStatus">伤病状态 *</Label>
              <select
                id="injuryStatus"
                value={formData.injuryStatus}
                onChange={(e) => setFormData({ ...formData, injuryStatus: Number(e.target.value) as InjuryStatus })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value={InjuryStatus.HEALTHY}>{InjuryStatusLabels[InjuryStatus.HEALTHY]}</option>
                <option value={InjuryStatus.MINOR_INJURY}>{InjuryStatusLabels[InjuryStatus.MINOR_INJURY]}</option>
                <option value={InjuryStatus.SEVERE_INJURY}>{InjuryStatusLabels[InjuryStatus.SEVERE_INJURY]}</option>
                <option value={InjuryStatus.SICK_LEAVE}>{InjuryStatusLabels[InjuryStatus.SICK_LEAVE]}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

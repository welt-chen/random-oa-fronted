import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { LaborProjectTable } from './LaborProjectTable'
import type { LaborProjectRecordDTO } from '@/types/api'

interface LaborProjectListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: LaborProjectRecordDTO[]
  onAdd: () => void
  onEdit: (project: LaborProjectRecordDTO) => void
  onDelete: (project: LaborProjectRecordDTO) => void
}

export function LaborProjectListDialog({
  open,
  onOpenChange,
  projects,
  onAdd,
  onEdit,
  onDelete,
}: LaborProjectListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>劳动项目列表</DialogTitle>
          <DialogDescription>查看和管理所有劳动项目</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 项目表格 */}
          <LaborProjectTable
            projects={projects}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* 底部信息和添加按钮 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              共 {projects.length} 个项目
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              创建项目
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

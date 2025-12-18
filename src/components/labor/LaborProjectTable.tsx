import { toast } from 'sonner'
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
import type { LaborProjectRecordDTO } from '@/types/api'

// 项目状态枚举
export enum ProjectStatus {
  PENDING = 0,
  COMPLETED = 1,
  CANCELLED = 2,
}

// 项目状态显示名称映射
export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.PENDING]: '待分配',
  [ProjectStatus.COMPLETED]: '已完成',
  [ProjectStatus.CANCELLED]: '已取消',
}

interface LaborProjectTableProps {
  projects: LaborProjectRecordDTO[]
  onEdit: (project: LaborProjectRecordDTO) => void
  onDelete: (project: LaborProjectRecordDTO) => void
}

export function LaborProjectTable({ projects, onEdit, onDelete }: LaborProjectTableProps) {
  const handleDelete = (project: LaborProjectRecordDTO) => {
    toast.success(`已删除项目：${project.projectName}`)
    onDelete(project)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>项目名称</TableHead>
            <TableHead>工作描述</TableHead>
            <TableHead className="w-[120px]">所需劳动值</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[180px]">创建时间</TableHead>
            <TableHead className="w-[160px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                暂无劳动项目
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.id}</TableCell>
                <TableCell className="font-medium">{project.projectName}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {project.workDescription || '-'}
                </TableCell>
                <TableCell className="text-center font-medium">{project.requiredLaborValue}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === ProjectStatus.PENDING
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : project.status === ProjectStatus.COMPLETED
                      ? 'bg-gray-100 text-gray-800 border border-gray-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {ProjectStatusLabels[project.status as ProjectStatus]}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {project.createTime}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(project)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除
                    </Button>
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

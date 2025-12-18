import { Button } from '@/components/ui/Button'
import { FileText } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer'

export interface LogItem {
  id: number
  timestamp: string
  type: 'info' | 'success' | 'error'
  message: string
}

interface LogDrawerProps {
  logs: LogItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogDrawer({ logs, open, onOpenChange }: LogDrawerProps) {
  return (
    <div className="fixed top-6 right-6 z-40">
      <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            操作日志
          </Button>
        </DrawerTrigger>
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>操作日志</DrawerTitle>
            <DrawerDescription>查看系统操作记录</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  暂无日志记录
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          log.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : log.type === 'error'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {log.type === 'success'
                          ? '✓ 成功'
                          : log.type === 'error'
                          ? '✗ 错误'
                          : 'ℹ 信息'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-4 border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                关闭
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

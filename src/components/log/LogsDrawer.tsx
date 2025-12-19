import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogStore } from "@/store/useLogStore";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/Drawer";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/Button";
import { 
  RefreshCw, 
  X, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  History
} from "lucide-react";
import { AllocationResultCard } from "@/components/log/AllocationResultCard";
import type { LaborAllocationLogQueryDTO } from "@/types/api";
import { cn } from "@/lib/utils";

interface LogsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogsDrawer({ open, onOpenChange }: LogsDrawerProps) {
  const { initializeAuth } = useAuthStore();
  const { logs, loading, total, pageNum, pageSize, fetchLogs, addLog, setPage } = useLogStore();
  
  // 保持每页 7 条，配合紧凑布局非常合适
  const [queryParams, setQueryParams] = useState<LaborAllocationLogQueryDTO>({
    pageNum: 0,
    pageSize: 7 
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (open && !loading && logs.length === 0) {
      fetchLogs(queryParams);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchLogs(queryParams);
    }
  }, [queryParams.pageNum, queryParams.pageSize, open]);

  const refreshLogs = () => {
    if (!loading) {
      fetchLogs(queryParams);
      addLog("success", "已刷新");
    }
  };

  const handlePageChange = (newPageNum: number) => {
    if (loading) return;
    const newParams = { ...queryParams, pageNum: newPageNum };
    setQueryParams(newParams);
    setPage(newPageNum, pageSize);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      {/* 宽度由 500px -> 420px，视觉更轻 */}
      <DrawerContent side="right" className="w-full sm:w-[420px] max-w-[90vw] flex flex-col h-full border-l shadow-none">
        
        {/* Header: 压缩高度 px-3 py-2 */}
        <DrawerHeader className="flex items-center justify-between border-b px-3 py-2 bg-background z-10 min-h-[40px]">
          <div className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            <DrawerTitle className="text-sm font-semibold">操作日志</DrawerTitle>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={refreshLogs}
              disabled={loading}
              title="刷新"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-3.5 w-3.5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-muted/5">
          <ScrollArea className="h-full">
            {/* 列表内边距 p-3 */}
            <div className="p-3">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground space-y-1.5">
                  <History className="h-6 w-6 opacity-20" />
                  <p className="text-[10px]">暂无记录</p>
                </div>
              ) : (
                // 列表间距 space-y-3
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex flex-col space-y-1.5">
                      
                      {/* 第一行：消息 + 标签 */}
                      <div className="flex items-start justify-between gap-2">
                        {/* 消息主体 text-xs */}
                        <span className="text-xs font-medium text-foreground leading-snug break-all">
                          {log.message}
                        </span>
                        {log.operationType && (
                          <span className={cn(
                            "flex-shrink-0 inline-flex items-center px-1 py-0 rounded-[3px] text-[9px] font-medium border uppercase tracking-wider",
                            "bg-muted text-muted-foreground border-border"
                          )}>
                            {log.operationType}
                          </span>
                        )}
                      </div>
                      
                      {/* 第二行：时间 + 操作人 text-[10px] */}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {log.timestamp}
                        </span>
                        {log.operatorName && (
                          <>
                            <span className="text-border">|</span>
                            <span className="flex items-center gap-0.5">
                              <User className="h-2.5 w-2.5" />
                              {log.operatorName}
                            </span>
                          </>
                        )}
                      </div>

                      {/* 详情卡片: 极简边框风格 */}
                      {log.rawAllocationResult && (
                        <div className="mt-0.5 rounded border border-border bg-card p-2 text-xs">
                            {/* 这里的 Card 如果内部自带 padding，可能需要去 Card 组件里也调整一下 */}
                            <AllocationResultCard 
                              rawAllocationResult={log.rawAllocationResult}
                            />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer: 高度压缩 h-9 */}
        <div className="border-t bg-background px-3 h-9 flex items-center justify-between z-10 text-[10px]">
          <span className="text-muted-foreground">
             {pageNum + 1} / {Math.ceil(total / pageSize)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => handlePageChange(pageNum - 1)}
              disabled={pageNum <= 0 || loading}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => handlePageChange(pageNum + 1)}
              disabled={(pageNum + 1) * pageSize >= total || loading}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
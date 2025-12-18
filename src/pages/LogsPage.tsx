import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogStore } from "@/store/useLogStore";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { AllocationResultCard } from "@/components/log/AllocationResultCard";
import type { LaborAllocationLogQueryDTO } from "@/types/api";

export default function LogsPage() {
  const { initializeAuth } = useAuthStore();
  
  // 日志相关状态
  const { logs, loading, total, pageNum, pageSize, fetchLogs, addLog, setPage } = useLogStore();
  
  // 查询参数
  const [queryParams, setQueryParams] = useState<LaborAllocationLogQueryDTO>({
    pageNum: 1,
    pageSize: 5
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 初始化时加载日志
  useEffect(() => {
    if (!loading && logs.length === 0) {
      fetchLogs(queryParams);
    }
  }, []);

  // 监听查询参数变化时重新加载日志
  useEffect(() => {
    fetchLogs(queryParams);
  }, [queryParams.pageNum, queryParams.pageSize]);

  // 刷新日志
  const refreshLogs = () => {
    if (!loading) {
      fetchLogs(queryParams);
      addLog("success", "日志刷新成功");
    }
  };

  const handlePageChange = (newPageNum: number, newPageSize?: number) => {
    if (loading) return; // 防止在加载时重复请求
    
    const newParams = {
      ...queryParams,
      pageNum: newPageNum,
      pageSize: newPageSize || pageSize
    };
    setQueryParams(newParams);
    setPage(newPageNum, newPageSize || pageSize);
  };

  // 获取日志类型对应的颜色
  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">操作日志</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* Logs List */}
        <Card className="h-[calc(100vh-200px)]">
          <ScrollArea className="h-full p-4">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>暂无日志记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Badge className={getLogColor(log.type)}>
                      {log.type === "info" ? "信息" : log.type === "success" ? "成功" : log.type === "warning" ? "警告" : "错误"}
                    </Badge>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{log.timestamp}</span>
                        {log.operatorName && <span>操作员: {log.operatorName}</span>}
                        {log.operationType && <span>类型: {log.operationType}</span>}
                      </div>
                      {log.rawAllocationResult && (
                        <AllocationResultCard 
                          rawAllocationResult={log.rawAllocationResult}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              共 {total} 条记录，当前第 {pageNum} 页
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNum - 1)}
                disabled={pageNum <= 1 || loading}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNum + 1)}
                disabled={pageNum * pageSize >= total || loading}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
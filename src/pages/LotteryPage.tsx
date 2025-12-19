import { useEffect, useState } from "react";
import {
  LaborExtractionSection,
  type AllocationResult,
} from "@/components/labor/LaborExtractionSection";
import { LogsDrawer } from "@/components/log/LogsDrawer";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export default function LotteryPage() {
  const { initializeAuth } = useAuthStore();
  const { fetchUsers } = useUserStore();
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  
  useEffect(() => {
    initializeAuth();
    fetchUsers();
  }, [initializeAuth, fetchUsers]);
  const handleAllocationComplete = (_result: AllocationResult) => {
  };
  return (
    <div className="h-full p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">工作抓阄系统</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogsDialogOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            操作日志
          </Button>
        </div>
        <LaborExtractionSection
          onAllocationComplete={handleAllocationComplete}
        />
      </div>
      <LogsDrawer 
        open={logsDialogOpen} 
        onOpenChange={setLogsDialogOpen} 
      />
    </div>
  );
}
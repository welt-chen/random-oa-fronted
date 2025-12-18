import { useEffect } from "react";
import {
  LaborExtractionSection,
  type AllocationResult,
} from "@/components/labor/LaborExtractionSection";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export default function LotteryPage() {
  // 认证状态初始化
  const { initializeAuth } = useAuthStore();
  
  // 用户数据管理
  const { users, fetchUsers } = useUserStore();

  // 初始化认证状态和用户数据
  useEffect(() => {
    initializeAuth();
    fetchUsers(); // 获取用户数据
  }, [initializeAuth, fetchUsers]);

  // 处理分配完成
  const handleAllocationComplete = (_result: AllocationResult) => {
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-4">
        <LaborExtractionSection
          onAllocationComplete={handleAllocationComplete}
          users={users}
        />
      </div>
    </div>
  );
}
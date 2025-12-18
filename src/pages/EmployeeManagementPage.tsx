import { useEffect } from "react";
import { UserManagementSection } from "@/components/usermanage/UserManagementSection";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export default function EmployeeManagementPage() {
  // 认证状态初始化
  const { initializeAuth } = useAuthStore();
  const { fetchUsers } = useUserStore();
  // 初始化认证状态和数据
  useEffect(() => {
    initializeAuth();
    fetchUsers();
  }, [initializeAuth, fetchUsers]);

  return (
    <div className="h-full p-6">
      <div className="space-y-4">
        <UserManagementSection />
      </div>
    </div>
  );
}
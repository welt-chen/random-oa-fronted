import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";
import { UserTable, type User, Position } from "./UserTable";
import { UserDialog } from "./UserDialog";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

export function UserManagementSection() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const { user: currentAuthUser } = useAuthStore();
  
  // 检查当前用户是否为HR
  const isHR = currentAuthUser?.jobPosition === Position.HR;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);



  // 添加用户
  const handleAddUser = () => {
    setCurrentUser(null);
    setDialogOpen(true);
  };

  // 编辑用户
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setDialogOpen(true);
  };

  // 删除用户
  const handleDelete = (user: User) => {
    if (!isHR) {
      toast.error("只有HR岗位才能删除用户", {
        description: "请联系人事部门进行操作",
        duration: 3000,
      });
      return;
    }
    
    deleteUser(user.id).then((success) => {
      if (success) toast.success("删除成功");
    });
  };

  // 保存用户（添加或编辑）
  const handleSave = async (user: User) => {
    let success = false;
    if (currentUser) {
      // 更新现有用户
      success = await updateUser({
        id: user.id,
        realName: user.realName,
        birthDate: user.birthDate,
        laborValue: user.laborValue,
        injuryStatus: user.injuryStatus,
        jobPosition: user.jobPosition,
      });
      if (success) toast.success("更新成功");
    } else {
      // 添加新用户
      success = await addUser({
        realName: user.realName,
        gender: 1, // 默认值
        birthDate: user.birthDate,
        jobPosition: user.jobPosition,
        laborValue: user.laborValue,
        injuryStatus: user.injuryStatus,
      });
      if (success) toast.success("创建成功");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">用户管理</h1>
        <p className="text-sm text-muted-foreground">管理系统用户信息</p>
      </div>

      {/* 用户表格 */}
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} isHR={isHR} />

      {/* 底部信息和添加按钮 */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {users.length} 个用户
        </div>
        <Button size="sm" onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          添加用户
        </Button>
      </div>

      {/* 用户对话框 */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={currentUser}
        onSave={handleSave}
      />
    </div>
  );
}

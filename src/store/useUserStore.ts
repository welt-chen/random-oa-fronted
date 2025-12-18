import { create } from "zustand";
import { getUserList, createUser, updateUser, deleteUser } from "@/api/index";
import type { UserRecordDTO, CreateUserDTO, UpdateUserDTO } from "@/types/api";
import { toast } from "sonner";
import { Position, type User } from "@/components/usermanage/UserTable";

interface UserState {
  users: User[];
  loading: boolean;
  initialized: boolean;

  fetchUsers: (force?: boolean) => Promise<void>;
  addUser: (data: CreateUserDTO) => Promise<boolean>;
  updateUser: (data: UpdateUserDTO) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

const mapDtoToUser = (dto: UserRecordDTO): User => ({
  id: dto.id,
  realName: dto.realName,
  birthDate: dto.birthDate,
  laborValue: dto.laborValue,
  injuryStatus: dto.injuryStatus,
  jobPosition: dto.jobPosition as Position,
});

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  initialized: false,

  fetchUsers: async (force = false) => {
    const { initialized, loading } = get();
    if ((initialized && !force) || loading) return;

    set({ loading: true });
    try {
      const response = await getUserList({
        pageNum: 0,
        pageSize: 15
      });
      const userList = response.result.records.map(mapDtoToUser);
      set({ users: userList, initialized: true });
    } catch (error) {
      console.error("加载用户列表失败:", error);
      toast.error("加载用户列表失败");
    } finally {
      set({ loading: false });
    }
  },

  addUser: async (data: CreateUserDTO) => {
    try {
      await createUser(data);
      // 重新获取列表
      await get().fetchUsers(true);
      return true;
    } catch (error) {
      console.error("创建用户失败:", error);
      toast.error("创建用户失败");
      return false;
    }
  },

  updateUser: async (data: UpdateUserDTO) => {
    try {
      await updateUser(data);
      await get().fetchUsers(true);
      return true;
    } catch (error) {
      console.error("更新用户失败:", error);
      toast.error("更新用户失败");
      return false;
    }
  },
  deleteUser: async (id: number) => {
    try {
      // 调用删除用户API
      await deleteUser(id);
      
      // 更新本地状态
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      return true;
    } catch (error) {
      toast.error("删除用户失败，请稍后重试");
      return false;
    }
  },
}));

import { create } from "zustand";
import {
  getLaborProjectList,
  createLaborProject,
  updateLaborProject,
  deleteLaborProject,
} from "@/api/index";
import type {
  LaborProjectRecordDTO,
  CreateLaborProjectDTO,
  UpdateLaborProjectDTO,
} from "@/types/api";
import { toast } from "sonner";

interface ProjectState {
  projects: LaborProjectRecordDTO[];
  loading: boolean;
  initialized: boolean;

  fetchProjects: (force?: boolean) => Promise<void>;
  addProject: (data: CreateLaborProjectDTO) => Promise<boolean>;
  updateProject: (data: UpdateLaborProjectDTO) => Promise<boolean>;
  deleteProject: (id: number) => Promise<boolean>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  initialized: false,

  fetchProjects: async (force = false) => {
    const { initialized, loading } = get();
    if ((initialized && !force) || loading) return;

    set({ loading: true });
    try {
      const response = await getLaborProjectList();
      set({ projects: response.result, initialized: true });
    } catch (error) {
      console.error("加载项目列表失败:", error);
      toast.error("加载项目列表失败");
    } finally {
      set({ loading: false });
    }
  },

  addProject: async (data: CreateLaborProjectDTO) => {
    try {
      await createLaborProject(data);
      await get().fetchProjects(true);
      return true;
    } catch (error) {
      console.error("创建项目失败:", error);
      return false;
    }
  },

  updateProject: async (data: UpdateLaborProjectDTO) => {
    try {
      await updateLaborProject(data);
      await get().fetchProjects(true);
      return true;
    } catch (error) {
      console.error("更新项目失败:", error);
      return false;
    }
  },

  deleteProject: async (id: number) => {
    try {
      await deleteLaborProject(id);
      await get().fetchProjects(true);
      return true;
    } catch (error) {
      console.error("删除项目失败:", error);
      return false;
    }
  },
}));

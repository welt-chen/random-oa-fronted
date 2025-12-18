import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";
import type { LaborProjectRecordDTO } from "@/types/api";
import { ProjectStatus } from "./LaborProjectTable";
import { LaborProjectListDialog } from "./LaborProjectListDialog";
import { LaborProjectDialog } from "./LaborProjectDialog";
import { InjuryStatus, type User } from "../usermanage/UserTable";
import { allocateLabor } from "@/api/index";
import { useProjectStore } from "@/store/useProjectStore";
import { useUserStore } from "@/store/useUserStore";

interface LaborExtractionSectionProps {
  onAllocationComplete: (result: AllocationResult) => void;
  users?: User[];
}

export interface AllocationResult {
  allocationResults: Array<{
    projectId: number;
    projectName: string;
    projectDescription: string;
    requiredLaborValue: number;
    allocatedEmployees: Array<{
      employeeId: number;
      employeeName: string;
      projectLaborValue: number;
      totalLaborValue: number;
      allocatedLaborValue: number;
    }>;
    totalLaborValue: number;
    difference: number;
  }>;
  totalProjects: number;
  allocationTime: string;
}

export function LaborExtractionSection({
  onAllocationComplete,
  users = [],
}: LaborExtractionSectionProps) {
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const { users: storeUsers, fetchUsers } = useUserStore();

  const actualUsers = users.length > 0 ? users : storeUsers;

  const [projectListOpen, setProjectListOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] =
    useState<LaborProjectRecordDTO | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationResult, setAllocationResult] =
    useState<AllocationResult | null>(null);
  
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
    fetchProjects();
  }, [users.length, fetchUsers, fetchProjects]);

  const handleAddProject = () => {
    setCurrentProject(null);
    setProjectDialogOpen(true);
  };

  // 编辑劳动项目
  const handleEditProject = (project: LaborProjectRecordDTO) => {
    setCurrentProject(project);
    setProjectDialogOpen(true);
  };

  // 删除劳动项目
  const handleDeleteProject = async (project: LaborProjectRecordDTO) => {
    await deleteProject(project.id);
  };

  const handleSaveProject = async () => {
    await fetchProjects(true);
  };

  // 执行劳动分配
  const handleAllocateLabor = async () => {
    const pendingProjects = projects.filter(
      (p) => p.status === ProjectStatus.PENDING
    );

    if (pendingProjects.length === 0) {
      toast.warning("没有待分配的项目");
      return;
    }

    // 获取所有健康状态的用户 
    const availableUsers = actualUsers.filter(
      (u) =>
        u.injuryStatus === InjuryStatus.HEALTHY ||
        u.injuryStatus === InjuryStatus.MINOR_INJURY
    );

    if (availableUsers.length === 0) {
      toast.error("没有可用的员工");
      return;
    }

    setIsAllocating(true);

    try {
      // 调用批量分配接口，一次性分配所有待分配项目
      const response = await allocateLabor({}); // 空对象表示分配所有待分配项目

      // 检查后端返回的status，0表示成功
      if (response.status === 0) {
        // 直接使用后端返回的完整数据结构
        const result: AllocationResult = response.result;
        
        setAllocationResult(result);
        onAllocationComplete(result);

        // 计算总分配员工数量
        const totalEmployees = result.allocationResults.reduce((sum, project) => 
          sum + project.allocatedEmployees.length, 0
        );
        
        toast.success("分配成功", {
          description: `成功分配 ${result.totalProjects} 个项目，共 ${totalEmployees} 名员工`,
        });

        // 重新加载项目列表
        await fetchProjects(true);
      } else {
        // status不为0，表示后端返回了错误
        console.error("分配失败，后端返回status:", response.status, "消息:", response.msg);
        toast.error("分配失败", {
          description: response.msg || "未知错误",
        });
      }
    } catch (error) {
      console.error("分配失败:", error);
      toast.error("分配失败", {
        description: "网络请求失败",
      });
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">工作抓阄系统</h1>
        <p className="text-sm text-muted-foreground">
          通过智能算法进行公平的劳动分配
        </p>
      </div>

      <div className="space-y-6">
        {/* 项目统计信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">总项目数</div>
            <div className="text-2xl font-bold">{projects.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">待分配</div>
            <div className="text-2xl font-bold text-yellow-600">
              {
                projects.filter((p) => p.status === ProjectStatus.PENDING)
                  .length
              }
            </div>
          </div>
        </div>

        {/* 项目管理和操作区域 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              共 {projects.length} 个项目
            </div>
            <Button
              size="sm"
              onClick={handleAllocateLabor}
              disabled={
                isAllocating ||
                projects.filter((p) => p.status === ProjectStatus.PENDING)
                  .length === 0
              }
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isAllocating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  分配中...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  开始抓阄
                </>
              )}
            </Button>
          </div>
        </div>
        {/* 分配结果展示 */}
        {allocationResult && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">抓阄结果</h3>

            <div className="space-y-3">
              {allocationResult.allocationResults.map((project, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <h5 className="font-semibold mb-2">{project.projectName}</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.allocatedEmployees.map((emp, empIndex) => (
                      <span
                        key={empIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                      >
                        {emp.employeeName}
                      </span>
                    ))}
                    {project.allocatedEmployees.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        暂无分配
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 项目列表对话框 */}
      <LaborProjectListDialog
        onAdd={handleAddProject}
        open={projectListOpen}
        onOpenChange={setProjectListOpen}
        projects={projects}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* 项目编辑对话框 */}
      <LaborProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={currentProject}
        onSave={handleSaveProject}
      />
    </div>
  );
}

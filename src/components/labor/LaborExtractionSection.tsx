import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";
import Lottie from "lottie-react";
import catLoadingAnimation from "@/lottie/cat Mark loading.json";
import { ProjectStatus } from "./LaborProjectTable";
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
  const { projects, fetchProjects } = useProjectStore();
  const { users: storeUsers, fetchUsers } = useUserStore();

  const actualUsers = users.length > 0 ? users : storeUsers;

  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationResult, setAllocationResult] =
    useState<AllocationResult | null>(null);

  // 清除缓存的函数
  const clearCachedResult = () => {
    sessionStorage.removeItem('lotteryAllocationResult');
    setAllocationResult(null);
    console.log('已清除sessionStorage中的抽签结果缓存');
  };
  
  // 从sessionStorage恢复缓存的抽签结果
  useEffect(() => {
    const cachedResult = sessionStorage.getItem('lotteryAllocationResult');
    if (cachedResult) {
      try {
        const parsedResult = JSON.parse(cachedResult);
        setAllocationResult(parsedResult);
        console.log('已从sessionStorage恢复抽签结果缓存');
      } catch (error) {
        console.warn('解析缓存的抽签结果失败:', error);
        sessionStorage.removeItem('lotteryAllocationResult');
      }
    }
  }, []);
  
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
    fetchProjects();
  }, [users.length, fetchUsers, fetchProjects]);

  const handleAllocateLabor = async () => {
    const pendingProjects = projects.filter(
      (p) => p.status === ProjectStatus.PENDING
    );

    if (pendingProjects.length === 0) {
      toast.warning("没有待分配的项目");
      return;
    }

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
      const response = await allocateLabor({}); 
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (response.status === 0) {
        const result: AllocationResult = response.result;
        setAllocationResult(result);
        onAllocationComplete(result);
        
        // 将结果缓存到sessionStorage
        try {
          sessionStorage.setItem('lotteryAllocationResult', JSON.stringify(result));
          console.log('抽签结果已缓存到sessionStorage');
        } catch (error) {
          console.warn('缓存抽签结果失败:', error);
        }
        
        const totalEmployees = result.allocationResults.reduce((sum, project) => 
          sum + project.allocatedEmployees.length, 0
        );
        toast.success("分配成功", {
          description: `成功分配 ${result.totalProjects} 个项目，共 ${totalEmployees} 名员工`,
        });
        await fetchProjects(true);
      } else {
        toast.error("分配失败", {
          description: response.msg || "未知错误",
        });
      }
    } catch (error) {
      toast.error("分配失败", {
        description: "网络请求失败",
      });
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="relative">
      {/* 全屏Lottie动画遮罩 */}
      {isAllocating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center space-y-4 max-w-sm">
            <div className="w-32 h-32">
              <Lottie animationData={catLoadingAnimation} loop={true} />
            </div>
            <div className="text-lg font-semibold">正在抓阄分配中...</div>
            <div className="text-sm text-muted-foreground">猫咪正在努力为您分配工作，请稍候</div>
          </div>
        </div>
      )}
      
      <div>
        <div className="mb-6">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">抓阄结果</h3>
                <Button
                  size="sm"
                  onClick={clearCachedResult}
                  className="text-muted-foreground"
                >
                  重新分配
                </Button>
              </div>

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
      </div>
    </div>
  );
}

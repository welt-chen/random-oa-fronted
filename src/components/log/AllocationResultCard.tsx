import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronRight, Users, Target, TrendingUp } from "lucide-react";

interface AllocationEmployee {
  employeeId: number;
  employeeName: string;
  totalLaborValue: number;
  projectLaborValue: number;
  allocatedLaborValue: number;
}

interface AllocationProject {
  projectId: number;
  projectName?: string;
  projectDescription?: string;
  requiredLaborValue?: number;
  totalLaborValue?: number;
  difference?: number;
  allocatedEmployees?: AllocationEmployee[];
  allocatedEmployeeIds?: number[];
}

interface AllocationResultCardProps {
  rawAllocationResult: string;
  className?: string;
}

export function AllocationResultCard({ rawAllocationResult, className = "" }: AllocationResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allocationData, setAllocationData] = useState<AllocationProject[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  const parseAllocationData = () => {
    if (!isParsed) {
      try {
        const parsed = JSON.parse(rawAllocationResult);
        if (Array.isArray(parsed)) {
          setAllocationData(parsed);
        }
        setIsParsed(true);
      } catch (error) {
        console.error('解析分配结果失败:', error);
      }
    }
    setIsOpen(!isOpen);
  };

  const getDifferenceColor = (difference?: number) => {
    if (!difference) return "text-gray-500";
    if (difference > 0) return "text-red-600";
    if (difference < 0) return "text-green-600";
    return "text-blue-600";
  };

  const getDifferenceText = (difference?: number) => {
    if (!difference) return "无差异";
    if (difference > 0) return `超配 ${difference}`;
    if (difference < 0) return `缺配 ${Math.abs(difference)}`;
    return "正好";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={parseAllocationData}
          className={`mt-2 w-full justify-start p-2 h-auto ${className}`}
        >
          <div className="flex items-center space-x-2 text-sm">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium text-muted-foreground hover:text-foreground">
              查看详细分配结果
            </span>
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <Card className="p-4 bg-muted/50">
          {allocationData.length > 0 ? (
            <div className="space-y-4">
              {allocationData.map((project, index) => (
                <div key={index} className="space-y-3">
                  {/* 项目基本信息 */}
                  <div className="border-b pb-3">
                    <div className="mb-2">
                      <h4 className="font-semibold text-sm flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>{project.projectName || project.projectDescription || `项目 ${project.projectId}`}</span>
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Target className="h-3 w-3 text-blue-500" />
                        <span>需求: {project.requiredLaborValue || project.totalLaborValue || 0} 劳力值</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className={`h-3 w-3 ${getDifferenceColor(project.difference)}`} />
                        <span className={getDifferenceColor(project.difference)}>
                          {getDifferenceText(project.difference)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-green-500" />
                        <span>
                          分配: {
                            project.allocatedEmployees 
                              ? project.allocatedEmployees.length 
                              : project.allocatedEmployeeIds?.length || 0
                          } 人
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 分配的员工详情 */}
                  {project.allocatedEmployees && project.allocatedEmployees.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-muted-foreground">分配员工详情:</h5>
                      <div className="space-y-2">
                        {project.allocatedEmployees.map((employee, empIndex) => (
                          <div key={empIndex} className="bg-background p-2 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{employee.employeeName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-1 text-xs text-muted-foreground">
                              <span>总劳力: {employee.totalLaborValue}</span>
                              <span>项目劳力: {employee.projectLaborValue}</span>
                              <span>分配劳力: {employee.allocatedLaborValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 如果只有员工ID列表 */}
                  {project.allocatedEmployeeIds && project.allocatedEmployeeIds.length > 0 && !project.allocatedEmployees && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-muted-foreground">分配的员工:</h5>
                      <div className="text-xs text-muted-foreground">
                        共 {project.allocatedEmployeeIds.length} 人
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">无法解析分配数据:</p>
              <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-background p-2 rounded border max-h-40 overflow-auto">
                {rawAllocationResult}
              </pre>
            </div>
          )}
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
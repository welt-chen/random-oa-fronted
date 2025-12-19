import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2 } from "lucide-react";
import type { LaborProjectRecordDTO } from "@/types/api";
import { useProjectStore } from "@/store/useProjectStore";

interface LaborProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: LaborProjectRecordDTO | null;
  onSave: () => void;
}

export function LaborProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: LaborProjectDialogProps) {
  const isEdit = !!project;
  const [isLoading, setIsLoading] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState({
    projectName: "",
    workDescription: "",
    requiredLaborValue: 0,
  });

  // 当项目数据变化时更新表单
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName,
        workDescription: project.workDescription,
        requiredLaborValue: project.requiredLaborValue,
      });
    } else {
      // 重置表单
      setFormData({
        projectName: "",
        workDescription: "",
        requiredLaborValue: 0,
      });
    }
  }, [project]);

  const { addProject, updateProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!formData.projectName.trim()) {
      toast.error("请输入项目名称");
      return;
    }

    if (formData.requiredLaborValue < 0 || formData.requiredLaborValue > 300) {
      toast.error("所需劳动值必须在0-300之间");
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      if (isEdit && project) {
        // 更新项目
        success = await updateProject({
          id: project.id,
          projectName: formData.projectName,
          workDescription: formData.workDescription,
          requiredLaborValue: formData.requiredLaborValue,
        });
        if (success) {
          toast.success("更新成功", {
            description: `${formData.projectName} 已更新`,
          });
          onOpenChange(false);
        } else {
          toast.error("更新失败");
        }
      } else {
        success = await addProject({
          projectName: formData.projectName,
          workDescription: formData.workDescription,
          requiredLaborValue: formData.requiredLaborValue,
        });
        if (success) {
          toast.success("创建成功");
          setFormData({
            projectName: "",
            workDescription: "",
            requiredLaborValue: 0,
          });
        } else {
          toast.error("创建失败");
        }
      }

      if (success) {
        onSave();
      }
    } catch (error) {
      console.error(isEdit ? "更新项目失败:" : "创建项目失败:", error);
      toast.error(isEdit ? "更新失败" : "创建失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑劳动项目" : "创建劳动项目"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "修改劳动项目信息" : "填写新劳动项目的详细信息"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">项目名称 *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                placeholder="请输入项目名称（1-100个字符）"
                disabled={isLoading}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDescription">工作描述</Label>
              <Textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) =>
                  setFormData({ ...formData, workDescription: e.target.value })
                }
                placeholder="请输入工作描述（最多500个字符）"
                disabled={isLoading}
                maxLength={500}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredLaborValue">所需劳动值 *</Label>
              <Input
                id="requiredLaborValue"
                type="number"
                value={formData.requiredLaborValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiredLaborValue: Number(e.target.value),
                  })
                }
                placeholder="请输入所需劳动值"
                disabled={isLoading}
                min="0"
                max="300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "保存"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

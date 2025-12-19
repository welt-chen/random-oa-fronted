import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { LaborProjectDialog } from "@/components/labor/LaborProjectDialog";
import { LaborProjectListDialog } from "@/components/labor/LaborProjectListDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2, Users } from "lucide-react";

export default function ProjectManagementPage() {
  const { projects, fetchProjects, loading, deleteProject } = useProjectStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">待分配</Badge>;
      case 1:
        return <Badge variant="default">已分配</Badge>;
      case 2:
        return <Badge variant="outline">已完成</Badge>;
      default:
        return <Badge variant="destructive">未知</Badge>;
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm("确定要删除这个项目吗？")) {
      try {
        await deleteProject(projectId);
        fetchProjects();
      } catch (error) {
        console.error("删除项目失败:", error);
      }
    }
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
        <h1 className="text-2xl font-bold mb-1">项目管理</h1>
            <p className="text-muted-foreground">
              创建、编辑和管理劳动项目
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsListDialogOpen(true)} variant="outline">
              <Users className="mr-2 h-4 w-4" />
              查看所有项目
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.projectName}</CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription>
                  创建时间: {new Date(project.createTime).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>所需劳动值:</span>
                    <span className="font-medium">{project.requiredLaborValue}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.workDescription || "暂无描述"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">暂无项目</h3>
            <p className="text-muted-foreground mb-4">还没有创建任何劳动项目</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建第一个项目
            </Button>
          </div>
        )}
      </div>

      <LaborProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        project={editingProject}
        onSave={handleDialogClose}
      />

      <LaborProjectListDialog
        open={isListDialogOpen}
        onOpenChange={setIsListDialogOpen}
        projects={projects}
        onAdd={() => {
          setIsListDialogOpen(false);
          setIsCreateDialogOpen(true);
        }}
        onEdit={(project) => {
          setIsListDialogOpen(false);
          handleEditProject(project);
        }}
        onDelete={(project) => {
          handleDeleteProject(project.id);
        }}
      />
    </div>
  );
}
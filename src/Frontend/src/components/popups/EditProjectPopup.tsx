// ============================================================================
// EditProjectPopup - Edit project details and manage roles
// Allows project owners to update title, description, status, and role assignments.
// Calls updateProject API when saved (mock for now, Supabase later).
// ============================================================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Project, ProjectRole, ProjectStatus } from "@/lib/types";
import { updateProject } from "@/lib/api";
import { toast } from "sonner";

interface EditProjectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSave: (updatedProject: Project) => void;
}

const EditProjectPopup = ({ open, onOpenChange, project, onSave }: EditProjectPopupProps) => {
  // State for editable project fields
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  // State for roles array - owner can manage assignments and filled status
  const [roles, setRoles] = useState<ProjectRole[]>(project.roles || []);
  const [saving, setSaving] = useState(false);

  // Sync state with prop changes (when a different project is selected)
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description);
    setStatus(project.status);
    setRoles(project.roles || []);
  }, [project]);

  // Add a new empty role
  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        id: `role-${Date.now()}`,
        title: "",
        description: "",
        filled: false,
      },
    ]);
  };

  // Update a role field (title, description, filled status)
  const handleUpdateRole = (index: number, field: keyof ProjectRole, value: string | boolean) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setRoles(updatedRoles);
  };

  // Update the assignee for a role (parse text input into UserRef object)
  const handleUpdateRoleAssignee = (index: number, value: string) => {
    const updatedRoles = [...roles];
    if (value.trim()) {
      // Simple parsing logic: treat as email if contains @, otherwise display name
      const isEmail = value.includes('@');
      updatedRoles[index] = {
        ...updatedRoles[index],
        assignee: {
          id: `user-${Math.random().toString(36).substr(2, 9)}`, // Generate a temp ID
          displayName: isEmail ? value.split('@')[0] : value,
          email: isEmail ? value : `${value.toLowerCase().replace(/\s+/g, "")}@ucdavis.edu`,
        },
      };
    } else {
      updatedRoles[index] = {
        ...updatedRoles[index],
        assignee: undefined,
      };
    }
    setRoles(updatedRoles);
  };

  // Remove a role
  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Save changes to the project
  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: This will call real Supabase update when backend is connected
      const updatedProject = await updateProject(project.id, {
        title,
        description,
        status,
        roles,
      });

      onSave(updatedProject);
      toast.success("Project updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="sm:max-w-[600px] rounded-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2C2B28]">
            Edit Project
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#2C2B28]">
              Project Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#2C2B28]">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[#2C2B28]">
              Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
              <SelectTrigger className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#FAFAF7] border-[#E0D7C8]">
                <SelectItem value="open" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A9C4A4]" />
                    <span>Open</span>
                  </div>
                </SelectItem>
                <SelectItem value="in-progress" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FCE58B]" />
                    <span>In Progress</span>
                  </div>
                </SelectItem>
                <SelectItem value="completed" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F1998D]" />
                    <span>Completed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-[#2C2B28]">Roles</Label>
            <div className="space-y-4">
              {roles.map((role, index) => (
                <div
                  key={role.id}
                  className="bg-[#FAFAF7] border border-[#E0D7C8] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-[#2C2B28]">
                      Role {index + 1}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveRole(index)}
                      className="h-6 w-6 p-0 hover:bg-red-50"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-title-${index}`} className="text-xs text-[#6B6B68]">
                      Role Title
                    </Label>
                    <Input
                      id={`role-title-${index}`}
                      value={role.title}
                      onChange={(e) => handleUpdateRole(index, "title", e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="bg-white border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-desc-${index}`} className="text-xs text-[#6B6B68]">
                      Description
                    </Label>
                    <Textarea
                      id={`role-desc-${index}`}
                      value={role.description}
                      onChange={(e) => handleUpdateRole(index, "description", e.target.value)}
                      placeholder="Describe what this role involves..."
                      className="bg-white border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg min-h-[80px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`role-filled-${index}`} className="text-xs text-[#6B6B68]">
                      Filled?
                    </Label>
                    <Switch
                      id={`role-filled-${index}`}
                      checked={role.filled}
                      onCheckedChange={(checked) => handleUpdateRole(index, "filled", checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-assignee-${index}`} className="text-xs text-[#6B6B68]">
                      Assigned to
                    </Label>
                    <Input
                      id={`role-assignee-${index}`}
                      value={role.assignee ? (role.assignee.email || role.assignee.displayName) : ""}
                      onChange={(e) => handleUpdateRoleAssignee(index, e.target.value)}
                      placeholder="e.g. alice@ucdavis.edu or Alice Chen"
                      className="bg-white border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddRole}
                className="w-full rounded-lg border-[#E0D7C8] border-dashed text-[#2C2B28] hover:bg-[#A9C4A4]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add role
              </Button>
            </div>
          </div>
        </div>
        </ScrollArea>
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E0D7C8]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-[#E0D7C8] text-[#2C2B28]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#A9C4A4] text-[#1F3A26] hover:bg-[#A9C4A4]/90"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectPopup;

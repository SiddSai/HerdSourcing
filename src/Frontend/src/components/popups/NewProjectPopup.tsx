// ============================================================================
// NewProjectPopup - Create a new project with roles
// Allows users to define project details and initial roles on creation.
// Calls createProject API when submitted (mock for now, Supabase later).
// ============================================================================

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ProjectRole, ProjectStatus } from "@/lib/types";
import { createProject } from "@/lib/api";
import { toast } from "sonner";

interface NewProjectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void; // Callback to refresh project list
}

const NewProjectPopup = ({ open, onOpenChange, onProjectCreated }: NewProjectPopupProps) => {
  // State for project fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("open");
  // State for roles array - each role has title, description, filled=false by default
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [saving, setSaving] = useState(false);

  // Add a new empty role to the list
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

  // Update a field of a role (title, description, filled)
  const handleUpdateRole = (index: number, field: keyof ProjectRole, value: string | boolean) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setRoles(updatedRoles);
  };

  // Remove a role from the list
  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Handle project creation - calls API and closes popup
  const handleCreate = async () => {
    // Validate required fields
    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a project description");
      return;
    }

    setSaving(true);
    try {
      // TODO: This will call real Supabase insert when backend is connected
      await createProject({
        title: title.trim(),
        description: description.trim(),
        status,
        roles: roles.map((r) => ({ title: r.title, description: r.description })),
      });

      toast.success("Project created successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("open");
      setRoles([]);
      onOpenChange(false);
      
      // Trigger parent refresh
      onProjectCreated?.();
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="sm:max-w-[600px] rounded-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2C2B28]">
            Create a New Project
          </DialogTitle>
          <DialogDescription className="text-[#6B6B6B]">
            Start a new project and invite team members to collaborate.
          </DialogDescription>
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
              placeholder="Enter project name..."
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#2C2B28]">
              Short Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg min-h-[100px]"
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
            <Label className="text-[#2C2B28]">Roles (optional)</Label>
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
            onClick={handleCreate}
            disabled={saving}
            className="rounded-full bg-[#A9C4A4] text-[#1F3A26] hover:bg-[#A9C4A4]/90"
          >
            {saving ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectPopup;

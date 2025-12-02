// ============================================================================
// ProjectCard - Displays a project in card format
// Used in Project Pasture grid view. Shows title, status, description, tags.
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Project } from "@/lib/types";

// Re-export types for backwards compatibility
export type { UserRef, ProjectRole as Role, Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void; // Optional edit callback for owner
  onOpenProfile?: (userId: string) => void; // Callback to open user profile popup
}

const ProjectCard = ({ project, onEdit, onOpenProfile }: ProjectCardProps) => {
  const statusClasses = {
    open: "inline-flex items-center rounded-full bg-[#A9C4A4] text-[#1F3A26] text-xs font-medium px-3 py-1",
    "in-progress": "inline-flex items-center rounded-full bg-[#FCE58B] text-[#854D0E] text-xs font-medium px-3 py-1",
    completed: "inline-flex items-center rounded-full bg-[#F1998D] text-[#5C1E1E] text-xs font-medium px-3 py-1",
  };

  const statusLabels = {
    open: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // Calculate role statistics
  const totalRoles = project.roles?.length || 0;
  const openRoles = project.roles?.filter(r => !r.filled).length || 0;

  return (
    <div className="bg-card rounded-xl shadow-md border border-transparent hover:border-primary/70 transition h-full flex flex-col p-6">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-foreground truncate">
            {project.title}
          </h3>
          {/* Edit button for project owners - shows next to title */}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-6 w-6 rounded-full hover:bg-primary/10 flex-shrink-0"
              title="Edit project"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
        <span className={`${statusClasses[project.status]} shrink-0`}>
          {statusLabels[project.status]}
        </span>
      </div>
      
      {/* Project owner - clickable to view profile */}
      {/* Use a larger avatar size so profile pictures are clearly visible. */}
      <div className="mb-3 flex items-center gap-2 min-w-0">
        {project.owner.avatarUrl ? (
          <img
            src={project.owner.avatarUrl}
            alt={project.owner.displayName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary-foreground flex-shrink-0">
            {project.owner.displayName.charAt(0)}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile?.(project.owner.id);
          }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline truncate"
        >
          {project.owner.displayName}
        </button>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
        {project.description}
      </p>
      
      {/* Role summary */}
      {totalRoles > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          {totalRoles} {totalRoles === 1 ? 'role' : 'roles'} • {openRoles} open
        </p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-background border border-border text-foreground rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { ProjectStatus } from "@/lib/types";

interface ProjectCardProps {
  id: string;
  status: ProjectStatus;
  title?: string;
  description?: string;
  onDelete: (id: string) => void;
}

const statusConfig = {
  brainstorming: {
    label: "Brainstorming",
    bgColor: "bg-status-brainstorming",
    textColor: "text-status-brainstorming-foreground",
  },
  recruiting: {
    label: "Recruiting",
    bgColor: "bg-status-recruiting",
    textColor: "text-status-recruiting-foreground",
  },
  progress: {
    label: "In Progress",
    bgColor: "bg-status-progress",
    textColor: "text-status-progress-foreground",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-status-completed",
    textColor: "text-status-completed-foreground",
  },
};

export const ProjectCard = ({ id, status, title, description, onDelete }: ProjectCardProps) => {
  const config = statusConfig[status];
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      {/* Detail Dialog */}
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent
              className="max-w-2xl"
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <div
                  className={cn(
                    "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium mb-4 w-fit",
                    config.bgColor,
                    config.textColor
                  )}
                >
                  {config.label}
                </div>
                <DialogTitle className="text-2xl">{title}</DialogTitle>
                <DialogDescription
                  className="text-base pt-2 whitespace-pre-wrap break-all"
                >
                  {description}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
      <div
        onClick={() => setShowDetailsDialog(true)}
        className="group w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative h-[230px] flex flex-col"

      >
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          aria-label="Delete project"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium w-fit",
            config.bgColor,
            config.textColor
          )}
        >
          {config.label}
        </div>
        
        {title && description ? (
        <div className="mt-6 space-y-2">
          <h4 className="text-lg font-semibold text-foreground line-clamp-2">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line break-words">
            {description}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <div className="h-3 w-3/4 rounded-full bg-muted"></div>
          <div className="h-3 w-full rounded-full bg-muted"></div>
          <div className="h-3 w-2/3 rounded-full bg-muted"></div>
        </div>
      )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently removed from your pasture.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

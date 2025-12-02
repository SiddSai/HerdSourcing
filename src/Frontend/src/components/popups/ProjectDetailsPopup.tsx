// ============================================================================
// ProjectDetailsPopup - Shows full project details with roles and join options
// Displays project owner, description, roles (with assignees or DM options).
// Supports both "Chat about this role" and "Request to Join" flows.
// ============================================================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, UserPlus, Flag } from "lucide-react";
import { Project, UserRef } from "@/lib/types";
import { useState } from "react";
import { reportProject } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  // Callback when user wants to chat about a role (normal DM)
  onDMAboutRole?: (projectTitle: string, roleTitle: string, projectOwner: UserRef) => void;
  // Callback when user clicks "Request to Join" (sends a special join-request message)
  onRequestToJoin?: (projectTitle: string, roleTitle: string, roleId: string, projectOwner: UserRef) => void;
  // Callback when clicking on a username to view their profile
  onViewUserProfile?: (userId: string) => void;
}

const ProjectDetailsPopup = ({
  open,
  onOpenChange,
  project,
  onDMAboutRole,
  onRequestToJoin,
  onViewUserProfile,
}: ProjectDetailsPopupProps) => {
  // State for report dialog
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();

  // Helper to render status badges with appropriate colors
  const statusClasses = {
    open: "inline-flex items-center rounded-full bg-primary text-primary-foreground text-xs font-medium px-3 py-1",
    "in-progress": "inline-flex items-center rounded-full bg-[#FCE58B] text-[#854D0E] text-xs font-medium px-3 py-1",
    completed: "inline-flex items-center rounded-full bg-[#F1998D] text-[#5C1E1E] text-xs font-medium px-3 py-1",
  };

  const statusLabels = {
    open: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // Handle clicking "Chat about this role" - opens DM with project owner
  const handleChatAboutRole = (roleTitle: string) => {
    if (onDMAboutRole) {
      onDMAboutRole(project.title, roleTitle, project.owner);
    }
  };

  // Handle clicking "Request to Join" - sends a special join-request message
  const handleRequestToJoin = (roleTitle: string, roleId: string) => {
    if (onRequestToJoin) {
      onRequestToJoin(project.title, roleTitle, roleId, project.owner);
    }
  };

  // Handle reporting a project
  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    setIsReporting(true);
    try {
      await reportProject(project.id, reportReason);
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep HerdSourcing safe. We'll review your report.",
      });
      setReportReason("");
    } catch (error) {
      console.error("Failed to report project:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showClose={false} className="sm:max-w-[600px] rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  {project.title}
                </DialogTitle>
                {/* Project owner info - clickable with avatar */}
                <div className="flex items-center gap-2 mt-2">
                  {project.owner.avatarUrl ? (
                    <img
                      src={project.owner.avatarUrl}
                      alt={project.owner.displayName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary-foreground">
                      {project.owner.displayName.charAt(0)}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    By{" "}
                    <button
                      onClick={() => onViewUserProfile?.(project.owner.id)}
                      className="hover:text-primary transition-colors underline decoration-dotted font-medium"
                    >
                      {project.owner.displayName}
                    </button>
                    {project.owner.email && (
                      <span className="text-xs ml-1">({project.owner.email})</span>
                    )}
                  </p>
                </div>
              </div>
              <span className={statusClasses[project.status]}>
                {statusLabels[project.status]}
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Description - wrapped in white card to match roles section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-foreground leading-relaxed">{project.description}</p>
              </div>
            </div>
            {/* Tags - wrapped in white card to match roles section */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-background border border-border text-foreground rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Roles section - shows open roles with DM/join options, or filled roles with assignee */}
            {project.roles && project.roles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Roles</h3>
                <div className="space-y-3">
                  {project.roles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {role.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {role.description}
                          </p>
                          {/* If role is filled, show who filled it with avatar (clickable to view profile) */}
                          {role.assignee && (
                            <div className="flex items-center gap-2 mt-2">
                              {role.assignee.avatarUrl ? (
                                <img
                                  src={role.assignee.avatarUrl}
                                  alt={role.assignee.displayName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary-foreground">
                                  {role.assignee.displayName.charAt(0)}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                <p className="font-medium">
                                  Filled by{" "}
                                  <button
                                    onClick={() => onViewUserProfile?.(role.assignee!.id)}
                                    className="hover:text-primary transition-colors underline decoration-dotted"
                                  >
                                    {role.assignee.displayName}
                                  </button>
                                </p>
                                {role.assignee.email && (
                                  <p className="opacity-80">{role.assignee.email}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* If role is not filled, show action buttons */}
                        {!role.assignee && (
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {/* Normal DM button */}
                            {onDMAboutRole && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleChatAboutRole(role.title)}
                                className="rounded-full border-primary text-foreground hover:bg-primary/10"
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Chat
                              </Button>
                            )}
                            {/* Request to Join button - sends a special join-request message */}
                            {onRequestToJoin && (
                              <Button
                                size="sm"
                                onClick={() => handleRequestToJoin(role.title, role.id)}
                                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Request
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Project Button */}
            <div className="pt-4 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive w-full"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report this project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Help us keep HerdSourcing safe. Please describe why you're reporting this project.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Reason for reporting..."
                    className="min-h-[100px]"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setReportReason("")}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleReport} disabled={isReporting}>
                      {isReporting ? "Submitting..." : "Submit Report"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetailsPopup;

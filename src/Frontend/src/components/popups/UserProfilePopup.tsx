// ============================================================================
// UserProfilePopup - View another user's profile
// Shows their basic info, skills, projects they've created/contributed to.
// Opens when clicking on a username (project owner, role assignee, DM participant).
// Includes ability to block/unblock users.
// ============================================================================

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { CurrentUser, Project } from "@/lib/types";
import { fetchUserProfile, fetchUserProjects, blockUser, unblockUser, fetchCurrentUser } from "@/lib/api";
import { Ban, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfileOverview from "@/components/ProfileOverview";

interface UserProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

const UserProfilePopup = ({ open, onOpenChange, userId }: UserProfilePopupProps) => {
  // State for the user's profile data
  const [user, setUser] = useState<CurrentUser | null>(null);
  // State for projects created and contributed to by this user
  const [projects, setProjects] = useState<{ created: Project[]; contributed: Project[] }>({
    created: [],
    contributed: [],
  });
  // Loading state while fetching data
  const [loading, setLoading] = useState(false);
  // Track if current user has blocked this user
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  // Load user profile and projects when popup opens or userId changes
  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      // Fetch current user to check blocked status
      // TODO: This will call real Supabase queries when backend is connected
      Promise.all([
        fetchUserProfile(userId), 
        fetchUserProjects(userId),
        fetchCurrentUser()
      ])
        .then(([profileData, projectsData, currentUserData]) => {
          setUser(profileData);
          setProjects(projectsData);
          setCurrentUser(currentUserData);
          // Check if this user is in current user's blocked list
          setIsBlocked(currentUserData.blockedUserIds?.includes(userId) || false);
        })
        .catch((error) => {
          console.error("Failed to load user profile:", error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userId, toast]);

  // State to check if viewing user is the current user (self)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const isSelf = currentUser?.id === userId;

  // Handle blocking/unblocking a user
  // Do not allow users to block themselves.
  const handleToggleBlock = async () => {
    if (!userId || isSelf) return;
    
    try {
      if (isBlocked) {
        await unblockUser(userId);
        setIsBlocked(false);
        toast({
          title: "User unblocked",
          description: "You can now see messages from this user.",
        });
      } else {
        await blockUser(userId);
        setIsBlocked(true);
        toast({
          title: "User blocked",
          description: "You will no longer see messages from this user.",
        });
      }
    } catch (error) {
      console.error("Failed to toggle block:", error);
      toast({
        title: "Error",
        description: "Failed to update block status",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showClose={false} className="sm:max-w-[600px] rounded-2xl">
          <div className="py-8 text-center text-muted-foreground">Loading profile...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="sm:max-w-[600px] rounded-2xl max-h-[80vh]">
        <DialogHeader>
          {/* Reuse ProfileOverview component with canEdit={false} for read-only display */}
          <ProfileOverview
            user={user}
            canEdit={false}
          />
          
          {/* Block/Unblock button - only show if not viewing your own profile */}
          {/* Do not allow users to block themselves. */}
          {!isSelf && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBlock}
              className="mt-4 border-border hover:bg-muted w-full"
            >
              {isBlocked ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Unblock User
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Block User
                </>
              )}
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">

            {/* Projects Created - shows what this user has started */}
            {projects.created.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Projects Created ({projects.created.length})
                </h3>
                <div className="space-y-2">
                  {projects.created.map((project) => (
                    <div
                      key={project.id}
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <h4 className="font-medium text-foreground">{project.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Contributed To - shows where this user is assigned as a role member */}
            {projects.contributed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Contributing To ({projects.contributed.length})
                </h3>
                <div className="space-y-2">
                  {projects.contributed.map((project) => (
                    <div
                      key={project.id}
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <h4 className="font-medium text-foreground">{project.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        By {project.owner.displayName}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {project.roles
                          .filter(r => r.assignee?.id === userId)
                          .map(r => (
                            <Badge key={r.id} variant="outline" className="text-xs">
                              {r.title}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfilePopup;

// ============================================================================
// ProfileOverview - Reusable profile display component
// Used for viewing your own profile in "My Profile" tab and for viewing other users' profiles.
// Can be editable (with Edit button) or read-only depending on the canEdit prop.
// ============================================================================

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

interface ProfileOverviewProps {
  user: {
    id: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    major?: string;
    year?: string;
    interests?: string;
    availability?: string;
    skills?: string[];
  };
  canEdit: boolean;
  onEdit?: () => void;
  showStats?: boolean;
  stats?: {
    projectsCreated?: number;
    projectsContributed?: number;
  };
}

// ProfileOverview is shared between the "My Profile" tab and the read-only
// user profile popup so the layout looks consistent.
const ProfileOverview = ({ user, canEdit, onEdit, showStats, stats }: ProfileOverviewProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      {/* Header with avatar and basic info */}
      <div className="flex items-start gap-4">
        {/* Use a larger avatar size so profile pictures are clearly visible. */}
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-semibold text-primary-foreground border-2 border-primary/20">
            {user.displayName.charAt(0)}
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          {user.major && (
            <p className="text-sm text-muted-foreground mt-1">
              {user.major} {user.year && `• ${user.year}`}
            </p>
          )}
        </div>

        {/* Only show Edit Profile button when canEdit is true */}
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 rounded-full"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
          <p className="text-foreground leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="bg-card border-border text-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {user.interests && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Interests</h3>
          <p className="text-foreground">{user.interests}</p>
        </div>
      )}

      {/* Availability */}
      {user.availability && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Availability</h3>
          <p className="text-foreground">{user.availability}</p>
        </div>
      )}

      {/* Stats - only shown when showStats is true */}
      {showStats && stats && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.projectsCreated !== undefined && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-semibold text-foreground">{stats.projectsCreated}</p>
                <p className="text-xs text-muted-foreground mt-1">Projects Created</p>
              </div>
            )}
            {stats.projectsContributed !== undefined && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-semibold text-foreground">{stats.projectsContributed}</p>
                <p className="text-xs text-muted-foreground mt-1">Contributing To</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;

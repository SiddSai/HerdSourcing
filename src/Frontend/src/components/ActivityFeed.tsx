// ============================================================================
// ActivityFeed - Shows recent activity across HerdSourcing
// Displays events like new projects created, join requests sent, and roles filled.
// Currently derives from projects and conversations, but can use a real event stream later.
// ============================================================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchProjects, fetchConversations } from "@/lib/api";
import { Project, Conversation, ActivityItem } from "@/lib/types";

const ActivityFeed = () => {
  // State for activity items derived from projects and messages
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  // Loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Load activity data on mount
  useEffect(() => {
    // Fetch projects and conversations to derive recent activity
    // TODO: When backend is ready, this can be replaced with a dedicated activity/events table
    Promise.all([fetchProjects(), fetchConversations()])
      .then(([projects, conversations]) => {
        const items: ActivityItem[] = [];

        // Generate activity items from recent projects
        projects
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .forEach((project) => {
            items.push({
              id: `activity-project-${project.id}`,
              type: "project-created",
              description: `${project.owner.displayName} created "${project.title}"`,
              timestamp: project.createdAt,
              projectId: project.id,
              userId: project.owner.id,
            });
          });

        // Generate activity items from join-request messages
        conversations.forEach((convo) => {
          convo.messages
            .filter((msg) => msg.type === "join-request")
            .forEach((msg) => {
              items.push({
                id: `activity-join-${msg.id}`,
                type: "join-request",
                description: `${msg.sender.displayName} sent a join request`,
                timestamp: msg.createdAt,
                projectId: msg.projectId,
                userId: msg.sender.id,
              });
            });
        });

        // Sort by timestamp descending
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(items.slice(0, 10)); // Show top 10
      })
      .catch((error) => {
        console.error("Failed to load activity feed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Helper to format timestamp as "time ago"
  const formatTimeAgo = (isoString: string) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-[#FAFAF7] border-[#E0D7C8] rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#2C2B28]">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-[#6B6B68] py-4">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-[#6B6B68] py-4">No recent activity</p>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-white border border-[#E0D7C8] rounded-lg hover:border-[#A9C4A4] transition-colors"
                >
                  {/* Icon/indicator based on activity type */}
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === "project-created"
                        ? "bg-[#A9C4A4]"
                        : activity.type === "join-request"
                        ? "bg-[#FCE58B]"
                        : "bg-[#F1998D]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2C2B28]">{activity.description}</p>
                    <p className="text-xs text-[#6B6B68] mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

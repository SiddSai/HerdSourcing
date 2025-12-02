// ============================================================================
// MyPasture - Personal dashboard for the current user
// Shows three tabs:
// 1. "My Projects" - projects where user is the owner
// 2. "My Contributions" - projects where user is assigned to a role
// 3. "Requests" - join-request messages user has received as project owner
// TODO: All data will come from Supabase queries filtering by current user
// ============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Project, Conversation, Message, CurrentUser } from "@/lib/types";
import { fetchCurrentUser, fetchProjects, fetchConversations } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import ProfileOverview from "./ProfileOverview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import EditProjectPopup from "./popups/EditProjectPopup";
import EditProfilePopup from "./popups/EditProfilePopup";
import DMsPopup from "./popups/DMsPopup";
import UserProfilePopup from "./popups/UserProfilePopup";
import { useToast } from "@/hooks/use-toast";

interface MyPastureProps {
  onBackToProjects?: () => void;
}

const MyPasture = ({ onBackToProjects }: MyPastureProps) => {
  // Current tab state for controlled tabs component
  const [currentTab, setCurrentTab] = useState<string>("projects");
  // Current logged-in user
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  // All projects (will filter client-side for now, later use backend queries)
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  // All conversations (to extract join requests)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // Selected project for editing
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // Edit profile popup state
  // This popup lets the current user edit their own profile information.
  // It should NOT be used for viewing other users' profiles.
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  // DM popup state
  const [isDMsOpen, setIsDMsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  // User profile popup (for viewing other users, not editing self)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { toast } = useToast();

  // Load current user, projects, and conversations on mount
  useEffect(() => {
    Promise.all([fetchCurrentUser(), fetchProjects(), fetchConversations()])
      .then(([user, projects, convos]) => {
        setCurrentUser(user);
        setAllProjects(projects);
        setConversations(convos);
      })
      .catch((error) => {
        console.error("Failed to load My Pasture data:", error);
        toast({
          title: "Error",
          description: "Failed to load your projects",
          variant: "destructive",
        });
      });
  }, [toast]);

  // Filter projects where current user is the owner
  const myProjects = allProjects.filter((p) => p.owner.id === currentUser?.id);

  // Filter projects where current user is assigned to any role
  const myContributions = allProjects.filter((p) =>
    p.roles.some((r) => r.assignee?.id === currentUser?.id)
  );

  // Extract join-request messages where current user is the project owner
  const joinRequests: Array<{
    message: Message;
    conversation: Conversation;
    project: Project | undefined;
  }> = [];

  conversations.forEach((convo) => {
    convo.messages
      .filter((msg) => msg.type === "join-request")
      .forEach((msg) => {
        // Find the project this join request is for
        const project = allProjects.find((p) => p.id === msg.projectId);
        // Only include if current user is the owner of that project
        if (project && project.owner.id === currentUser?.id) {
          joinRequests.push({ message: msg, conversation: convo, project });
        }
      });
  });

  // Handle saving edited project
  // This popup lets the current user edit one of their own projects in My Pasture.
  const handleSaveProject = (updatedProject: Project) => {
    setAllProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setSelectedProject(null);
    toast({
      title: "Project updated",
    });
  };

  // Handle saving edited profile
  const handleSaveProfile = (updatedProfile: {
    name: string;
    email: string;
    major: string;
    year: string;
    interests: string;
    availability: string;
    avatarUrl?: string;
  }) => {
    if (currentUser) {
      // Update current user state with the new profile data
      setCurrentUser({
        ...currentUser,
        displayName: updatedProfile.name,
        email: updatedProfile.email,
        major: updatedProfile.major,
        year: updatedProfile.year,
        interests: updatedProfile.interests,
        availability: updatedProfile.availability,
        avatarUrl: updatedProfile.avatarUrl,
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
  };

  // Open DM for a specific conversation
  const handleOpenConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsDMsOpen(true);
  };

  // Open user profile popup
  // Clicking on your own profile in My Pasture opens the edit profile dialog,
  // while clicking on other users opens the read-only UserProfilePopup.
  const handleOpenProfile = (userId: string) => {
    if (userId === currentUser?.id) {
      // User clicked their own profile - open edit dialog
      setIsEditProfileOpen(true);
    } else {
      // User clicked another user's profile - open view-only popup
      setSelectedUserId(userId);
      setIsProfileOpen(true);
    }
  };

  // Tab configuration array
  const tabs = [
    { key: "projects", label: `Projects (${myProjects.length})` },
    { key: "contributions", label: `Contributions (${myContributions.length})` },
    { key: "requests", label: `Requests (${joinRequests.length})` },
    { key: "profile", label: "My Profile" },
  ];

  return (
    // Match the layout and styling of Project Pasture with the same green header band
    <div className="min-h-screen bg-[#F3EDE3]">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        {/* HEADER SECTION - Sticky at top */}
        <div className="sticky top-0 z-10 bg-[#F3EDE3]">
          <div className="bg-[#A9C4A4]/25 border-b border-[#A9C4A4]/50">
            <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[#1F3A26] mb-2">
                  My Pasture
                </h1>
                <p className="text-base text-[#4A5D4E] font-light">
                  Manage your projects, contributions, and profile.
                </p>
              </div>
              {/* The navigation buttons simply update the global `view` state.
                  This allows the user to move freely between Project Pasture and My Pasture. */}
              {onBackToProjects && (
                <Button
                  onClick={onBackToProjects}
                  className="rounded-full bg-[#A9C4A4] text-[#1F3A26] px-4 py-2 shadow-sm hover:bg-[#95B090] transition-colors"
                >
                  Project Pasture
                </Button>
              )}
            </div>
            
            {/* Segmented-control style tab bar: a single animated pill slides between tabs
                using Framer Motion's shared layoutId. Active tab has a light pill background
                while inactive tabs are just text on the track. */}
            <div className="w-full">
              <div className="relative mx-auto max-w-3xl rounded-full bg-[#F3EDE3] p-1">
                <div className="grid grid-cols-4 gap-1">
                  {tabs.map((tab) => {
                    const isActive = currentTab === tab.key;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setCurrentTab(tab.key)}
                        className="relative flex items-center justify-center py-2.5 text-sm font-medium transition-colors"
                      >
                        {/* Sliding highlight pill for the active tab */}
                        {isActive && (
                          <motion.div
                            layoutId="myPastureTabHighlight"
                            className="absolute inset-0 rounded-full bg-[#fdf8f1] shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}

                        {/* Label text sits above the highlight */}
                        <span
                          className={`relative z-10 ${
                            isActive ? "text-[#283521]" : "text-[#6f665c]"
                          }`}
                        >
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

            {/* Tab 1: My Projects - projects I own */}
            <TabsContent value="projects">
              <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                    {myProjects.length > 0 ? (
                      myProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          // Allow editing only for projects owned by the current user.
                          onEdit={() => setSelectedProject(project)}
                          onOpenProfile={handleOpenProfile}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        You haven't created any projects yet. Click the + button to start!
                      </div>
                    )}
                </div>
              </main>
            </TabsContent>

            {/* Tab 2: My Contributions - projects where I'm assigned to a role */}
            <TabsContent value="contributions">
              <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                    {myContributions.length > 0 ? (
                      myContributions.map((project) => (
                        <div key={project.id} className="space-y-2">
                          <ProjectCard
                            project={project}
                            onOpenProfile={handleOpenProfile}
                          />
                          <div className="text-xs text-muted-foreground px-2">
                            Your roles:{" "}
                            {project.roles
                              .filter((r) => r.assignee?.id === currentUser?.id)
                              .map((r) => r.title)
                              .join(", ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        You're not contributing to any projects yet. Browse Project Pasture to find
                        opportunities!
                      </div>
                    )}
                </div>
              </main>
            </TabsContent>

            {/* Tab 3: Requests - join requests I've received as project owner */}
            <TabsContent value="requests">
              <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="space-y-4 pb-6">
                    {joinRequests.length > 0 ? (
                      joinRequests.map(({ message, conversation, project }) => (
                        <div
                          key={message.id}
                          className="border border-border rounded-lg p-4 bg-card space-y-3"
                        >
                            <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {/* Use a larger avatar size so profile pictures are clearly visible. */}
                                {message.sender.avatarUrl ? (
                                  <img
                                    src={message.sender.avatarUrl}
                                    alt={message.sender.displayName}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
                                    {message.sender.displayName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <button
                                    onClick={() => handleOpenProfile(message.sender.id)}
                                    className="font-medium text-foreground hover:underline"
                                  >
                                    {message.sender.displayName}
                                  </button>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {project && (
                                <p className="text-sm font-medium text-foreground mb-1">
                                  Project: {project.title}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">{message.content}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenConversation(conversation.id)}
                            className="w-full"
                          >
                            View Conversation
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No join requests yet. When people request to join your projects, they'll appear
                        here.
                      </div>
                    )}
                </div>
              </main>
            </TabsContent>

            {/* Tab 4: My Profile - Full editable profile view for the current user */}
            <TabsContent value="profile">
              <main className="max-w-6xl mx-auto px-4 py-8">
                {currentUser && (
                  <div className="max-w-2xl mx-auto">
                    <ProfileOverview
                      user={currentUser}
                      canEdit={true}
                      onEdit={() => setIsEditProfileOpen(true)}
                      showStats={true}
                      stats={{
                        projectsCreated: myProjects.length,
                        projectsContributed: myContributions.length,
                      }}
                    />
                  </div>
                )}
              </main>
            </TabsContent>
          </Tabs>

      {/* Edit Project Popup - for editing projects owned by current user */}
      {selectedProject && (
        <EditProjectPopup
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          project={selectedProject}
          onSave={handleSaveProject}
        />
      )}

      {/* Edit Profile Popup - for editing the current user's own profile */}
      {currentUser && (
        <EditProfilePopup
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          initialProfile={{
            name: currentUser.displayName,
            email: currentUser.email,
            major: currentUser.major || "",
            year: currentUser.year || "",
            interests: currentUser.interests || "",
            availability: currentUser.availability || "",
            avatarUrl: currentUser.avatarUrl,
          }}
          onSave={handleSaveProfile}
        />
      )}

      {/* DMs Popup */}
      <DMsPopup open={isDMsOpen} onOpenChange={setIsDMsOpen} />

      {/* User Profile Popup - for viewing other users' profiles (read-only) */}
      <UserProfilePopup
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        userId={selectedUserId}
      />
    </div>
  );
};

export default MyPasture;

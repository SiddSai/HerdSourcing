// ============================================================================
// ProjectPasture - Browse all projects across the platform
// Displays searchable/filterable grid of projects with details popups.
// Integrates with DMsPopup for role-based messaging.
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "./ProjectCard";
import { Project, UserRef } from "@/lib/types";
import ProjectDetailsPopup from "./popups/ProjectDetailsPopup";
import DMsPopup from "./popups/DMsPopup";
import UserProfilePopup from "./popups/UserProfilePopup";

interface ProjectPastureProps {
  onGoToMyPasture: () => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Campus Sustainability App",
    description: "Build a mobile app to track and gamify sustainability efforts across UC Davis. Features include carbon footprint tracking, eco-challenges, and reward system.",
    status: "open",
    owner: { id: "user-jordan", displayName: "Jordan Lee", email: "jlee@ucdavis.edu" },
    tags: ["React Native", "Design", "Beginner-friendly"],
    roles: [
      {
        id: "r1",
        title: "Frontend Developer",
        description: "Build React Native components for the dashboard and user profiles",
        filled: false,
      },
      {
        id: "r2",
        title: "UX Designer",
        description: "Design the app interface and user flows for gamification features",
        filled: true,
        assignee: { id: "user-sarah", displayName: "Sarah Kim", email: "skim@ucdavis.edu" },
      },
    ],
    createdAt: "2025-11-28T10:00:00Z",
  },
  {
    id: "2",
    title: "AI Study Group Matcher",
    description: "Use machine learning to match students for study groups based on course schedules, learning styles, and availability.",
    status: "in-progress",
    owner: { id: "user-priya", displayName: "Priya Patel", email: "ppatel@ucdavis.edu" },
    tags: ["AI", "Python", "Backend"],
    roles: [],
    createdAt: "2025-11-25T14:30:00Z",
  },
  {
    id: "3",
    title: "Aggie Events Calendar",
    description: "Centralized platform for discovering and managing all UC Davis events, clubs, and social gatherings in one place.",
    status: "open",
    owner: { id: "user-marcus", displayName: "Marcus Johnson", email: "mjohnson@ucdavis.edu" },
    tags: ["Web Dev", "UX Design", "Database"],
    roles: [],
    createdAt: "2025-11-20T09:00:00Z",
  },
  {
    id: "4",
    title: "Bike Path Optimization",
    description: "Analyze campus bike traffic patterns and suggest improvements to bike paths and parking using data visualization.",
    status: "completed",
    owner: { id: "user-emma", displayName: "Emma Chen", email: "echen@ucdavis.edu" },
    tags: ["Data Science", "GIS", "Visualization"],
    roles: [],
    createdAt: "2025-10-15T16:00:00Z",
  },
  {
    id: "5",
    title: "Mental Health Chatbot",
    description: "Develop an empathetic AI chatbot to provide mental health resources and connect students with campus wellness services.",
    status: "open",
    owner: { id: "user-alex", displayName: "Alex Rodriguez", email: "arodriguez@ucdavis.edu" },
    tags: ["AI", "Healthcare", "NLP"],
    roles: [],
    createdAt: "2025-11-01T11:00:00Z",
  },
  {
    id: "6",
    title: "Local Food Finder",
    description: "Connect students with local farmers and food producers. Features include marketplace, recipes, and sustainability info.",
    status: "in-progress",
    owner: { id: "user-olivia", displayName: "Olivia Martinez", email: "omartinez@ucdavis.edu" },
    tags: ["Mobile", "Design", "Community"],
    roles: [],
    createdAt: "2025-11-10T13:00:00Z",
  },
  {
    id: "7",
    title: "Research Lab Portal",
    description: "Platform for students to discover and apply to research opportunities across all departments at UC Davis.",
    status: "open",
    owner: { id: "user-ryan", displayName: "Ryan Kim", email: "rkim@ucdavis.edu" },
    tags: ["Full-stack", "Database", "Research"],
    roles: [],
    createdAt: "2025-11-22T15:00:00Z",
  },
  {
    id: "8",
    title: "Housing Review Platform",
    description: "Student-run review site for off-campus housing with verified reviews, photos, and landlord ratings.",
    status: "completed",
    owner: { id: "user-sophie", displayName: "Sophie Nguyen", email: "snguyen@ucdavis.edu" },
    tags: ["Web Dev", "Community", "Beginner-friendly"],
    roles: [],
    createdAt: "2025-10-05T12:00:00Z",
  },
];

const ProjectPasture = ({ onGoToMyPasture }: ProjectPastureProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDMsOpen, setIsDMsOpen] = useState(false);
  const [dmContext, setDmContext] = useState<{
    message: string;
    title: string;
    projectOwner: UserRef;
    joinRequestData?: {
      projectId: string;
      projectTitle: string;
      roleId: string;
      roleTitle: string;
    };
  } | null>(null);
  // User profile popup
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  // Handle normal DM about a role
  const handleDMAboutRole = (projectTitle: string, roleTitle: string, projectOwner: UserRef) => {
    setDmContext({
      message: `Hi! I'm interested in the ${roleTitle} role on ${projectTitle}.`,
      title: `${projectTitle} – ${roleTitle}`,
      projectOwner,
    });
    setIsDMsOpen(true);
  };

  // Handle "Request to Join" - sends special join-request message
  const handleRequestToJoin = (projectTitle: string, roleTitle: string, roleId: string, projectOwner: UserRef) => {
    if (!selectedProject) return;
    
    setDmContext({
      message: `Join Request: I'm interested in joining ${projectTitle} as ${roleTitle}.`,
      title: `${projectTitle} – ${roleTitle}`,
      projectOwner,
      joinRequestData: {
        projectId: selectedProject.id,
        projectTitle,
        roleId,
        roleTitle,
      },
    });
    setIsDMsOpen(true);
  };

  // Open user profile popup
  const handleOpenProfile = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileOpen(true);
  };

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      {/* HEADER SECTION - Sticky at top */}
      <div className="sticky top-0 z-10 bg-[#F3EDE3]">
        <div className="bg-[#A9C4A4]/25 border-b border-[#A9C4A4]/50">
          <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          {/* Title + Subtitle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#1F3A26] mb-2">
                Project Pasture
              </h1>
              <p className="text-base text-[#4A5D4E] font-light">
                Browse projects across UC Davis and find your next team.
              </p>
            </div>
            <Button
              onClick={onGoToMyPasture}
              className="rounded-full bg-[#A9C4A4] text-[#1F3A26] px-4 py-2 shadow-sm hover:bg-[#95B090] transition-colors"
            >
              My Pasture
            </Button>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#FAFAF7] border border-[#A9C4A4]/40 rounded-full px-4 py-2 shadow-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#FAFAF7] border border-[#A9C4A4]/40 rounded-full shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

      {/* PROJECT GRID SECTION */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} onClick={() => handleViewDetails(project)} className="cursor-pointer">
              <ProjectCard project={project} onOpenProfile={handleOpenProfile} />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B6B68]">No projects found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailsPopup
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          project={selectedProject}
          onDMAboutRole={handleDMAboutRole}
          onRequestToJoin={(title, role, roleId) => handleRequestToJoin(title, role, roleId, selectedProject.owner)}
          onViewUserProfile={handleOpenProfile}
        />
      )}

      <DMsPopup
        open={isDMsOpen}
        onOpenChange={(open) => {
          setIsDMsOpen(open);
          if (!open) setDmContext(null);
        }}
        prefilledMessage={dmContext?.message}
        conversationTitle={dmContext?.title}
        projectOwner={dmContext?.projectOwner}
        joinRequestData={dmContext?.joinRequestData}
      />

      {/* User Profile Popup */}
      <UserProfilePopup
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        userId={selectedUserId}
      />
    </div>
  );
};

export default ProjectPasture;

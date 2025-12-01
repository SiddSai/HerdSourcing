import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard, { Project } from "./ProjectCard";

interface ProjectPastureProps {
  onGoToMyPasture: () => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Campus Sustainability App",
    description: "Build a mobile app to track and gamify sustainability efforts across UC Davis. Features include carbon footprint tracking, eco-challenges, and reward system.",
    status: "open",
    tags: ["React Native", "Design", "Beginner-friendly"],
  },
  {
    id: "2",
    title: "AI Study Group Matcher",
    description: "Use machine learning to match students for study groups based on course schedules, learning styles, and availability.",
    status: "in-progress",
    tags: ["AI", "Python", "Backend"],
  },
  {
    id: "3",
    title: "Aggie Events Calendar",
    description: "Centralized platform for discovering and managing all UC Davis events, clubs, and social gatherings in one place.",
    status: "open",
    tags: ["Web Dev", "UX Design", "Database"],
  },
  {
    id: "4",
    title: "Bike Path Optimization",
    description: "Analyze campus bike traffic patterns and suggest improvements to bike paths and parking using data visualization.",
    status: "completed",
    tags: ["Data Science", "GIS", "Visualization"],
  },
  {
    id: "5",
    title: "Mental Health Chatbot",
    description: "Develop an empathetic AI chatbot to provide mental health resources and connect students with campus wellness services.",
    status: "open",
    tags: ["AI", "Healthcare", "NLP"],
  },
  {
    id: "6",
    title: "Local Food Finder",
    description: "Connect students with local farmers and food producers. Features include marketplace, recipes, and sustainability info.",
    status: "in-progress",
    tags: ["Mobile", "Design", "Community"],
  },
  {
    id: "7",
    title: "Research Lab Portal",
    description: "Platform for students to discover and apply to research opportunities across all departments at UC Davis.",
    status: "open",
    tags: ["Full-stack", "Database", "Research"],
  },
  {
    id: "8",
    title: "Housing Review Platform",
    description: "Student-run review site for off-campus housing with verified reviews, photos, and landlord ratings.",
    status: "completed",
    tags: ["Web Dev", "Community", "Beginner-friendly"],
  },
];

const ProjectPasture = ({ onGoToMyPasture }: ProjectPastureProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      {/* HEADER SECTION */}
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
              Go to My Pasture
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

      {/* PROJECT GRID SECTION */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B6B68]">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPasture;

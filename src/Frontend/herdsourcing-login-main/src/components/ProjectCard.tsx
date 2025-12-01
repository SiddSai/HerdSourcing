import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "completed";
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusClasses = {
    open: "inline-flex items-center rounded-full bg-[#A9C4A4] text-[#1F3A26] text-xs font-medium px-3 py-1",
    "in-progress": "inline-flex items-center rounded-full bg-[#F5D76E] text-[#7A6317] text-xs font-medium px-3 py-1",
    completed: "inline-flex items-center rounded-full bg-[#F1998D] text-[#5C1E1E] text-xs font-medium px-3 py-1",
  };

  const statusLabels = {
    open: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <div className="bg-[#FAFAF7] rounded-xl shadow-md border border-transparent hover:border-[#A9C4A4]/70 transition h-full flex flex-col p-6">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="text-xl font-semibold text-[#2C2B28]">
          {project.title}
        </h3>
        <span className={`${statusClasses[project.status]} shrink-0`}>
          {statusLabels[project.status]}
        </span>
      </div>
      <p className="text-sm text-[#6B6B68] line-clamp-3 mb-4 flex-1">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#FAFAF7] border border-[#E0D7C8] text-[#2C2B28] rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;

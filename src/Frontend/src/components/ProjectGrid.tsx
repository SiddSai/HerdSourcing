import { ProjectCard } from "./ProjectCard";
import { Project, ProjectStatus } from "@/lib/types";

interface ProjectGridProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ProjectStatus) => void;
}

export const ProjectGrid = ({ projects, onDelete, onUpdateStatus }: ProjectGridProps) => {
  return (
    <section className="w-full">
      <h3 className="mb-8 text-3xl font-semibold text-foreground">
        Recommended Projects
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </section>
  );
};

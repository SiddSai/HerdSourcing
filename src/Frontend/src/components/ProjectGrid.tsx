import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export const ProjectGrid = ({ projects, onDelete }: ProjectGridProps) => {
  return (
    <section className="w-full">
      <h3 className="mb-8 text-3xl font-semibold text-foreground">
        Recommended Projects
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            status={project.status}
            title={project.title}
            description={project.description}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

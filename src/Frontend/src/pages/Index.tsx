import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { PastureHero } from "@/components/PastureHero";
import { ProjectGrid } from "@/components/ProjectGrid";
import type { Project } from "@/lib/types";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { AddProjectModal } from "@/components/AddProjectModal";

const Index = () => {

  // Start with two demo project cards
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "demo-1",
      title: "Aggie Matchmaker",
      description: "Prototype matching students to labs with simple forms and tags.",
      status: "brainstorming"
    },
    {
      id: "demo-2",
      title: "Expresso",
      description: "Platform to contact and conduct coffee chats with experienced UC Davis students",
      status: "completed"
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Called when AddProjectModal submits
  const handleAddProject = (newProject: Omit<Project, "id">) => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(), // temporary ID
    };
    // use functional update to avoid stale state issues
    setProjects((prev) => [...prev, project]);
  };

  // Called when a project card requests deletion
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true; // no search → show everything

    const inTitle = project.title.toLowerCase().includes(term);
    const inDescription = project.description.toLowerCase().includes(term);

    return inTitle || inDescription;
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <PastureHero
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Pass current projects + delete handler into the grid */}
        <ProjectGrid projects={filteredProjects} onDelete={handleDeleteProject} />
      </main>

      {/* Floating + button to open the modal */}
      <FloatingAddButton onClick={() => setModalOpen(true)} />

      {/* Modal for adding a new project */}
      <AddProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddProject}
      />
    </div>
  );
};

export default Index;

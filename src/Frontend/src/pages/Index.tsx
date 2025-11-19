import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { PastureHero } from "@/components/PastureHero";
import { ProjectGrid } from "@/components/ProjectGrid";
import type { Project, ProjectStatus } from "@/lib/types";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { AddProjectModal } from "@/components/AddProjectModal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_URL = "http://localhost:4000/api/projects";

const Index = () => {
  // Projects currently visibile on page
  const [projects, setProjects] = useState<Project[]>([]);

  // Modal open and close states
  const [modalOpen, setModalOpen] = useState(false);

  // Search bar input
  const [searchTerm, setSearchTerm] = useState("");

  // Project status filter
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");

  // Loading/error UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Loading + clear old errors
        setLoading(true);
        setError(null);

        // Calls backend
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to refresh");
        }

        // Turn JSON body of projects to JS object
        const data: Project[] = await res.json();

        // Update projects state
        setProjects(data);
      } catch (err) {
        console.error(err);
        // Save a human-readable error message in state
        setError((err as Error).message);
      } finally {
        // Set loading state to off
        setLoading(false);
      }
    };

    // Call function
    fetchProjects();
  }, []);

  // Called when AddProjectModal submits
  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    try {
      // clear old errors

      setError(null);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) {
        throw new Error("Failed to add project");
      }

      const data = await res.json();
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      // Clear any old error
      setError(null);

      // Send delete request
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      // If deletion not successful
      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      // Update local projects state
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleUpdateStatus = async (id: string, newStatus: ProjectStatus) => {
    try {
      // Clear any old errors
      setError(null);

      // Send PUT request to backend
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT", // we're updating, not creating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update project status");
      }

      // Backend returns the updated project (optional, but nice)
      const updated = await res.json();

      // Update local project stae
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, status: updated.status } : project
        )
      );
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  // Filter projects by status and search term
  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilter === "all" || project.status === statusFilter;
    const searchMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <PastureHero
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
        />
        {/* Status filter dropdown */}
        <div className="flex justify-end mt-4">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ProjectStatus | "all")
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="brainstorming">Brainstorming</SelectItem>
              <SelectItem value="recruiting">Recruiting</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading && (
          <p className="text-sm text-muted-foreground mb-4">
            Loading projects…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-4">
            Error: {error}
          </p>
        )}

        {/* Pass current projects + delete handler into the grid */}
        <ProjectGrid
          projects={filteredProjects}
          onDelete={handleDeleteProject}
          onUpdateStatus={handleUpdateStatus}
        />
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

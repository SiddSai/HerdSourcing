import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectCard, { Project } from "./ProjectCard";

interface MyPastureProps {
  onBackToProjects: () => void;
}

const mockUserData = {
  name: "Alex Chen",
  email: "achen@ucdavis.edu",
  major: "Computer Science & Design",
  year: "Third-year",
  skills: ["Python", "React", "Figma", "UI/UX Design", "Data Visualization"],
  interests: "Sustainability, AI for social good, community building, creative technology",
  availability: "8–10 hours/week",
};

const mockUserProjects: Project[] = [
  {
    id: "u1",
    title: "Campus Sustainability App",
    description: "Build a mobile app to track and gamify sustainability efforts across UC Davis. Currently working on the rewards system and user profiles.",
    status: "in-progress",
    tags: ["React Native", "Design", "Team Lead"],
  },
  {
    id: "u2",
    title: "Aggie Events Calendar",
    description: "Centralized platform for discovering and managing all UC Davis events, clubs, and social gatherings in one place.",
    status: "open",
    tags: ["Web Dev", "UX Design", "Database"],
  },
  {
    id: "u3",
    title: "Housing Review Platform",
    description: "Student-run review site for off-campus housing with verified reviews, photos, and landlord ratings. Successfully launched last quarter!",
    status: "completed",
    tags: ["Web Dev", "Community"],
  },
];

const MyPasture = ({ onBackToProjects }: MyPastureProps) => {
  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      {/* GREEN PROFILE HEADER SECTION */}
      <div className="bg-[#A9C4A4]/25 border-b border-[#A9C4A4]/50">
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
          {/* Title + Subtitle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#1F3A26] mb-2">
                My Pasture
              </h1>
              <p className="text-base text-[#4A5D4E] font-light">
                Your profile and your projects.
              </p>
            </div>
            <Button
              onClick={onBackToProjects}
              className="rounded-full bg-[#A9C4A4] text-[#1F3A26] px-4 py-2 shadow-sm hover:bg-[#95B090] transition-colors"
            >
              Back to Project Pasture
            </Button>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-[#FAFAF7] rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#2C2B28] mb-6">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Name</p>
                  <p className="text-[#2C2B28] font-medium">{mockUserData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Email</p>
                  <p className="text-[#2C2B28] font-medium">{mockUserData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Major</p>
                  <p className="text-[#2C2B28] font-medium">{mockUserData.major}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Year</p>
                  <p className="text-[#2C2B28] font-medium">{mockUserData.year}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6B6B68] mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-[#FAFAF7] border border-[#E0D7C8] text-[#2C2B28] rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Interests</p>
                  <p className="text-[#2C2B28]">{mockUserData.interests}</p>
                </div>

                <div>
                  <p className="text-sm text-[#6B6B68] mb-1">Availability</p>
                  <p className="text-[#2C2B28] font-medium">{mockUserData.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USER PROJECTS SECTION */}
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-4">
        <h2 className="text-2xl font-semibold text-[#2C2B28] border-l-4 border-[#A9C4A4] pl-4">
          Your projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUserProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPasture;

import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export const NavBar = () => {
  return (
    <nav className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            HERDSOURCING
          </h1>
          <div className="flex items-center gap-8">
            <span className="text-lg font-medium text-foreground">
              PROJECTS
            </span>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

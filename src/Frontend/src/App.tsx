import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./components/LoginPage";
import ProfileSetup from "./components/ProfileSetup";
import ProjectPasture from "./components/ProjectPasture";
import MyPasture from "./components/MyPasture";
import LoadingScreen from "./components/LoadingScreen";
import { FloatingActions } from "./components/FloatingActions";

const queryClient = new QueryClient();

type View = "login" | "profileSetup" | "projectPasture" | "myPasture";

const App = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [isLoading, setIsLoading] = useState(false);

  const goTo = (nextView: View) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(nextView);
      setIsLoading(false);
    }, 650);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {currentView === "login" && (
              <LoginPage onLoginSuccess={() => goTo("profileSetup")} />
            )}
            {currentView === "profileSetup" && (
              <ProfileSetup
                onComplete={() => goTo("projectPasture")}
                onSkip={() => goTo("projectPasture")}
              />
            )}
            {currentView === "projectPasture" && (
              <ProjectPasture onGoToMyPasture={() => goTo("myPasture")} />
            )}
            {currentView === "myPasture" && (
              <MyPasture onBackToProjects={() => goTo("projectPasture")} />
            )}
            {/* Only show the floating New Project + DMs buttons on the main app views,
                not during login/profile setup. */}
            {(currentView === "projectPasture" || currentView === "myPasture") && (
              <FloatingActions />
            )}
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <Button
      size="icon"
      onClick={onClick}
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:shadow-xl transition-all"
      aria-label="Add new project idea"
    >
      <Plus className="h-8 w-8" strokeWidth={2.5} />
    </Button>
  );
};

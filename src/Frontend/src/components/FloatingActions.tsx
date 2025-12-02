// ============================================================================
// FloatingActions - Floating action buttons (FABs) for quick actions
// - DM button with notification badge showing unread count
// - New Project button
// TODO: Unread count will come from real-time Supabase subscriptions later
// ============================================================================

import { Plus, Send } from "lucide-react";
import { useState, useEffect } from "react";
import NewProjectPopup from "./popups/NewProjectPopup";
import DMsPopup from "./popups/DMsPopup";
import { fetchConversations } from "@/lib/api";

const FloatingActions = () => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isDMsOpen, setIsDMsOpen] = useState(false);
  // Total unread messages count across all conversations
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count when component mounts
  // This will be called periodically or via WebSocket in production
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const conversations = await fetchConversations();
        const total = conversations.reduce((sum, convo) => sum + convo.unreadCount, 0);
        setUnreadCount(total);
      } catch (error) {
        console.error("Failed to load unread count:", error);
      }
    };

    loadUnreadCount();
    
    // Poll for updates every 30 seconds (in production, use WebSocket/real-time subscriptions)
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* DM Button with notification badge */}
        <button
          onClick={() => setIsDMsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open direct messages"
        >
          <Send className="h-5 w-5" />
          {/* Unread badge - shows if there are unread messages or join requests */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        
        {/* New Project Button */}
        <button
          onClick={() => setIsNewProjectOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Create new project"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <NewProjectPopup open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} />
      <DMsPopup open={isDMsOpen} onOpenChange={setIsDMsOpen} />
    </>
  );
};

export { FloatingActions };

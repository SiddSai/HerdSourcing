// ============================================================================
// DMsPopup - Direct messaging interface
// Two-pane layout: left (conversation list), right (active conversation).
// Supports:
// - Creating new conversations (1:1 or group)
// - Naming/renaming conversations
// - Join-request messages with special styling
// - Marking conversations as read
// - Deleting conversations
// - Blocking users (hides their messages)
// TODO: All conversation/message data will come from Supabase in backend implementation
// ============================================================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Send, Search, Plus, Edit2, Trash2, Check, X, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { 
  Conversation, 
  Message, 
  UserRef,
  CurrentUser 
} from "@/lib/types";
import { 
  fetchConversations, 
  sendMessage, 
  createConversation,
  markConversationRead,
  deleteConversation,
  updateConversationName,
  addParticipantsToConversation,
  fetchCurrentUser
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DMsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledMessage?: string;
  conversationTitle?: string;
  projectOwner?: UserRef;
  // For join-request messages, pass project/role metadata
  joinRequestData?: {
    projectId: string;
    projectTitle: string;
    roleId: string;
    roleTitle: string;
  };
}

const DMsPopup = ({ 
  open, 
  onOpenChange, 
  prefilledMessage, 
  conversationTitle, 
  projectOwner,
  joinRequestData
}: DMsPopupProps) => {
  // Current logged-in user
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  // All conversations for current user
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // Current message being typed
  const [message, setMessage] = useState("");
  // Active conversation ID
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  // Search term for filtering conversations
  const [searchTerm, setSearchTerm] = useState("");
  // Whether we're creating a new conversation
  const [isNewConvo, setIsNewConvo] = useState(false);
  // Recipients for new conversation
  const [newConvoRecipients, setNewConvoRecipients] = useState("");
  // Optional name for new conversation
  const [newConvoName, setNewConvoName] = useState("");
  // Editing conversation name
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  // Adding participants to existing conversation
  const [addingParticipants, setAddingParticipants] = useState(false);
  const [newParticipantsInput, setNewParticipantsInput] = useState("");
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [convoToDelete, setConvoToDelete] = useState<string | null>(null);
  
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load current user and conversations when popup opens
  useEffect(() => {
    if (open) {
      // Fetch current user and their conversations
      Promise.all([fetchCurrentUser(), fetchConversations()])
        .then(([user, convos]) => {
          setCurrentUser(user);
          setConversations(convos);
        })
        .catch(error => {
          console.error("Failed to load conversations:", error);
          toast({
            title: "Error",
            description: "Failed to load conversations",
            variant: "destructive",
          });
        });
    }
  }, [open, toast]);

  // Handle role-based DM prefill - create or find conversation with project owner
  // This is triggered when user clicks "Chat about this role" or "Request to Join" from a project
  useEffect(() => {
    if (open && projectOwner && currentUser) {
      // Check if conversation with project owner already exists
      const existingConvo = conversations.find(c => 
        c.participants.some(p => p.id === projectOwner.id)
      );
      
      if (existingConvo) {
        // Use existing conversation
        setActiveConvo(existingConvo.id);
        setMessage(prefilledMessage || "");
        setIsNewConvo(false);
        
        // If this is a join-request, auto-send the message
        if (joinRequestData && prefilledMessage) {
          handleSendJoinRequest(existingConvo.id);
        }
      } else {
        // Create new conversation with project owner
        const convoName = conversationTitle || `Chat with ${projectOwner.displayName}`;
        
        createConversation({
          participantEmailsOrNames: [projectOwner.email],
          name: convoName,
        })
          .then(newConvo => {
            setConversations(prev => [newConvo, ...prev]);
            setActiveConvo(newConvo.id);
            setMessage(prefilledMessage || "");
            setIsNewConvo(false);
            
            // If this is a join-request, auto-send the message
            if (joinRequestData && prefilledMessage) {
              handleSendJoinRequest(newConvo.id);
            }
          })
          .catch(error => {
            console.error("Failed to create conversation:", error);
          });
      }
      
      // Focus message input
      setTimeout(() => messageInputRef.current?.focus(), 100);
    }
  }, [open, projectOwner, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start creating a new conversation
  const handleNewConversation = () => {
    setIsNewConvo(true);
    setActiveConvo(null);
    setNewConvoRecipients("");
    setNewConvoName("");
    setMessage("");
  };

  // Create a new conversation with parsed recipients
  const handleCreateConversation = async () => {
    if (!newConvoRecipients.trim()) return;

    // Parse recipients - split by spaces/commas
    const recipientStrings = newConvoRecipients.split(/[\s,]+/).filter(s => s.trim());

    // Generate conversation name
    let convoName = newConvoName.trim();
    if (!convoName) {
      if (recipientStrings.length === 1) {
        convoName = `Chat with ${recipientStrings[0]}`;
      } else {
        convoName = `Group chat`;
      }
    }

    try {
      const newConvo = await createConversation({
        participantEmailsOrNames: recipientStrings,
        name: convoName,
      });
      
      setConversations(prev => [newConvo, ...prev]);
      setActiveConvo(newConvo.id);
      setIsNewConvo(false);
      setNewConvoRecipients("");
      setNewConvoName("");

      setTimeout(() => messageInputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    }
  };

  // Send a normal message
  const handleSend = async () => {
    if (!message.trim() || !activeConvo || !currentUser) return;

    try {
      await sendMessage(activeConvo, {
        sender: currentUser,
        content: message.trim(),
        type: "normal",
      });
      
      setMessage("");
      
      // Refresh conversations to show new message
      const updatedConvos = await fetchConversations();
      setConversations(updatedConvos);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Send a join-request message with attached project/role metadata
  const handleSendJoinRequest = async (convoId: string) => {
    if (!joinRequestData || !currentUser) return;

    try {
      await sendMessage(convoId, {
        sender: currentUser,
        content: prefilledMessage || `Join Request for ${joinRequestData.roleTitle} on ${joinRequestData.projectTitle}`,
        type: "join-request",
        projectId: joinRequestData.projectId,
        roleId: joinRequestData.roleId,
      });
      
      setMessage("");
      
      // Refresh conversations
      const updatedConvos = await fetchConversations();
      setConversations(updatedConvos);
      
      toast({
        title: "Join request sent",
        description: "The project owner will be notified",
      });
    } catch (error) {
      console.error("Failed to send join request:", error);
      toast({
        title: "Error",
        description: "Failed to send join request",
        variant: "destructive",
      });
    }
  };

  // Mark a conversation as read when it becomes active
  const handleSelectConversation = async (convoId: string) => {
    setActiveConvo(convoId);
    setEditingName(false);
    
    if (currentUser) {
      try {
        await markConversationRead(convoId, currentUser.id);
        // Update local state to clear unread count
        setConversations(prev => 
          prev.map(c => c.id === convoId ? { ...c, unreadCount: 0 } : c)
        );
      } catch (error) {
        console.error("Failed to mark conversation as read:", error);
      }
    }
  };

  // Edit conversation name
  const handleSaveConversationName = async () => {
    if (!activeConvo || !editedName.trim()) {
      setEditingName(false);
      return;
    }

    try {
      await updateConversationName(activeConvo, editedName.trim());
      setConversations(prev =>
        prev.map(c => c.id === activeConvo ? { ...c, name: editedName.trim() } : c)
      );
      setEditingName(false);
      toast({
        title: "Conversation renamed",
      });
    } catch (error) {
      console.error("Failed to update conversation name:", error);
      toast({
        title: "Error",
        description: "Failed to rename conversation",
        variant: "destructive",
      });
    }
  };

  // Add participants to existing conversation
  const handleAddParticipants = async () => {
    if (!activeConvo || !newParticipantsInput.trim()) {
      setAddingParticipants(false);
      return;
    }

    try {
      const participantStrings = newParticipantsInput.split(/[\s,]+/).filter(s => s.trim());
      const updatedConvo = await addParticipantsToConversation(activeConvo, participantStrings);
      
      setConversations(prev =>
        prev.map(c => c.id === activeConvo ? updatedConvo : c)
      );
      setAddingParticipants(false);
      setNewParticipantsInput("");
      toast({
        title: "Participants added",
        description: `Added ${participantStrings.length} participant(s)`,
      });
    } catch (error) {
      console.error("Failed to add participants:", error);
      toast({
        title: "Error",
        description: "Failed to add participants",
        variant: "destructive",
      });
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async () => {
    if (!convoToDelete) return;

    try {
      await deleteConversation(convoToDelete);
      setConversations(prev => prev.filter(c => c.id !== convoToDelete));
      if (activeConvo === convoToDelete) {
        setActiveConvo(null);
      }
      toast({
        title: "Conversation deleted",
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setConvoToDelete(null);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => {
    // Filter out conversations with blocked users
    if (currentUser?.blockedUserIds) {
      const hasBlockedUser = convo.participants.some(p => 
        currentUser.blockedUserIds?.includes(p.id)
      );
      if (hasBlockedUser) return false;
    }

    return (convo.name && convo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      convo.participants.some(p => 
        p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  });

  const activeConvoData = conversations.find(c => c.id === activeConvo);
  
  // Check if active conversation includes blocked user
  const isConvoWithBlockedUser = activeConvoData && currentUser?.blockedUserIds?.some(
    blockedId => activeConvoData.participants.some(p => p.id === blockedId)
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showClose={false} className="max-w-5xl w-full p-0 overflow-hidden">
          {/* Use a fixed viewport height so panes scroll independently inside the dialog. */}
          <div className="flex h-[75vh] bg-[#f8f2e7]">
            {/* LEFT PANE - Conversation List */}
            <div className="flex flex-col w-full md:w-[300px] border-r bg-[#f5eee1]">
              {/* Sticky Header */}
              <div className="bg-[#A9C4A4]/25 border-b border-[#A9C4A4]/50 px-4 py-3 sticky top-0 z-10">
                <h2 className="text-sm font-semibold text-[#1F3A26]">Direct Messages</h2>
                <p className="text-xs text-[#4A5D4E]">
                  Reach out about roles and projects
                </p>
              </div>

              {/* Sticky Search Bar */}
              <div className="px-3 py-2 sticky top-[calc(3.5rem)] bg-[#f5eee1] z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-9 bg-background border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Scrollable Conversations */}
              <div className="flex-1 overflow-y-auto px-3 py-2">
                <div className="space-y-1">
                  {filteredConversations.map((convo) => (
                    <div key={convo.id} className="flex items-center gap-1">
                      <button
                        onClick={() => handleSelectConversation(convo.id)}
                        className={`flex-1 text-left p-3 rounded-lg transition-colors ${
                          activeConvo === convo.id
                            ? "bg-primary/20 border border-primary/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground text-sm truncate">
                                {convo.name || "Unnamed conversation"}
                              </h4>
                              {convo.unreadCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                                  {convo.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {convo.messages.length > 0 
                                ? convo.messages[convo.messages.length - 1].content
                                : "No messages yet"
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConvoToDelete(convo.id);
                          setDeleteConfirmOpen(true);
                        }}
                        title="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANE - Active Conversation or New Conversation Setup */}
            {/* Right pane is a full chat layout: sticky header, scrollable messages,
                sticky input bar pinned to the bottom. */}
            <div className="flex-1 flex flex-col bg-[#f8f2e7]">
              {isNewConvo ? (
                /* New Conversation Setup */
                <div className="flex flex-col h-full">
                  <div className="px-5 py-3 border-b bg-[#f8f2e7] sticky top-0 z-10">
                    <h3 className="font-semibold text-foreground mb-4">New Conversation</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2">To:</Label>
                        <Input
                          value={newConvoRecipients}
                          onChange={(e) => setNewConvoRecipients(e.target.value)}
                          placeholder="alice@ucdavis.edu bob carlos@example.com"
                          className="bg-muted border-border rounded-lg"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate multiple recipients with spaces
                        </p>
                      </div>
                      {newConvoRecipients.split(/[\s,]+/).filter(s => s.trim()).length > 1 && (
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2">Conversation name (optional):</Label>
                          <Input
                            value={newConvoName}
                            onChange={(e) => setNewConvoName(e.target.value)}
                            placeholder="e.g. Team discussion"
                            className="bg-muted border-border rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsNewConvo(false)}
                          className="flex-1 rounded-full border-border text-foreground"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateConversation}
                          disabled={!newConvoRecipients.trim()}
                          className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Existing Conversation View */
                <>
                  {/* Sticky Header */}
                  <div className="px-5 py-3 border-b bg-[#f8f2e7] sticky top-0 z-10">
                    {!activeConvoData ? (
                      <div className="flex items-center justify-center text-muted-foreground">
                        Select or start a conversation
                      </div>
                    ) : editingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="flex-1 bg-muted border-border"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveConversationName();
                            if (e.key === "Escape") setEditingName(false);
                          }}
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" onClick={handleSaveConversationName}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingName(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-sm truncate">
                            {activeConvoData.name || "Unnamed conversation"}
                          </h2>
                          {activeConvoData.participants.length > 2 && (
                            <p className="text-xs text-muted-foreground truncate">
                              {activeConvoData.participants
                                .filter(p => p.id !== currentUser?.id)
                                .map(p => p.displayName)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditedName(activeConvoData.name || "");
                              setEditingName(true);
                            }}
                            title="Rename conversation"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setConvoToDelete(activeConvoData.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Add participants UI */}
                    {addingParticipants && activeConvoData && (
                      <div className="mt-3 space-y-2">
                        <Label className="text-xs text-muted-foreground">Add participants:</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newParticipantsInput}
                            onChange={(e) => setNewParticipantsInput(e.target.value)}
                            placeholder="email@example.com or name"
                            className="flex-1 bg-muted border-border text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddParticipants();
                              if (e.key === "Escape") {
                                setAddingParticipants(false);
                                setNewParticipantsInput("");
                              }
                            }}
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" onClick={handleAddParticipants}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => {
                            setAddingParticipants(false);
                            setNewParticipantsInput("");
                          }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Separate multiple participants with spaces
                        </p>
                      </div>
                    )}
                    
                    {!addingParticipants && activeConvoData && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingParticipants(true)}
                        className="mt-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add participants
                      </Button>
                    )}
                  </div>

                  {/* Scrollable Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {!activeConvoData ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select or start a conversation
                      </div>
                    ) : isConvoWithBlockedUser ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">
                          This conversation includes a blocked user. Messages are hidden.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Bubble width is constrained to improve readability during long conversations. */}
                        {activeConvoData.messages.map((msg) => {
                          const isFromMe = msg.sender.id === currentUser?.id;
                          const isJoinRequest = msg.type === "join-request";
                          
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                  isJoinRequest
                                    ? "bg-accent/30 border border-accent text-accent-foreground"
                                    : isFromMe
                                    ? "bg-[#8fb68e] text-white ml-auto"
                                    : "bg-white text-[#333] mr-auto"
                                }`}
                              >
                                {isJoinRequest && (
                                  <div className="text-xs font-medium mb-1 opacity-75">
                                    🎯 Join Request
                                  </div>
                                )}
                                <p className="break-words">{msg.content}</p>
                                <p className="text-[10px] text-right opacity-70 mt-1">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sticky Input Bar */}
                  <div className="px-5 py-3 border-t bg-[#f8f2e7] sticky bottom-0">
                    {isConvoWithBlockedUser ? (
                      <p className="text-sm text-muted-foreground text-center">
                        You cannot send messages to blocked users
                      </p>
                    ) : (
                      <form className="flex items-center gap-3" onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}>
                        <Input
                          ref={messageInputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-muted border-border rounded-full"
                          disabled={!activeConvo}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!activeConvo || !message.trim()}
                          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Conversation Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the conversation from your list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DMsPopup;

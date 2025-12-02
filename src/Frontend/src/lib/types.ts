// ============================================================================
// This file contains all shared TypeScript types used throughout the app.
// These types represent users, projects, roles, conversations, and messages.
// They are structured to be easily connected to a backend (Supabase/Postgres).
// ============================================================================

// Basic user reference used across the app (project owners, role assignees, DM participants)
export type UserRef = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
};

// Logged-in user with extended profile info
// Includes optional blockedUserIds array for frontend-based blocking (will be backend-enforced later)
export type CurrentUser = UserRef & {
  bio?: string;
  major?: string;
  year?: string;
  skills?: string[];
  interests?: string;
  availability?: string;
  blockedUserIds?: string[]; // List of user IDs this user has blocked
};

// Role on a project - represents a position someone can fill
export type ProjectRole = {
  id: string;
  title: string;
  description: string;
  filled: boolean;
  assignee?: UserRef; // undefined if unfilled
};

// Project status enum - lifecycle of a project
export type ProjectStatus = "open" | "in-progress" | "completed";

// Project - main collaborative entity in HerdSourcing
export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  owner: UserRef; // who created the project
  roles: ProjectRole[]; // positions available on the project
  tags?: string[];
  skillsNeeded?: string[];
  createdAt: string; // ISO timestamp
};

// Message type - normal DMs vs join-request messages (styled differently)
export type MessageType = "normal" | "join-request";

// Message in a conversation
export type Message = {
  id: string;
  conversationId: string;
  sender: UserRef;
  content: string;
  type: MessageType;
  createdAt: string;
  // Optional metadata for join-request messages
  projectId?: string;
  roleId?: string;
};

// Conversation participant (same as UserRef, but semantically clearer)
export type ConversationParticipant = UserRef;

// Conversation (DM or group chat)
// Name can be edited by users; unreadCount tracks messages not yet seen by current user
export type Conversation = {
  id: string;
  name?: string; // for group chats, or auto-generated from participants; can be edited
  participants: ConversationParticipant[];
  messages: Message[];
  unreadCount: number; // how many unread messages for the current user
  lastMessageAt?: string;
};

// Activity item for the activity feed
export type ActivityItem = {
  id: string;
  type: "project-created" | "join-request" | "role-filled";
  description: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
};

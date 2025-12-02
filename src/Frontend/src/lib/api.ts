// ============================================================================
// API abstraction layer for HerdSourcing
// All backend-like operations go through this file.
// Currently uses mock data, but structured to easily swap with Supabase calls.
// ============================================================================
// TODO: Replace each function body with real Supabase queries when backend is ready.
// ============================================================================

import { Project, Conversation, Message, CurrentUser, UserRef, ProjectRole, ProjectStatus, ConversationParticipant } from "./types";

// Mock current user (in real app, this would come from auth)
const mockCurrentUser: CurrentUser = {
  id: "user-current",
  displayName: "Alex Chen",
  email: "achen@ucdavis.edu",
  major: "Computer Science & Design",
  year: "Third-year",
  bio: "Passionate about building tools that help students collaborate.",
  skills: ["Python", "React", "Figma", "UI/UX Design", "Data Visualization"],
  interests: "Sustainability, AI for social good, community building, creative technology",
  availability: "8–10 hours/week",
};

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Campus Sustainability App",
    description: "Build a mobile app to track and gamify sustainability efforts across UC Davis. Features include carbon footprint tracking, eco-challenges, and reward system.",
    status: "open",
    owner: { id: "user-jordan", displayName: "Jordan Lee", email: "jlee@ucdavis.edu" },
    tags: ["React Native", "Design", "Beginner-friendly"],
    roles: [
      {
        id: "r1",
        title: "Frontend Developer",
        description: "Build React Native components for the dashboard and user profiles",
        filled: false,
      },
      {
        id: "r2",
        title: "UX Designer",
        description: "Design the app interface and user flows for gamification features",
        filled: true,
        assignee: { id: "user-sarah", displayName: "Sarah Kim", email: "skim@ucdavis.edu" },
      },
    ],
    createdAt: "2025-11-28T10:00:00Z",
  },
  {
    id: "2",
    title: "AI Study Group Matcher",
    description: "Use machine learning to match students for study groups based on course schedules, learning styles, and availability.",
    status: "in-progress",
    owner: { id: "user-priya", displayName: "Priya Patel", email: "ppatel@ucdavis.edu" },
    tags: ["AI", "Python", "Backend"],
    roles: [],
    createdAt: "2025-11-25T14:30:00Z",
  },
  {
    id: "u1",
    title: "Aggie Events Calendar",
    description: "Centralized platform for discovering and managing all UC Davis events, clubs, and social gatherings in one place.",
    status: "open",
    owner: mockCurrentUser,
    tags: ["Web Dev", "UX Design", "Database"],
    roles: [],
    createdAt: "2025-11-20T09:00:00Z",
  },
  {
    id: "u2",
    title: "Housing Review Platform",
    description: "Student-run review site for off-campus housing with verified reviews, photos, and landlord ratings.",
    status: "completed",
    owner: mockCurrentUser,
    tags: ["Web Dev", "Community"],
    roles: [],
    createdAt: "2025-10-15T16:00:00Z",
  },
];

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Campus Sustainability App – Frontend Developer",
    participants: [
      mockCurrentUser,
      { id: "user-jordan", displayName: "Jordan Lee", email: "jlee@ucdavis.edu" },
    ],
    messages: [
      {
        id: "msg-1",
        conversationId: "conv-1",
        sender: mockCurrentUser,
        content: "Hi! I'm interested in the Frontend Developer role on Campus Sustainability App.",
        type: "normal",
        createdAt: "2025-12-01T10:30:00Z",
      },
      {
        id: "msg-2",
        conversationId: "conv-1",
        sender: { id: "user-jordan", displayName: "Jordan Lee", email: "jlee@ucdavis.edu" },
        content: "Great! Let's schedule a time to chat about the project.",
        type: "normal",
        createdAt: "2025-12-01T10:45:00Z",
      },
    ],
    unreadCount: 1,
    lastMessageAt: "2025-12-01T10:45:00Z",
  },
];

// ============================================================================
// FETCH CURRENT USER
// Returns the currently logged-in user's profile
// ============================================================================
export async function fetchCurrentUser(): Promise<CurrentUser> {
  // TODO: Replace with Supabase auth query: supabase.auth.getUser()
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay
  return mockCurrentUser;
}

// ============================================================================
// FETCH ALL PROJECTS
// Returns all projects in the system (for Project Pasture view)
// ============================================================================
export async function fetchProjects(): Promise<Project[]> {
  // TODO: Replace with Supabase query: supabase.from('projects').select('*, owner(*), roles(*)')
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProjects;
}

// ============================================================================
// FETCH PROJECT BY ID
// Returns a single project with full details
// ============================================================================
export async function fetchProjectById(id: string): Promise<Project | null> {
  // TODO: Replace with Supabase query: supabase.from('projects').select('*').eq('id', id).single()
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProjects.find((p) => p.id === id) || null;
}

// ============================================================================
// CREATE NEW PROJECT
// Creates a project with roles and returns the created project
// ============================================================================
export async function createProject(data: {
  title: string;
  description: string;
  status: ProjectStatus;
  roles: { title: string; description: string }[];
  tags?: string[];
}): Promise<Project> {
  // TODO: Replace with Supabase insert:
  // 1. Insert into projects table
  // 2. Insert roles into project_roles table
  // 3. Return created project with ID
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const newProject: Project = {
    id: `project-${Date.now()}`,
    title: data.title,
    description: data.description,
    status: data.status,
    owner: mockCurrentUser,
    roles: data.roles.map((r) => ({
      id: `role-${Date.now()}-${Math.random()}`,
      title: r.title,
      description: r.description,
      filled: false,
    })),
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
  };
  
  mockProjects.push(newProject);
  return newProject;
}

// ============================================================================
// UPDATE PROJECT
// Updates project fields and roles
// ============================================================================
export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  // TODO: Replace with Supabase update:
  // 1. Update projects table
  // 2. If roles changed, update project_roles table
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const index = mockProjects.findIndex((p) => p.id === projectId);
  if (index >= 0) {
    mockProjects[index] = { ...mockProjects[index], ...updates };
    return mockProjects[index];
  }
  throw new Error("Project not found");
}

// ============================================================================
// FETCH CONVERSATIONS
// Returns all conversations for the current user
// ============================================================================
export async function fetchConversations(): Promise<Conversation[]> {
  // TODO: Replace with Supabase query:
  // supabase.from('conversations').select('*, participants(*), messages(*)').contains('participant_ids', [currentUser.id])
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockConversations;
}

// ============================================================================
// CREATE CONVERSATION
// Creates a new conversation (DM or group) with initial participants and optional message
// ============================================================================
export async function createConversation(data: {
  participantEmailsOrNames: string[];
  name?: string;
  initialMessage?: Message;
}): Promise<Conversation> {
  // TODO: Replace with Supabase insert:
  // 1. Create conversation record
  // 2. Add participants to conversation_participants
  // 3. If initialMessage, insert into messages table
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // Parse participants (mock logic)
  const participants: ConversationParticipant[] = [mockCurrentUser];
  data.participantEmailsOrNames.forEach((input) => {
    const isEmail = input.includes("@");
    participants.push({
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      displayName: isEmail ? input.split("@")[0] : input,
      email: isEmail ? input : `${input.toLowerCase().replace(/\s+/g, "")}@ucdavis.edu`,
    });
  });
  
  const newConvo: Conversation = {
    id: `conv-${Date.now()}`,
    name: data.name,
    participants,
    messages: data.initialMessage ? [data.initialMessage] : [],
    unreadCount: 0,
    lastMessageAt: data.initialMessage?.createdAt,
  };
  
  mockConversations.push(newConvo);
  return newConvo;
}

// ============================================================================
// SEND MESSAGE
// Sends a message to a conversation (normal or join-request type)
// ============================================================================
export async function sendMessage(
  conversationId: string,
  data: {
    sender: UserRef;
    content: string;
    type: Message["type"];
    projectId?: string;
    roleId?: string;
  }
): Promise<Message> {
  // TODO: Replace with Supabase insert: supabase.from('messages').insert({ ... })
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    sender: data.sender,
    content: data.content,
    type: data.type,
    createdAt: new Date().toISOString(),
    projectId: data.projectId,
    roleId: data.roleId,
  };
  
  const convo = mockConversations.find((c) => c.id === conversationId);
  if (convo) {
    convo.messages.push(newMessage);
    convo.lastMessageAt = newMessage.createdAt;
  }
  
  return newMessage;
}

// ============================================================================
// MARK CONVERSATION AS READ
// Clears unread count for a conversation
// ============================================================================
export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
  // TODO: Replace with Supabase update: update conversation_participants set unread_count = 0
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const convo = mockConversations.find((c) => c.id === conversationId);
  if (convo) {
    convo.unreadCount = 0;
  }
}

// ============================================================================
// FETCH USER PROFILE
// Gets a user's profile by ID (for viewing others' profiles)
// ============================================================================
export async function fetchUserProfile(userId: string): Promise<CurrentUser | null> {
  // TODO: Replace with Supabase query: supabase.from('profiles').select('*').eq('id', userId).single()
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  if (userId === mockCurrentUser.id) {
    return mockCurrentUser;
  }
  
  // Mock other users
  return {
    id: userId,
    displayName: "Jordan Lee",
    email: "jlee@ucdavis.edu",
    bio: "Sustainability enthusiast building campus tools.",
    skills: ["React Native", "Design", "Project Management"],
    major: "Environmental Science",
    year: "Fourth-year",
  };
}

// ============================================================================
// FETCH USER PROJECTS
// Gets projects created by and contributed to by a user
// ============================================================================
export async function fetchUserProjects(userId: string): Promise<{
  created: Project[];
  contributed: Project[];
}> {
  // TODO: Replace with Supabase queries:
  // 1. created: supabase.from('projects').select('*').eq('owner_id', userId)
  // 2. contributed: supabase.from('project_roles').select('project(*)').eq('assignee_id', userId)
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const created = mockProjects.filter((p) => p.owner.id === userId);
  const contributed = mockProjects.filter((p) =>
    p.roles.some((r) => r.assignee?.id === userId)
  );
  
  return { created, contributed };
}

// ============================================================================
// BLOCK USER
// Adds a user to the current user's blocked list
// ============================================================================
export async function blockUser(userIdToBlock: string): Promise<void> {
  // TODO: Replace with Supabase call:
  // supabase.from('user_blocks').insert({ user_id: currentUser.id, blocked_user_id: userIdToBlock })
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Blocked user: ${userIdToBlock}`);
}

// ============================================================================
// UNBLOCK USER
// Removes a user from the current user's blocked list
// ============================================================================
export async function unblockUser(userIdToUnblock: string): Promise<void> {
  // TODO: Replace with Supabase call:
  // supabase.from('user_blocks').delete().eq('user_id', currentUser.id).eq('blocked_user_id', userIdToUnblock)
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Unblocked user: ${userIdToUnblock}`);
}

// ============================================================================
// REPORT PROJECT
// Creates a report for a project (admin review)
// ============================================================================
export async function reportProject(projectId: string, reason: string): Promise<void> {
  // TODO: Replace with Supabase insert:
  // supabase.from('project_reports').insert({ project_id: projectId, reporter_id: currentUser.id, reason })
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Reported project ${projectId}: ${reason}`);
}

// ============================================================================
// DELETE CONVERSATION
// Soft-deletes a conversation for the current user
// ============================================================================
export async function deleteConversation(conversationId: string): Promise<void> {
  // TODO: Replace with Supabase call:
  // supabase.from('conversation_participants').delete().eq('conversation_id', conversationId).eq('user_id', currentUser.id)
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Deleted conversation: ${conversationId}`);
}

// ============================================================================
// UPDATE CONVERSATION NAME
// Allows users to rename a conversation
// ============================================================================
export async function updateConversationName(conversationId: string, name: string): Promise<void> {
  // TODO: Replace with Supabase update:
  // supabase.from('conversations').update({ name }).eq('id', conversationId)
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Updated conversation ${conversationId} name to: ${name}`);
}

// ============================================================================
// ADD PARTICIPANTS TO CONVERSATION
// Adds new users to an existing conversation
// ============================================================================
export async function addParticipantsToConversation(
  conversationId: string, 
  participantEmailsOrNames: string[]
): Promise<Conversation> {
  // TODO: Replace with Supabase call:
  // 1. Look up user IDs from emails/names
  // 2. Insert new participants: supabase.from('conversation_participants').insert(...)
  // 3. Return updated conversation
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // Mock: find conversation and add participants
  const convo = mockConversations.find(c => c.id === conversationId);
  if (!convo) throw new Error("Conversation not found");
  
  // Create mock participants from the input
  const newParticipants: ConversationParticipant[] = participantEmailsOrNames.map((emailOrName, idx) => ({
    id: `user-new-${Date.now()}-${idx}`,
    displayName: emailOrName.includes('@') ? emailOrName.split('@')[0] : emailOrName,
    email: emailOrName.includes('@') ? emailOrName : `${emailOrName}@ucdavis.edu`,
  }));
  
  // Add new participants to the conversation
  convo.participants.push(...newParticipants);
  
  console.log(`Added participants to conversation ${conversationId}:`, participantEmailsOrNames);
  return convo;
}

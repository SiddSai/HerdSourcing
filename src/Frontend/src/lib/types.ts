

// Project Card *

// Project Card Status ** 

export type ProjectStatus =
  | "brainstorming"
  | "recruiting"
  | "in_progress"
  | "completed";


// Project Card Interface **

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
}


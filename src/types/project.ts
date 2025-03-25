/**
 * Represents the status of a project
 */
export type ProjectStatus = "not-started" | "in-progress" | "completed";

/**
 * Represents a project in the system
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  createdAt: Date;
  dueDate?: Date;
  teamMembers: string[];
}

/**
 * Form data used when creating or updating a project
 */
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: Date | null;
  teamMembers: string[];
}

/**
 * API data format for sending project data
 */
export type ProjectApiData = Omit<Project, "id" | "createdAt"> & {
  dueDate?: Date;
};

/**
 * Represents a team member
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

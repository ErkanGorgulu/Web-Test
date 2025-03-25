import { create } from "zustand";

// Define types for our projects
export type ProjectStatus = "not-started" | "in-progress" | "completed";

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

// Define our store state
interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
}

// Create the store
export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,

  // Actions
  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProjectId:
        state.selectedProjectId === id ? null : state.selectedProjectId,
    })),

  selectProject: (id) => set({ selectedProjectId: id }),
}));

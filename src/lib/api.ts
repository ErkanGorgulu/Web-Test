import { Project, ProjectStatus } from "./store";
import { generateId } from "@/utils/helpers";

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "proj_1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern UI/UX",
    status: "in-progress",
    progress: 65,
    createdAt: new Date("2023-01-15"),
    dueDate: new Date("2023-06-30"),
    teamMembers: ["user_1", "user_2", "user_3"],
  },
  {
    id: "proj_2",
    name: "Mobile App Development",
    description: "Develop a cross-platform mobile app for customers",
    status: "in-progress",
    progress: 40,
    createdAt: new Date("2023-02-01"),
    dueDate: new Date("2023-08-15"),
    teamMembers: ["user_2", "user_4", "user_5"],
  },
  {
    id: "proj_3",
    name: "Backend API Integration",
    description: "Integrate new payment processing API with existing backend",
    status: "not-started",
    progress: 0,
    createdAt: new Date("2023-03-10"),
    dueDate: new Date("2023-07-20"),
    teamMembers: ["user_1", "user_6"],
  },
  {
    id: "proj_4",
    name: "Content Strategy",
    description: "Develop content strategy for social media and blog",
    status: "completed",
    progress: 100,
    createdAt: new Date("2023-01-05"),
    dueDate: new Date("2023-03-01"),
    teamMembers: ["user_3", "user_7"],
  },
  {
    id: "proj_5",
    name: "User Testing",
    description: "Conduct user testing sessions for the new product",
    status: "in-progress",
    progress: 80,
    createdAt: new Date("2023-02-20"),
    dueDate: new Date("2023-04-30"),
    teamMembers: ["user_2", "user_5", "user_8"],
  },
];

// Mock team members
export const mockTeamMembers = [
  { id: "user_1", name: "John Doe", role: "Frontend Developer", avatar: "" },
  { id: "user_2", name: "Jane Smith", role: "UX Designer", avatar: "" },
  {
    id: "user_3",
    name: "Michael Johnson",
    role: "Backend Developer",
    avatar: "",
  },
  { id: "user_4", name: "Emily Davis", role: "Project Manager", avatar: "" },
  { id: "user_5", name: "Robert Wilson", role: "QA Engineer", avatar: "" },
  { id: "user_6", name: "Sarah Thompson", role: "DevOps Engineer", avatar: "" },
  {
    id: "user_7",
    name: "David Martinez",
    role: "Content Strategist",
    avatar: "",
  },
  {
    id: "user_8",
    name: "Lisa Anderson",
    role: "Marketing Specialist",
    avatar: "",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    await delay(800); // Simulate network delay
    return [...mockProjects];
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<Project | undefined> => {
    await delay(600);
    return mockProjects.find((project) => project.id === id);
  },

  // Create a new project
  createProject: async (
    project: Omit<Project, "id" | "createdAt">
  ): Promise<Project> => {
    await delay(1000);
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date(),
    };
    mockProjects.push(newProject);
    return newProject;
  },

  // Update an existing project
  updateProject: async (updatedProject: Project): Promise<Project> => {
    await delay(800);
    const index = mockProjects.findIndex((p) => p.id === updatedProject.id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    mockProjects[index] = updatedProject;
    return updatedProject;
  },

  // Delete a project
  deleteProject: async (id: string): Promise<boolean> => {
    await delay(700);
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    mockProjects.splice(index, 1);
    return true;
  },

  // Update project status
  updateProjectStatus: async (
    id: string,
    status: ProjectStatus
  ): Promise<Project> => {
    await delay(500);
    const project = mockProjects.find((p) => p.id === id);
    if (!project) {
      throw new Error("Project not found");
    }

    project.status = status;

    // Update progress based on status
    if (status === "completed") {
      project.progress = 100;
    } else if (status === "not-started") {
      project.progress = 0;
    }

    return project;
  },
};

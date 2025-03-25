"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatDate } from "@/utils/helpers";
import { Plus, Eye, Trash2, Filter, Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ProjectForm from "@/components/projects/ProjectForm";
import { Project, useProjectStore } from "@/lib/store";

// Type for the form data coming from the ProjectForm component
type ProjectFormData = {
  name: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  dueDate: Date | null;
  teamMembers: string[];
};

// Type for the API call that matches the expected input
type ProjectApiData = Omit<Project, "id" | "createdAt"> & {
  dueDate?: Date;
};

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the setProjects function from Zustand store
  const { setProjects } = useProjectStore();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  });

  // Update the Zustand store when projects are fetched from API
  useEffect(() => {
    if (projects) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  // Mutation for creating a new project
  const createProjectMutation = useMutation({
    mutationFn: (projectData: ProjectApiData) => api.createProject(projectData),
    onSuccess: (newProject) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Close the modal
      setIsModalOpen(false);
      // Show notification or feedback (optional)
      console.log("Project created successfully:", newProject);
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      // Handle error (show error message, etc.)
    },
  });

  // Mutation for deleting a project
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => api.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    // Convert null to undefined for the API
    const apiData: ProjectApiData = {
      ...data,
      dueDate: data.dueDate || undefined,
    };

    // Log the data being submitted
    console.log("Submitting project data:", apiData);

    createProjectMutation.mutate(apiData);
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click

    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  // Helper function to get priority UI elements
  const getPriorityBadge = (priority: number) => {
    if (priority >= 75) {
      return (
        <div className="flex items-center">
          <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center">
            <span className="w-2 h-2 mr-1 rounded-full bg-red-500"></span>
            High Priority
          </span>
        </div>
      );
    } else if (priority >= 50) {
      return (
        <div className="flex items-center">
          <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded-md border border-amber-200 flex items-center">
            <span className="w-2 h-2 mr-1 rounded-full bg-amber-500"></span>
            Mid Priority
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-200 flex items-center">
            <span className="w-2 h-2 mr-1 rounded-full bg-green-500"></span>
            Low Priority
          </span>
        </div>
      );
    }
  };

  // Sections of projects
  const inProgressProjects =
    projects?.filter((p) => p.status === "in-progress") || [];
  const completedProjects =
    projects?.filter((p) => p.status === "completed") || [];
  const notStartedProjects =
    projects?.filter((p) => p.status === "not-started") || [];

  // Display message if there are no projects
  const noProjects = !projects || projects.length === 0;

  return (
    <div className="max-w-full">
      {/* Project header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-2">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2 text-gray-900">Project</h1>
          <span className="text-gray-400">/</span>
          <span className="ml-2 text-xl font-bold text-gray-900">
            Web App HR
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* User avatars */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
              <Image
                src="https://randomuser.me/api/portraits/men/42.jpg"
                alt="Team member"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 24px, 32px"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
              <Image
                src="https://randomuser.me/api/portraits/women/35.jpg"
                alt="Team member"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 24px, 32px"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
              <Image
                src="https://randomuser.me/api/portraits/men/48.jpg"
                alt="Team member"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 24px, 32px"
              />
            </div>
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex mb-4">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
          Board
        </button>
        <button className="px-4 py-2 text-gray-600 text-sm hover:text-gray-900">
          Calendar
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">Filter</span>
          </button>
          <button
            onClick={handleCreateProject}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-1 sm:flex-initial justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm">Add task</span>
          </button>
        </div>
      </div>

      {noProjects ? (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-10 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first project
          </p>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Not Started Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Not Started
              <span className="ml-2 text-sm font-normal text-gray-500">
                {notStartedProjects.length}
              </span>
            </h3>
            {notStartedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  {getPriorityBadge(project.progress)}
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative"
                      >
                        <Image
                          src={`https://randomuser.me/api/portraits/${
                            idx % 2 === 0 ? "men" : "women"
                          }/${15 + idx}.jpg`}
                          alt="Team member"
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* In Progress Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              In Progress
              <span className="ml-2 text-sm font-normal text-gray-500">
                {inProgressProjects.length}
              </span>
            </h3>
            {inProgressProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {project.description}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {project.progress}% complete
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  {getPriorityBadge(project.progress)}
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative"
                      >
                        <Image
                          src={`https://randomuser.me/api/portraits/${
                            idx % 2 === 0 ? "men" : "women"
                          }/${20 + idx}.jpg`}
                          alt="Team member"
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Completed
              <span className="ml-2 text-sm font-normal text-gray-500">
                {completedProjects.length}
              </span>
            </h3>
            {completedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-200">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative"
                      >
                        <Image
                          src={`https://randomuser.me/api/portraits/${
                            idx % 2 === 0 ? "men" : "women"
                          }/${30 + idx}.jpg`}
                          alt="Team member"
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

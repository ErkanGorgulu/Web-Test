"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Project, ProjectApiData } from "@/types";
import { useCallback } from "react";

/**
 * Custom hook for fetching and managing projects
 */
export function useProjects() {
  const queryClient = useQueryClient();

  // Get all projects
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  });

  // Get a single project
  const getProject = useCallback(
    (id: string) => {
      return queryClient.fetchQuery({
        queryKey: ["project", id],
        queryFn: () => api.getProject(id),
      });
    },
    [queryClient]
  );

  // Create a new project
  const createProjectMutation = useMutation({
    mutationFn: (projectData: ProjectApiData) => api.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Update a project
  const updateProjectMutation = useMutation({
    mutationFn: (project: Project) => api.updateProject(project),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", updatedProject.id],
      });
    },
  });

  // Delete a project
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => api.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Helper function to filter projects by status
  const getProjectsByStatus = useCallback(
    (status: string) => {
      return projects.filter((p) => p.status === status);
    },
    [projects]
  );

  return {
    // Queries
    projects,
    isLoading,
    isError,
    error,
    refetch,
    getProject,

    // Mutations
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,

    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,

    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,

    // Helpers
    getProjectsByStatus,
    inProgressProjects: getProjectsByStatus("in-progress"),
    completedProjects: getProjectsByStatus("completed"),
    notStartedProjects: getProjectsByStatus("not-started"),
  };
}

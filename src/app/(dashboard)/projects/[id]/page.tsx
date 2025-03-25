"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatDate } from "@/utils/helpers";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ProjectForm from "@/components/projects/ProjectForm";
import { Project } from "@/lib/store";

// Type for the form data coming from ProjectForm
type ProjectFormData = {
  name: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  dueDate: Date | null;
  teamMembers: string[];
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.getProject(projectId),
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject: Project) => api.updateProject(updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditModalOpen(false);
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/projects");
    },
  });

  const goBack = () => {
    router.push("/projects");
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    if (!project) return;

    updateProjectMutation.mutate({
      ...data,
      id: projectId,
      createdAt: project.createdAt,
      dueDate: data.dueDate || undefined,
    });
  };

  const confirmDelete = () => {
    deleteProjectMutation.mutate(projectId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-500 mb-4">Project not found</div>
        <button
          onClick={goBack}
          className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>
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

  return (
    <div className="max-w-full">
      {/* Project header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-2">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="mr-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold mr-2 text-gray-900">Project</h1>
          <span className="text-gray-400">/</span>
          <span className="ml-2 text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">
            {project.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* User avatars */}
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 3).map((member, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative"
              >
                <Image
                  src={`https://randomuser.me/api/portraits/${
                    i % 2 === 0 ? "men" : "women"
                  }/${i + 10}.jpg`}
                  alt={member}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 24px, 32px"
                />
              </div>
            ))}
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex mb-6 overflow-x-auto">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm whitespace-nowrap">
          Overview
        </button>
        <button className="px-4 py-2 text-gray-700 text-sm hover:text-gray-900 whitespace-nowrap">
          Tasks
        </button>
        <button className="px-4 py-2 text-gray-700 text-sm hover:text-gray-900 whitespace-nowrap">
          Files
        </button>
      </div>

      {/* Project overview section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Main project info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1 text-gray-900">
                {project.name}
              </h2>
              <p className="text-gray-700 mb-4">{project.description}</p>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleEdit}
                className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-800">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-800">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Project details */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Start Date</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(project.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Due Date</p>
              <p className="text-sm font-medium text-gray-800">
                {project.dueDate ? formatDate(project.dueDate) : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Status</p>
              <div className="flex items-center">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    project.status === "not-started"
                      ? "bg-gray-100 text-gray-800"
                      : project.status === "in-progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {project.status === "not-started"
                    ? "Not Started"
                    : project.status === "in-progress"
                    ? "In Progress"
                    : "Completed"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Priority</p>
              {getPriorityBadge(project.progress)}
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Team Size</p>
              <p className="text-sm font-medium text-gray-800">
                {project.teamMembers.length} Members
              </p>
            </div>
          </div>
        </div>

        {/* Team members section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Team Members</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {/* Team member list */}
            {project.teamMembers.map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative mr-3">
                    <Image
                      src={`https://randomuser.me/api/portraits/${
                        i % 2 === 0 ? "men" : "women"
                      }/${i + 15}.jpg`}
                      alt={member}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.split("_")[1] || member}
                    </p>
                    <p className="text-xs text-gray-500">
                      {i % 3 === 0
                        ? "Developer"
                        : i % 3 === 1
                        ? "Designer"
                        : "PM"}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                  {i % 3 === 0 ? "Admin" : "Member"}
                </div>
              </div>
            ))}

            <button className="w-full py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 mt-2 flex items-center justify-center">
              <Plus className="w-4 h-4 mr-1" /> Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="font-medium text-gray-900">Recent Tasks</h3>
          <div className="flex sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex-grow sm:flex-grow-0 sm:w-48"
            />
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 whitespace-nowrap flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {i === 1
                            ? "Design main dashboard layout"
                            : i === 2
                            ? "Implement login functionality"
                            : "Create API documentation"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full flex-shrink-0 mr-2 relative overflow-hidden">
                          <Image
                            src={`https://randomuser.me/api/portraits/${
                              i % 2 === 0 ? "men" : "women"
                            }/${20 + i}.jpg`}
                            alt="Assignee"
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                        <div className="text-sm text-gray-800">
                          {i === 1
                            ? "Jane Smith"
                            : i === 2
                            ? "John Doe"
                            : "Alex Johnson"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          i === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : i === 2
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {i === 1
                          ? "In Progress"
                          : i === 2
                          ? "Completed"
                          : "Todo"}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-800">
                      {i === 1
                        ? "Jul 24, 2023"
                        : i === 2
                        ? "Jul 15, 2023"
                        : "Aug 5, 2023"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          i === 1
                            ? "bg-red-100 text-red-800"
                            : i === 2
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {i === 1 ? "High" : i === 2 ? "Low" : "Medium"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="font-medium text-gray-900 mb-4">Comments</h3>

        {/* Comment form */}
        <div className="mb-6">
          <textarea
            placeholder="Add a comment..."
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Post Comment
            </button>
          </div>
        </div>

        {/* Comment list */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-start mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative mr-3 flex-shrink-0">
                  <Image
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "men" : "women"
                    }/${25 + i}.jpg`}
                    alt="User"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm text-gray-900">
                      {i === 1 ? "Jane Smith" : "John Doe"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {i === 1 ? "2 days ago" : "5 hours ago"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-800 mt-1">
                    {i === 1
                      ? "The designs are coming along nicely. I've updated the mockups to include the feedback we received last week."
                      : "I've fixed the API integration issues. We should be able to move forward with testing now."}
                  </p>
                </div>
              </div>
              <div className="pl-11">
                <button className="text-xs text-gray-500 hover:text-gray-700 mr-4">
                  Reply
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        size="lg"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <div className="py-2">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto order-1 sm:order-2"
            >
              Delete Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

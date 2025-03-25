"use client";

import { useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Filter, Search } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import DashboardShell from "@/components/layout/DashboardShell";
import Button from "@/components/ui/Button";
import { ProjectFormData } from "@/types";

// Lazy loaded components
const ProjectCard = lazy(() => import("@/components/projects/ProjectCard"));
const ProjectForm = lazy(() => import("@/components/projects/ProjectForm"));
const Modal = lazy(() => import("@/components/ui/Modal"));

// Create a simple SearchInput component since we don't have a reusable one yet
const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-9 pr-3 py-2 border border-secondary-300 rounded-md text-secondary-900"
    />
    <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary-500" />
  </div>
);

// Loading fallback
const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 h-64 animate-pulse">
    <div className="bg-secondary-200 h-6 w-24 rounded mb-3" />
    <div className="bg-secondary-200 h-8 w-3/4 rounded mb-4" />
    <div className="bg-secondary-200 h-4 w-full rounded mb-4" />
    <div className="bg-secondary-200 h-6 w-full rounded mb-3" />
    <div className="bg-secondary-200 h-10 w-full rounded mb-4" />
  </div>
);

/**
 * Projects page component
 */
export default function ProjectsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Use our custom hook for managing projects
  const {
    projects,
    isLoading,
    createProject,
    deleteProject,
    inProgressProjects,
    completedProjects,
    notStartedProjects,
  } = useProjects();

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  // Handle create project
  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (data: ProjectFormData) => {
    // Convert null to undefined for the API
    const apiData = {
      ...data,
      dueDate: data.dueDate || undefined,
    };

    createProject(apiData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click

    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  // Filter projects by search term
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Header content with user avatars
  const headerContent = (
    <>
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
          <Image
            src="https://i.pravatar.cc/150?u=user_1"
            alt="Team member"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 24px, 32px"
          />
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
          <Image
            src="https://i.pravatar.cc/150?u=user_2"
            alt="Team member"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 24px, 32px"
          />
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
          <Image
            src="https://i.pravatar.cc/150?u=user_3"
            alt="Team member"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 24px, 32px"
          />
        </div>
      </div>
      <button className="flex items-center justify-center w-8 h-8 rounded-full border border-secondary-300 bg-white">
        <Plus className="w-4 h-4 text-secondary-500" />
      </button>
    </>
  );

  return (
    <DashboardShell
      heading="Projects"
      subheading="Manage all your projects"
      headerContent={headerContent}
    >
      {/* Tabs */}
      <div className="border-b border-secondary-200 flex mb-4">
        <button className="px-4 py-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
          Board
        </button>
        <button className="px-4 py-2 text-secondary-600 text-sm hover:text-secondary-900">
          Calendar
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreateProject}
          >
            Add project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-md shadow-sm border border-secondary-200 p-6 sm:p-10 text-center">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No projects found
          </h3>
          <p className="text-secondary-600 mb-6">
            {searchTerm
              ? "Try another search term"
              : "Get started by creating your first project"}
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreateProject}
          >
            Add project
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* In Progress Projects */}
          {inProgressProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-secondary-900">
                In Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Suspense fallback={<CardSkeleton />}>
                  {inProgressProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onView={handleProjectClick}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          )}

          {/* Not Started Projects */}
          {notStartedProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-secondary-900">
                Not Started
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Suspense fallback={<CardSkeleton />}>
                  {notStartedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onView={handleProjectClick}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-secondary-900">
                Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Suspense fallback={<CardSkeleton />}>
                  {completedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onView={handleProjectClick}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Suspense fallback={null}>
        {isModalOpen && (
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
        )}
      </Suspense>
    </DashboardShell>
  );
}

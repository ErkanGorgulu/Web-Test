"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Project } from "@/lib/store";
import { X } from "lucide-react";

// Define the form schema with Zod
const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["not-started", "in-progress", "completed"] as const),
  progress: z.number().min(0).max(100),
  dueDate: z.date().nullable(),
  teamMembers: z.array(z.string()),
});

// Type for form data
type ProjectFormData = z.infer<typeof projectSchema>;

// Form props
interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  // Convert initialData for the form
  const defaultValues: ProjectFormData = initialData
    ? {
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
      }
    : {
        name: "",
        description: "",
        status: "not-started",
        progress: 0,
        dueDate: null,
        teamMembers: [],
      };

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  // For team members management
  const [newMember, setNewMember] = useState("");

  // Watch the status field to update progress automatically
  const currentStatus = watch("status");

  // Get the register result for team members
  const teamMembersRegister = register("teamMembers");

  // Current team members value
  const teamMembers = watch("teamMembers") || [];

  // Handle team member addition
  const addTeamMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      teamMembersRegister.onChange({
        target: {
          value: [...teamMembers, newMember.trim()],
          name: "teamMembers",
        },
      });
      setNewMember("");
    }
  };

  // Handle team member removal
  const removeTeamMember = (member: string) => {
    teamMembersRegister.onChange({
      target: {
        value: teamMembers.filter((m) => m !== member),
        name: "teamMembers",
      },
    });
  };

  // Handle key press for adding team members
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTeamMember();
    }
  };

  // Handle form submission
  const onFormSubmit = (data: ProjectFormData) => {
    // If status is completed, set progress to 100
    // If status is not-started, set progress to 0
    if (data.status === "completed") {
      data.progress = 100;
    } else if (data.status === "not-started") {
      data.progress = 0;
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 sm:space-y-6"
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Project Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Progress (only shown if status is in-progress) */}
        {currentStatus === "in-progress" && (
          <div>
            <label
              htmlFor="progress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Progress ({watch("progress")}%)
            </label>
            <Controller
              name="progress"
              control={control}
              render={({ field }) => (
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="w-full"
                />
              )}
            />
            {errors.progress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.progress.message}
              </p>
            )}
          </div>
        )}

        {/* Due Date */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date (Optional)
          </label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                id="dueDate"
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  field.onChange(date);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            )}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Members
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add team member..."
              className="flex-1 p-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
            <button
              type="button"
              onClick={addTeamMember}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-gray-300 w-full sm:w-auto"
            >
              Add
            </button>
          </div>

          {/* Display team members */}
          <div className="mt-2 flex flex-wrap gap-2">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
              >
                <span className="text-sm">{member}</span>
                <button
                  type="button"
                  onClick={() => removeTeamMember(member)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 sm:mt-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Project"
            : "Create Project"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { memo } from "react";
import { Project } from "@/types";
import {
  cn,
  formatDate,
  getDaysRemaining,
  truncateString,
} from "@/utils/helpers";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import Button from "@/components/ui/Button";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";

/**
 * ProjectCard Props
 */
interface ProjectCardProps {
  project: Project;
  onView?: (id: string) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  className?: string;
}

/**
 * Project card component for displaying project information
 */
const ProjectCard = memo(
  ({ project, onView, onDelete, className }: ProjectCardProps) => {
    const { id, name, description, status, progress, dueDate, teamMembers } =
      project;

    // Get priority based on progress and due date
    const getPriority = () => {
      if (progress < 30 && dueDate && getDaysRemaining(dueDate) < 7) {
        return {
          label: "High Priority",
          variant: "danger" as const,
          dotColor: "bg-danger-500",
        };
      } else if (progress < 60 && dueDate && getDaysRemaining(dueDate) < 14) {
        return {
          label: "Mid Priority",
          variant: "warning" as const,
          dotColor: "bg-warning-500",
        };
      } else {
        return {
          label: "Low Priority",
          variant: "success" as const,
          dotColor: "bg-success-500",
        };
      }
    };

    // Get status badge props
    const getStatusBadge = () => {
      switch (status) {
        case "completed":
          return { label: "Completed", variant: "success" as const };
        case "in-progress":
          return { label: "In Progress", variant: "primary" as const };
        default:
          return { label: "Not Started", variant: "secondary" as const };
      }
    };

    const priority = getPriority();
    const statusBadge = getStatusBadge();

    return (
      <Card
        className={cn(
          "h-full transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={statusBadge.variant} withDot>
              {statusBadge.label}
            </Badge>

            <Badge variant={priority.variant} withDot>
              {priority.label}
            </Badge>
          </div>

          {/* Project title */}
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-secondary-600 mb-4">
            {truncateString(description, 120)}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-secondary-700">Progress</span>
              <span className="text-secondary-500">{progress}%</span>
            </div>
            <Progress
              value={progress}
              variant={
                progress >= 75
                  ? "success"
                  : progress >= 40
                  ? "default"
                  : "warning"
              }
            />
          </div>

          {/* Due date */}
          {dueDate && (
            <div className="mb-4 text-xs">
              <span className="text-secondary-500 font-medium">Due: </span>
              <span className="text-secondary-700">{formatDate(dueDate)}</span>
              {getDaysRemaining(dueDate) <= 7 &&
                getDaysRemaining(dueDate) > 0 && (
                  <span className="ml-2 text-warning-600 font-medium">
                    ({getDaysRemaining(dueDate)} days left)
                  </span>
                )}
              {getDaysRemaining(dueDate) <= 0 && (
                <span className="ml-2 text-danger-600 font-medium">
                  (Overdue)
                </span>
              )}
            </div>
          )}

          {/* Team members */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="mb-4">
              <span className="text-xs text-secondary-500 font-medium block mb-2">
                Team:
              </span>
              <div className="flex -space-x-2">
                {teamMembers.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative"
                  >
                    <Image
                      src={`https://i.pravatar.cc/150?u=${member}`}
                      alt="Team member"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ))}
                {teamMembers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-secondary-100 border-2 border-white flex items-center justify-center text-xs font-medium text-secondary-600">
                    +{teamMembers.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 mt-auto pt-3">
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onDelete(id, e)}
                aria-label="Delete project"
              >
                <Trash2 className="h-4 w-4 text-danger-500" />
              </Button>
            )}

            {onView && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onView(id)}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                View
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;

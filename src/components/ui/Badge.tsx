"use client";

import { memo } from "react";
import { BadgeProps } from "@/types";
import { cn } from "@/utils/helpers";

/**
 * Badge component for statuses and labels
 */
const Badge = memo(
  ({
    className,
    children,
    variant = "default",
    size = "md",
    withDot = false,
  }: BadgeProps) => {
    // Size variants
    const sizeClasses = {
      sm: "text-xs px-1.5 py-0.5",
      md: "text-xs px-2 py-1",
      lg: "text-sm px-2.5 py-1",
    };

    // Color variants
    const variantClasses = {
      default: "bg-secondary-100 text-secondary-800",
      primary: "bg-primary-100 text-primary-800",
      secondary: "bg-secondary-100 text-secondary-800",
      success: "bg-success-100 text-success-800",
      warning: "bg-warning-100 text-warning-800",
      danger: "bg-danger-100 text-danger-800",
    };

    // Dot color variants
    const dotColors = {
      default: "bg-secondary-500",
      primary: "bg-primary-500",
      secondary: "bg-secondary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
      danger: "bg-danger-500",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {withDot && (
          <span
            className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full",
              dotColors[variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

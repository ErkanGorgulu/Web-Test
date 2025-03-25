"use client";

import { memo } from "react";
import { ProgressProps } from "@/types";
import { cn } from "@/utils/helpers";

/**
 * Progress bar component to show completion status
 */
const Progress = memo(
  ({
    className,
    value = 0,
    max = 100,
    size = "md",
    showValue = false,
    variant = "default",
  }: ProgressProps) => {
    // Ensure value is within limits
    const normalizedValue = Math.min(Math.max(0, value), max);
    const percentage = (normalizedValue / max) * 100;

    // Size variants
    const sizeClasses = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    };

    // Color variants
    const variantClasses = {
      default: "bg-primary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
      danger: "bg-danger-500",
    };

    return (
      <div className={cn("w-full", className)}>
        <div className="w-full bg-secondary-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "rounded-full transition-all duration-300 ease-in-out",
              sizeClasses[size],
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={normalizedValue}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>

        {showValue && (
          <div className="mt-1 text-xs text-secondary-500 text-right">
            {normalizedValue}/{max}
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;

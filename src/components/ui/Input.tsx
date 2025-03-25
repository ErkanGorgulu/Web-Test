"use client";

import { forwardRef } from "react";
import { InputProps } from "@/types";
import { cn } from "@/utils/helpers";

/**
 * Input component for form fields
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    // Generate an ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-sm font-medium text-secondary-900"
          >
            {label}
          </label>
        )}

        {/* Input wrapper with icons */}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-md shadow-sm border border-secondary-300 py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out",
              error &&
                "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

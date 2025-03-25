"use client";

import { forwardRef } from "react";
import { ButtonProps } from "@/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/helpers";

/**
 * Button component for user interactions
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base button styles
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Size variations
    const sizeStyles = {
      xs: "text-xs px-2 py-1 gap-1",
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2",
    };

    // Variant styles
    const variantStyles = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300",
      secondary:
        "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 disabled:bg-secondary-50 disabled:text-secondary-400",
      outline:
        "border border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500 disabled:text-secondary-300",
      ghost:
        "text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500 disabled:text-secondary-300",
      link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500 disabled:text-primary-300",
      danger:
        "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 disabled:bg-danger-300",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          isLoading && "opacity-80 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

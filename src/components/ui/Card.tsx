"use client";

import { memo } from "react";
import { CardProps } from "@/types";
import { cn } from "@/utils/helpers";
import { Loader2 } from "lucide-react";

/**
 * Card component for containing content with an optional title and footer
 */
const Card = memo(
  ({
    className,
    children,
    title,
    subtitle,
    footer,
    isLoading = false,
  }: CardProps) => {
    return (
      <div
        className={cn(
          "bg-white rounded-lg border border-secondary-200 shadow-sm overflow-hidden",
          className
        )}
      >
        {/* Card header */}
        {(title || subtitle) && (
          <div className="px-5 py-4 border-b border-secondary-200">
            {title && (
              <h3 className="text-lg font-medium text-secondary-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-secondary-600">{subtitle}</p>
            )}
          </div>
        )}

        {/* Card body */}
        <div className="p-5 relative">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[100px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : (
            children
          )}
        </div>

        {/* Card footer */}
        {footer && (
          <div className="px-5 py-4 bg-secondary-50 border-t border-secondary-200">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

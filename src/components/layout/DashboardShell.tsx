"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/utils/helpers";

/**
 * Props for the DashboardShell component
 */
interface DashboardShellProps {
  children: ReactNode;
  heading?: string;
  subheading?: string;
  headerContent?: ReactNode;
  className?: string;
}

/**
 * DashboardShell component
 * Provides a consistent layout structure for dashboard pages
 */
const DashboardShell = memo(
  ({
    children,
    heading,
    subheading,
    headerContent,
    className,
  }: DashboardShellProps) => {
    return (
      <div className={cn("px-4 py-6 sm:p-6 md:p-8", className)}>
        {/* Page header */}
        {(heading || subheading || headerContent) && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {heading && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
                    {heading}
                  </h1>
                )}
                {subheading && (
                  <p className="mt-1 text-sm text-secondary-500">
                    {subheading}
                  </p>
                )}
              </div>

              {headerContent && (
                <div className="flex items-center gap-3">{headerContent}</div>
              )}
            </div>
          </div>
        )}

        {/* Page content */}
        <div>{children}</div>
      </div>
    );
  }
);

DashboardShell.displayName = "DashboardShell";

export default DashboardShell;

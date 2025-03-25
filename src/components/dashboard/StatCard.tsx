"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/utils/helpers";
import Card from "@/components/ui/Card";

/**
 * StatCard Props
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  changeValue?: string;
  changeDirection?: "up" | "down" | "neutral";
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

/**
 * Stat Card component for dashboard metrics
 */
const StatCard = memo(
  ({
    title,
    value,
    icon,
    changeValue,
    changeDirection = "neutral",
    iconColor = "text-primary-600",
    iconBgColor = "bg-primary-50",
    className,
  }: StatCardProps) => {
    const changeColorClass =
      changeDirection === "up"
        ? "text-success-600"
        : changeDirection === "down"
        ? "text-danger-600"
        : "text-secondary-600";

    const changeIcon =
      changeDirection === "up" ? "↑" : changeDirection === "down" ? "↓" : "→";

    return (
      <Card className={cn("border border-secondary-100", className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-secondary-700 text-sm font-medium">{title}</h3>
          {icon && (
            <div className={cn("p-2 rounded-lg", iconBgColor)}>
              <div className={cn("w-5 h-5", iconColor)}>{icon}</div>
            </div>
          )}
        </div>

        <p className="text-xl sm:text-2xl font-bold text-secondary-900">
          {value}
        </p>

        {changeValue && (
          <p className="text-sm text-secondary-600 mt-1">
            <span className={changeColorClass}>
              {changeIcon} {changeValue}
            </span>{" "}
            vs last month
          </p>
        )}
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;

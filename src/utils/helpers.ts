import { type ClassValue, clsx } from "clsx";

/**
 * Combines multiple class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Color palette that matches the Workup design
 */
export const colors = {
  primary: {
    blue: "#1976d2",
    indigo: "#3f51b5",
    purple: "#7e57c2",
    pink: "#e91e63",
  },
  status: {
    high: "#f44336",
    mid: "#ff9800",
    low: "#4caf50",
    completed: "#4caf50",
    inProgress: "#2196f3",
    notStarted: "#9e9e9e",
  },
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  white: "#ffffff",
  black: "#000000",
};

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Calculates the number of days remaining until a due date
 */
export function getDaysRemaining(dueDate: Date | string | undefined): number {
  if (!dueDate) return 0;

  const due = new Date(dueDate);
  const today = new Date();

  // Set hours to 0 to compare just the dates
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

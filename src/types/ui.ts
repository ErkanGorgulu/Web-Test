import {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

/**
 * Common props for all components
 */
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Button component props
 */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Card component props
 */
export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  isLoading?: boolean;
}

/**
 * Input component props
 */
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Textarea component props
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseProps {
  label?: string;
  error?: string;
}

/**
 * Select component props
 */
export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    BaseProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  footer?: ReactNode;
}

/**
 * Badge component props
 */
export interface BadgeProps extends BaseProps {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  withDot?: boolean;
}

/**
 * Progress bar component props
 */
export interface ProgressProps extends BaseProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

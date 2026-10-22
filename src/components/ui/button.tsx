import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  }[size];

  const variantClasses = {
    primary:
      "bg-uaf-navy text-white shadow-neu hover:bg-uaf-deep active:shadow-neu-pressed focus:ring-uaf-navy",
    secondary:
      "bg-uaf-surface text-uaf-navy shadow-neu hover:bg-white active:shadow-neu-pressed focus:ring-uaf-academic",
    danger:
      "bg-red-600 text-white shadow-neu hover:bg-red-700 active:shadow-neu-pressed focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-uaf-surface",
  }[variant];

  return (
    <button
      className={clsx(base, sizeClasses, variantClasses, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

import React from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, name, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || name || generatedId;
    const inputName = name || (id ? id : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-uaf-navy mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={inputName}
          className={clsx(
            "w-full px-3.5 py-2.5 rounded-xl text-sm text-uaf-charcoal bg-uaf-light shadow-neu-inset border border-transparent transition-all focus:outline-none focus:border-uaf-academic focus:bg-white placeholder-gray-400 disabled:opacity-50",
            error && "border-red-500 focus:border-red-600",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

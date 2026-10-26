import React from "react";
import { clsx } from "clsx";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, maxLength, currentLength, className, id, name, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || name || generatedId;
    const textareaName = name || (id ? id : undefined);

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-uaf-navy"
            >
              {label}
            </label>
          )}
          {maxLength !== undefined && currentLength !== undefined && (
            <span className="text-xs text-gray-400 font-mono">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          name={textareaName}
          maxLength={maxLength}
          rows={4}
          className={clsx(
            "w-full px-3.5 py-2.5 rounded-xl text-sm text-uaf-charcoal bg-uaf-light shadow-neu-inset border border-transparent transition-all focus:outline-none focus:border-uaf-academic focus:bg-white placeholder-gray-400 disabled:opacity-50 resize-y",
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

Textarea.displayName = "Textarea";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, required, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1"
          >
            {label}
            {required && <span className="text-neo-accent font-black text-sm">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          required={required}
          className={clsx(
            "w-full p-4 text-base font-bold text-black bg-white rounded-none border-4 border-black transition-colors duration-100 resize-y",
            "placeholder:text-black/40 placeholder:font-normal",
            "focus:outline-none focus:bg-neo-secondary focus:shadow-neo-sm",
            error && "border-neo-accent bg-red-50",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-desc` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs font-bold text-red-600 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${textareaId}-desc`} className="text-xs font-medium text-black/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

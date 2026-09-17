import React, { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1"
          >
            {label}
            {required && <span className="text-neo-accent font-black text-sm">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          required={required}
          className={clsx(
            "w-full h-13 px-4 text-base font-bold text-black bg-white rounded-none border-4 border-black transition-colors duration-100",
            "placeholder:text-black/40 placeholder:font-normal",
            "focus:outline-none focus:bg-neo-secondary focus:shadow-neo-sm",
            error && "border-neo-accent bg-red-50",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-bold text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5px] text-red-600 shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-desc`} className="text-xs font-medium text-black/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

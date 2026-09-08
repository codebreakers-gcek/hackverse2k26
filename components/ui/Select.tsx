import React, { SelectHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, required, options, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1"
          >
            {label}
            {required && <span className="text-neo-accent font-black text-sm">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={clsx(
              "w-full h-13 px-4 pr-10 text-base font-bold text-black bg-white rounded-none border-4 border-black transition-colors duration-100 appearance-none cursor-pointer",
              "focus:outline-none focus:bg-neo-secondary focus:shadow-neo-sm",
              error && "border-neo-accent bg-red-50",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-desc` : undefined}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="font-bold py-2">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 font-black text-black">
            ▼
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-xs font-bold text-red-600 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${selectId}-desc`} className="text-xs font-medium text-black/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

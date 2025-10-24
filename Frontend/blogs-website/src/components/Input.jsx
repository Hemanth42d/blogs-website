import { forwardRef } from "react";

const Input = forwardRef(
  (
    { label, error, type = "text", className = "", required = false, ...props },
    ref
  ) => {
    const inputClasses = `
    w-full px-4 py-2 border border-gray-300 rounded-xl 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-colors placeholder-gray-400
    ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
    ${className}
  `;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input ref={ref} type={type} className={inputClasses} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

import React, { forwardRef } from "react";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
export const Checkbox = forwardRef(({ label, ...props }, ref) => {
  return (
    <div className={"flex items-center gap-2"}>
      <label className="block text-sm font-medium text-gray-400 text-nowrap ">
        {label}
      </label>
      <input type={"checkbox"} className={inputClass} {...props} ref={ref} />
    </div>
  );
});

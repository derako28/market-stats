import React, { forwardRef } from "react";
import cn from "classnames";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block  p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
export const Checkbox = forwardRef(({ label, ...props }, ref) => {
  return (
    <div className={"flex items-center justify-between gap-2"}>
      <label className="block text-sm font-medium text-gray-400 text-nowrap ">
        {label}
      </label>
      <input
        style={{ width: 15, height: 15 }}
        type={"checkbox"}
        className={cn(inputClass, "cursor-pointer")}
        {...props}
        ref={ref}
      />
    </div>
  );
});

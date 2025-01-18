import React, { forwardRef } from "react";
import Select from "react-tailwindcss-select";

const multiSelectClass = {
  menuButton: ({ isDisabled }) =>
    `cursor-pointer w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
      isDisabled ? "bg-gray-200 cursor-not-allowed" : "hover:border-gray-400"
    }`,
  menu: "absolute z-10 w-full bg-white shadow-lg border border-gray-300 rounded-lg py-1 mt-1.5 text-sm text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
  listItem: ({ isSelected }) =>
    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
      isSelected
        ? "text-white bg-blue-500"
        : "text-gray-500 hover:bg-blue-100 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white"
    }`,
};

export const MultiSelectMy = forwardRef(
  (
    {
      options = [],
      label = "",
      width = 240,
      inputHeight = 40,
      onChange,
      onBlur,
      name,
      value,
      ...props
    },
    ref,
  ) => {
    const handleSelectAll = () => {
      const allValues = options.map((option) => option.value);
      onChange?.({ target: { name, value: allValues } });
    };

    const handleClearAll = () => {
      onChange?.({ target: { name, value: [] } });
    };

    return (
      <div style={{ minWidth: width }} ref={ref}>
        <label className="block mb-2 text-sm font-medium text-gray-400">
          {label}
        </label>
        <div className="flex items-center justify-between mb-1">
          {/*<button*/}
          {/*  type="button"*/}
          {/*  onClick={handleSelectAll}*/}
          {/*  className="text-blue-500 hover:underline"*/}
          {/*>*/}
          {/*  Выбрать все*/}
          {/*</button>*/}
          {/*<button*/}
          {/*  type="button"*/}
          {/*  onClick={handleClearAll}*/}
          {/*  className="text-red-500 hover:underline"*/}
          {/*>*/}
          {/*  Очистить все*/}
          {/*</button>*/}
        </div>
        <Select
          primaryColor={""}
          id={name}
          options={options}
          value={options.filter((option) => value?.includes(option.value))}
          onChange={(selectedOptions) => {
            const newValue =
              selectedOptions?.map((option) => option.value) || [];
            onChange?.({ target: { name, value: newValue } });
          }}
          onBlur={(event) => {
            onBlur?.({ target: { name } });
          }}
          isMultiple
          classNames={{
            ...multiSelectClass,
          }}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: `${inputHeight}px`,
              height: `${inputHeight}px`,
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: "#f9fafb",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0",
              height: `${inputHeight}px`,
              display: "flex",
              alignItems: "center",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: `${inputHeight}px`,
              display: "flex",
              alignItems: "center",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
            }),
          }}
          {...props}
        />
      </div>
    );
  },
);

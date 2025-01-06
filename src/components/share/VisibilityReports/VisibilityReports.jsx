import { Checkbox } from "../Checkbox/checkbox.jsx";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { REPORT_TYPES } from "../../../utils/constants.js";

const initialData = {
  [REPORT_TYPES.GREEN_RED_DAYS]: true,
  [REPORT_TYPES.IB_BREAKOUT]: true,
  [REPORT_TYPES.IB_SIZES]: true,
  [REPORT_TYPES.TABLE]: true,
};

export const VisibilityReports = ({ options, onChange }) => {
  const setupVisibilities = JSON.parse(
    localStorage.getItem("VisibilityReports"),
  );
  const { control, register, getValues, reset, handleSubmit } = useForm({
    defaultValues: setupVisibilities || initialData,
  });

  const handleChange = () => {
    onChange(getValues());

    localStorage.setItem("VisibilityReports", JSON.stringify(getValues()));
  };

  useEffect(() => {
    onChange(getValues());
  }, []);

  return (
    <>
      <form onChange={handleChange}>
        <div className={"flex flex-wrap justify-center items-center gap-4"}>
          {options?.map(({ id, label }) => (
            <Checkbox label={label} key={id} {...register(id)} />
          ))}
        </div>
      </form>
    </>
  );
};

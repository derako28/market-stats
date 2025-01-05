import { Checkbox } from "../Checkbox/checkbox.jsx";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const initialData = {
  GreenRadDays: true,
  IBBreakout: true,
  IBSizes: true,
};
export const VisibilityReports = ({ onChange }) => {
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
          <Checkbox
            label={"Green & Red Days"}
            key={"GreenRadDays"}
            {...register("GreenRadDays")}
          />
          <Checkbox
            label={"IB Breakout"}
            key={"IBBreakout"}
            {...register("IBBreakout")}
          />
          <Checkbox
            label={"IB Sizes"}
            key={"IBSizes"}
            {...register("IBSizes")}
          />
        </div>
      </form>
    </>
  );
};

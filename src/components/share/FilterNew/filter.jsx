import { Controller, useForm } from "react-hook-form";
import { DatepickerMY } from "../Datepicker/datepicker.jsx";
import {
  DATE_RANGE_VALUE,
  FILTER_TYPES,
  TICKERS,
} from "../../../utils/constants.js";
import { SelectMy } from "../Select/select.jsx";
import { Button } from "../Button/button.jsx";
import { Input } from "../Input/input.jsx";
import { MultiSelectMy } from "../MultiSelect/multi-select.jsx";
import moment from "moment";
import { useEffect } from "react";

const defaultValue = {
  ticker: TICKERS.ES,
  date_range: DATE_RANGE_VALUE.SIX_MONTH,
  ibBroken: "",
  open_relation: "",
  ib_size_from: "",
  ib_size_to: "",
  day: "",
};
export const Filter = ({ options, onChange }) => {
  const setupFilter = JSON.parse(localStorage.getItem("dataFilter"));

  const { control, register, getValues, reset, handleSubmit } = useForm({
    defaultValues: defaultValue,
  });

  const handleOnChange = () => {
    onChange(getValues());
  };

  const onSubmit = () => {
    handleOnChange();

    localStorage.setItem("dataFilter", JSON.stringify(getValues()));
  };
  const onReset = () => {
    reset({ ...defaultValue, ticker: getValues("ticker") });

    handleOnChange();
    localStorage.removeItem("dataFilter");
  };

  useEffect(() => {
    if (setupFilter) {
      reset(setupFilter);
    }

    handleOnChange();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={"flex align-middle items-end my-5 px-4 gap-3"}>
          {options.map((column) => {
            if (column.type === FILTER_TYPES.DATEPICKER_RANGE) {
              return (
                <Controller
                  key={column.id}
                  name={column.id}
                  control={control}
                  render={({ field }) => (
                    <DatepickerMY label={column.title} {...field} />
                  )}
                />
              );
            }

            if (column.type === FILTER_TYPES.SELECT && !column.filter) {
              return (
                <SelectMy
                  options={column.options}
                  label={column.title}
                  key={column.id}
                  {...register(column.id)}
                />
              );
            }

            // if(column.type === FILTER_TYPES.MULTI_SELECT && !column.filter){
            //     return  <MultiSelectMy options={column.options} label={column.title} key={column.id} {...register(column.id)}/>
            // }

            if (column.type === FILTER_TYPES.MULTI_SELECT) {
              return (
                <Controller
                  key={column.id}
                  name={column.id}
                  control={control}
                  render={({ field }) => (
                    <MultiSelectMy
                      label={column.title}
                      options={column.options}
                      {...field}
                    />
                  )}
                />
              );
            }

            return (
              column.filter ?? (
                <Input
                  label={column.title}
                  name={column.id}
                  key={column.id}
                  {...register(column.id)}
                />
              )
            );
          })}

          <Button onClick={onReset} className={"self-end"} label={"Reset"} />
          <Button onClick={onSubmit} className={"self-end"} label={"Apply"} />
        </div>
      </form>
    </>
  );
};

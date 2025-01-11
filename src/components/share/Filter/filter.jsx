import { Controller, useForm } from "react-hook-form";
import { DatepickerMY } from "../Datepicker/datepicker.jsx";
import { DATE_RANGE_VALUE, FILTER_TYPES } from "../../../utils/constants.js";
import { SelectMy } from "../Select/select.jsx";
import { Button } from "../Button/button.jsx";
import { Input } from "../Input/input.jsx";
import { MultiSelectMy } from "../MultiSelect/multi-select.jsx";
import moment from "moment";

const defaultValue = {
  ib_size: null,
  date: {
    startDate: "01-01-2024",
    endDate: "31-01-2024",
  },
};
export const Filter = ({ options, initialData, onChange }) => {
  const { control, register, getValues, reset, handleSubmit } = useForm();

  const onSubmit = () => {
    onChange(dataFilter());
  };

  const onReset = () => {
    reset();
    onChange(initialData);
  };

  const handleChange = () => {
    onChange(dataFilter());
  };

  const dataFilter = () => {
    const dataFilter = getValues();

    const startDate = moment(dataFilter.date?.startDate);
    const endDate = moment(dataFilter.date?.endDate);

    return initialData.filter((item) => {
      return Object.keys(dataFilter).every((key) => {
        if (dataFilter[key] === "" || dataFilter[key] === undefined)
          return true;

        if (key === "day") {
          return moment(item.date).day() === +dataFilter.day;
        }

        if (key === "date") {
          const currentDate = moment(item.date);

          return moment(currentDate).isBetween(startDate, endDate);
        }

        if (key === "ibSize") {
          return +item[key] === +dataFilter[key];
        }

        if (key === "ib_size_from") {
          return +dataFilter.ib_size_from <= +item.ibSize;
        }

        if (key === "ib_size_to") {
          return +dataFilter.ib_size_to >= +item.ibSize;
        }

        if (key === "opening_type") {
          return item.opening_type.includes(dataFilter.opening_type);
        }

        if (key === "date_range") {
          const dateEl = moment(item.date);
          const now = moment();

          if (dataFilter[key] === DATE_RANGE_VALUE.LAST_MONTH) {
            const startDate = now.clone().subtract(1, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.THREE_MONTH) {
            const startDate = now.clone().subtract(3, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.SIX_MONTH) {
            const startDate = now.clone().subtract(6, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.ONE_YEAR) {
            const startDate = now.clone().subtract(1, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.TWO_YEAR) {
            const startDate = now.clone().subtract(2, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.THREE_YEAR) {
            const startDate = now.clone().subtract(3, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.FOUR_YEAR) {
            const startDate = now.clone().subtract(4, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.FIVE_YEAR) {
            const startDate = now.clone().subtract(5, "year");

            return dateEl.isBetween(startDate, now, "day");
          }
        }

        return item[key]
          ?.toString()
          .toLowerCase()
          ?.includes(dataFilter[key].toString().toLowerCase());
      });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleChange}>
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

          <Button onClick={onReset} label={"Reset"} />
          <Button onClick={onSubmit} label={"Apply"} />
        </div>
      </form>
    </>
  );
};

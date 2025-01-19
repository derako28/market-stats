import { Controller, useForm } from "react-hook-form";
import { DatepickerMY } from "../Datepicker/datepicker.jsx";
import {
  CANDLE_TYPES,
  CLOSE_B_PERIOD,
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  FIRST_FORMED,
  IB_BREAKOUT_OPTIONS,
  OPENING_TYPES_FILTER,
  OPENS_OPTIONS,
  TICKERS,
} from "../../../utils/constants.js";
import { SelectMy } from "../Select/select.jsx";
import { Button } from "../Button/button.jsx";
import { Input } from "../Input/input.jsx";
import { MultiSelectMy } from "../MultiSelect/multi-select.jsx";
import { useEffect } from "react";
import { getSetting } from "../../../pages/Reports/utils.js";
import { getOptions } from "../../../pages/Stats/utils.js";
import { useDebounce } from "../../../Hooks/useDebounce.js";

const filterOptions = [
  {
    id: "ticker",
    title: "Ticker",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TICKERS),
  },
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  {
    id: "opening_type",
    title: "Opening Type",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENING_TYPES_FILTER),
  },
  {
    id: "first_candle",
    title: "First Period",
    type: FILTER_TYPES.SELECT,
    options: getOptions(CANDLE_TYPES),
  },
  {
    id: "firstSideFormed",
    title: "First Side Formed",
    type: FILTER_TYPES.SELECT,
    options: getOptions(FIRST_FORMED),
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "firstBreakout",
    title: "First IB Breakout",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BREAKOUT_OPTIONS),
  },
  // {
  //   id: "firstBreakoutInPeriod",
  //   title: "First IB Breakout In Period",
  //   type: FILTER_TYPES.MULTI_SELECT,
  //   options: getOptions(BREAKOUT_PERIODS_LABEL).slice(2),
  // },
  // {
  //   id: "ib_breakout",
  //   title: "IB Breakout",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(IB_BREAKOUT_OPTIONS),
  // },
  {
    id: "day",
    title: "Weekday",
    type: FILTER_TYPES.SELECT,
    options: DAYS_OPTIONS,
  },
  {
    id: "closing_b_period",
    title: "Closing B Period",
    type: FILTER_TYPES.SELECT,
    options: getOptions(CLOSE_B_PERIOD),
  },
  {
    id: "date_range",
    title: "Date Range",
    type: FILTER_TYPES.SELECT,
    options: DATE_RANGE_OPTIONS,
  },
];

const defaultValue = {
  ticker: TICKERS.ES,
  date_range: "",
  firstBreakout: "",
  firstBreakoutInPeriod: "",
  ib_breakout: "",
  open_relation: "",
  opening_type: "",
  first_candle: "",
  firstSideFormed: "",
  ib_size_from: "",
  ib_size_to: "",
  day: "",
  closing_b_period: "",
};

export const Filter = ({ onChange }) => {
  const setupFilter = JSON.parse(localStorage.getItem("dataFilter"));
  const visibilitySetting = getSetting();

  const { control, register, getValues, reset, watch } = useForm({
    defaultValues: defaultValue,
  });

  // Слежение за значениями
  const ibSizeFromValue = watch("ib_size_from");
  const ibSizeToValue = watch("ib_size_to");

  // Дебаунс для инпутов
  const debouncedIbSizeFrom = useDebounce(ibSizeFromValue, 500);
  const debouncedIbSizeTo = useDebounce(ibSizeToValue, 500);

  useEffect(() => {
    // Обновляем фильтр только для инпутов с дебаунсом
    onChange({
      ...getValues(),
      ib_size_from: debouncedIbSizeFrom,
      ib_size_to: debouncedIbSizeTo,
    });
  }, [debouncedIbSizeFrom, debouncedIbSizeTo]);

  const handleOnChange = () => {
    // Мгновенно обновляем фильтры для всех остальных элементов
    onChange(getValues());
  };

  const onReset = () => {
    reset({ ...defaultValue, ticker: getValues("ticker") });
    onChange(getValues());
    localStorage.removeItem("dataFilter");
  };

  useEffect(() => {
    if (setupFilter) {
      reset(setupFilter);
    }
    handleOnChange();
  }, []);

  if (!visibilitySetting) return null;

  return (
    <div className="flex justify-center items-center gap-4 text-white px-4 md:px-8 lg:px-12 mx-auto max-w-screen-xl2 rounded-xl">
      <form>
        <div className="flex flex-wrap items-end my-5 gap-3">
          {filterOptions
            .filter((column) => visibilitySetting[column.id])
            .map((column) => {
              if (column.type === FILTER_TYPES.DATEPICKER_RANGE) {
                return (
                  <div key={column.id} className="w-full sm:w-auto">
                    <Controller
                      name={column.id}
                      control={control}
                      render={({ field }) => (
                        <DatepickerMY
                          label={column.title}
                          {...field}
                          onChange={handleOnChange}
                        />
                      )}
                    />
                  </div>
                );
              }

              if (column.type === FILTER_TYPES.SELECT && !column.filter) {
                return (
                  <div key={column.id} className="w-full sm:w-auto">
                    <SelectMy
                      options={column.options}
                      label={column.title}
                      {...register(column.id, { onChange: handleOnChange })}
                    />
                  </div>
                );
              }

              if (column.type === FILTER_TYPES.MULTI_SELECT) {
                return (
                  <div key={column.id} className="w-full sm:w-auto">
                    <Controller
                      name={column.id}
                      control={control}
                      render={({ field }) => (
                        <MultiSelectMy
                          label={column.title}
                          options={column.options}
                          {...field}
                          onChange={handleOnChange}
                        />
                      )}
                    />
                  </div>
                );
              }

              if (["ib_size_from", "ib_size_to"].includes(column.id)) {
                return (
                  <div key={column.id} className="w-full sm:w-auto">
                    <Input
                      label={column.title}
                      name={column.id}
                      {...register(column.id)}
                    />
                  </div>
                );
              }

              return (
                column.filter ?? (
                  <div key={column.id} className="w-full sm:w-auto">
                    <Input
                      label={column.title}
                      name={column.id}
                      {...register(column.id, { onBlur: handleOnChange })}
                    />
                  </div>
                )
              );
            })}

          <div className="flex flex-auto gap-2 mt-2 sm:mt-0">
            <div className="flex-auto">
              <Button
                onClick={onReset}
                className="w-full sm:w-auto"
                label="Reset"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

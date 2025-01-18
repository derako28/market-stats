import { useForm } from "react-hook-form";
import { Checkbox } from "../../../../components/share/Checkbox/checkbox.jsx";
import {
  CANDLE_TYPES,
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  FIRST_FORMED,
  IB_BREAKOUT_OPTIONS,
  OPENING_TYPES_FILTER,
  OPENS_OPTIONS,
  REPORT_LABELS,
  REPORT_TYPES,
  TICKERS,
} from "../../../../utils/constants.js";
import { getOptions } from "../../../Stats/utils.js";
import { useEffect } from "react";
import { getSetting } from "../../utils.js";

const filterOptions = [
  {
    id: "ticker",
    title: "Ticker",
  },
  {
    id: "open_relation",
    title: "Open Relation",
  },
  {
    id: "opening_type",
    title: "Opening Type",
  },
  {
    id: "first_candle",
    title: "First Candle",
  },
  {
    id: "firstSideFormed",
    title: "First Side Formed",
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "firstBreakout",
    title: "First IB Breakout",
  },
  {
    id: "ib_breakout",
    title: "IB Breakout",
  },
  { id: "day", title: "Day" },
  {
    id: "date_range",
    title: "Date Range",
  },
  {
    id: "closing_b_period",
    title: "Closing B Period",
  },
];

const visibilityOptions = Object.keys(REPORT_TYPES).map((key) => {
  return {
    id: REPORT_TYPES[key],
    label: REPORT_LABELS[key],
  };
});

export const PageSettings = ({ onChange }) => {
  const setupSettings = getSetting();
  const { register, getValues, reset } = useForm({});

  const handleChange = () => {
    onChange(getValues());

    localStorage.setItem("settings", JSON.stringify(getValues()));
  };

  useEffect(() => {
    setupSettings && reset(setupSettings);
  }, []);

  useEffect(() => {
    if (!setupSettings) {
      const defaultValue = [...filterOptions, ...visibilityOptions].reduce(
        (acc, item) => {
          acc[item.id] = true;
          return acc;
        },
        {},
      );

      onChange(defaultValue);
      localStorage.setItem("settings", JSON.stringify(defaultValue));
    }
  }, []);

  return (
    <>
      <form onChange={handleChange}>
        <div className={"flex flex-col space-y-4 "} style={{ width: 200 }}>
          <div className={"flex flex-col gap-1"}>
            <h4 className={"mb-2"}>Filters:</h4>
            {filterOptions?.map((item) => (
              <Checkbox
                label={item.title}
                key={item.id}
                {...register(item.id)}
              />
            ))}
          </div>

          <div className={"flex flex-col gap-1"}>
            <h4 className={"mb-2"}>Components:</h4>
            {visibilityOptions?.map((item) => (
              <Checkbox
                label={item.label}
                key={item.id}
                {...register(item.id)}
              />
            ))}
          </div>
        </div>
      </form>
    </>
  );
};

import React, { useState } from "react";

import { Filter } from "../../components/share/FilterNew/filter.jsx";
import {
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  IB_BROKEN_OPTIONS,
  OPENS_OPTIONS,
  TICKERS,
} from "../../utils/constants.js";
import { getOptions } from "../Stats/utils.js";
import { GreenRedDaysByWeekDay } from "./components/GreenRedDaysByWeekDay.jsx";
import { VisibilityReports } from "../../components/share/VisibilityReports/VisibilityReports.jsx";
import { IBBreakout } from "./components/IBBreakout.jsx";
import { getData } from "./getData.js";
import { IBSizes } from "./components/IBSizes.jsx";

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
  // {
  //   id: "first_candle",
  //   title: "First Candle",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(CANDLE_TYPES),
  // },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "ibBroken",
    title: "IB Broken",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BROKEN_OPTIONS),
  },
  { id: "day", title: "Day", type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
  {
    id: "date_range",
    title: "Date Range",
    type: FILTER_TYPES.SELECT,
    options: DATE_RANGE_OPTIONS,
  },
];

export const Reports = () => {
  const [ticker, setTicker] = useState(TICKERS.ES);
  const [initialData, setInitialData] = useState(null);
  const [tableData, setTableData] = useState(initialData);
  const [visibilityReports, setVisibilityReports] = useState({});

  const onFilterData = (dataFilter) => {
    if (dataFilter && ticker !== dataFilter?.ticker) {
      setInitialData(getData(dataFilter));
      setTicker(dataFilter.ticker);
    }
    setTableData(getData(dataFilter));
  };

  const onVisibleReports = (data) => setVisibilityReports(data);

  return (
    <div className={"px-4 py-8"}>
      <div className={"mb-8"}>
        <div className="flex justify-center items-center gap-4 text-white px-4 md:px-8 lg:px-12 mx-auto max-w-screen-xl rounded-xl shadow-lg">
          <Filter options={filterOptions} onChange={onFilterData} />
        </div>
        <VisibilityReports onChange={onVisibleReports} />
      </div>

      {visibilityReports?.GreenRadDays && (
        <GreenRedDaysByWeekDay data={tableData} />
      )}

      {visibilityReports?.IBBreakout && <IBBreakout data={tableData} />}
      {visibilityReports?.IBSizes && <IBSizes data={tableData} />}
    </div>
  );
};

import dataWeekly from "../../Data-TW/FDAX-Weekly.json";
import dataDaily from "../../Data-TW/FDAX-Daily.json";

import { Page } from "../../components/share/Page/page.jsx";
import { DAYS_OPTIONS, FILTER_TYPES } from "../../utils/constants.js";
import { prepareDataForSizeRange } from "./utils.js";
import { AgCharts } from "ag-charts-react";
import {
  getBarChartHorizontalConfig,
  getDataIBSizeChart,
} from "../Stats/utils.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { useState } from "react";

const filterOptions = [
  {
    id: "time",
    title: "Weekday",
    type: FILTER_TYPES.SELECT,
    options: DAYS_OPTIONS,
  },
];

const initialDataWeekly = prepareDataForSizeRange(dataWeekly);
const initialDataDaily = prepareDataForSizeRange(dataDaily);

export const DaxWeekly = () => {
  const [tableData, setTableData] = useState(initialDataDaily);

  const onFilterData = (data) => setTableData(data);

  return (
    <Page noHeader={false}>
      <>
        <Filter
          options={filterOptions}
          initialData={initialDataDaily}
          onChange={onFilterData}
        />
        <div className={"flex justify-center gap-16 mt-20 mb-10"}>
          <div className={"flex flex-col justify-center items-center"}>
            <div className={"text-gray-300"}>Weakly Range</div>
            <AgCharts
              options={getBarChartHorizontalConfig(
                getDataIBSizeChart(initialDataWeekly, "range"),
                initialDataWeekly.length,
                1700,
                300,
              )}
            />

            <div>Weeks: {initialDataWeekly.length}</div>
          </div>
        </div>

        <div className={"flex justify-center gap-16 mt-20 mb-10"}>
          <div className={"flex flex-col justify-center items-center"}>
            <div className={"text-gray-300"}>Daily Range</div>
            <AgCharts
              options={getBarChartHorizontalConfig(
                getDataIBSizeChart(tableData, "range"),
                tableData.length,
                1700,
                300,
              )}
            />

            <div>Days: {tableData.length}</div>
          </div>
        </div>
      </>
    </Page>
  );
};

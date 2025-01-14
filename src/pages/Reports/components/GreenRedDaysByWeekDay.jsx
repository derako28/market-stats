import { ChartBar } from "./share/ChartBar.jsx";
import { InsightsTable } from "./share/InsightsTable.jsx";
import React from "react";
import { getChartDataGreenRedDays } from "../utils.js";

export const GreenRedDaysByWeekDay = ({ data }) => {
  return (
    <div className="text-white mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-4">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Green & Red Days by weekday</h3>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-inner">
          <ChartBar data={getChartDataGreenRedDays(data).dataSet} />
        </div>
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-inner">
          <InsightsTable data={getChartDataGreenRedDays(data).insights} />
        </div>
      </div>
    </div>
  );
};

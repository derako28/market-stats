import { ChartBar } from "./share/ChartBar.jsx";
import { InsightsTable } from "./share/InsightsTable.jsx";
import React from "react";
import { getChartDataGreenRedDays } from "../utils.js";

export const GreenRedDaysByWeekDay = ({ data }) => {
  return (
    <div className="text-white mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-12">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-semibold">
            ES green & red days by weekday
          </h3>
          {/*<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition">*/}
          {/*  Customize*/}
          {/*</button>*/}
        </div>
        {/*<p className="text-xs md:text-sm text-gray-400">*/}
        {/*  custom settings: open to close candle*/}
        {/*</p>*/}
        {/*<p className="text-xs md:text-sm text-gray-400">*/}
        {/*  07/04/2024 - 01/02/2025*/}
        {/*</p>*/}
        {/*<p className="text-xs md:text-sm text-gray-400">*/}
        {/*  built by <span className="text-blue-400 underline">Quiet</span>*/}
        {/*</p>*/}
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

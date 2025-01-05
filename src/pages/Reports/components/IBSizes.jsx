import { ChartBar } from "./share/ChartBar.jsx";
import { getChartDataIBSizes } from "../utils.js";
import React from "react";

export const IBSizes = ({ data }) => {
  return (
    <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-12">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-semibold">IB Sizes</h3>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-inner">
          <ChartBar data={getChartDataIBSizes(data).dataSet} />
        </div>
        {/*<div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-inner">*/}
        {/*  <InsightsTable data={getChartDataGreenRedDays(data).insights} />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

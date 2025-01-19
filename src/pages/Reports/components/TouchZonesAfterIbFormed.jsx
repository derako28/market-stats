import { ChartBar } from "./share/ChartBar.jsx";
import React from "react";
import { getChartDataTouchesZones50IB } from "../utils.js";

export const TouchZonesAfterIbFormed = ({ data }) => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold">Touch 50% IB</h3>
            </div>
            <ChartBar data={getChartDataTouchesZones50IB(data)} />
          </div>
        </div>
      </div>
    </>
  );
};

import { ChartBar } from "./share/ChartBar.jsx";
import React from "react";
import { getChartDataIBBreakout } from "../utils.js";
import { FIRST_FORMED } from "../../../utils/constants.js";

export const IBBreakout = ({ data }) => {
  const firstFormedLow = data.filter(
    ({ firstSideFormed }) => firstSideFormed === FIRST_FORMED.LOW,
  );
  const firstFormedHigh = data.filter(
    ({ firstSideFormed }) => firstSideFormed === FIRST_FORMED.HIGH,
  );

  return (
    <>
      <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold">IB Breakout</h3>
            </div>
            <ChartBar data={getChartDataIBBreakout(data, "firstBreakout")} />
          </div>
          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold">
                IB <strong>Low</strong> formed first
              </h3>
            </div>
            <ChartBar
              data={getChartDataIBBreakout(firstFormedLow, "firstBreakout")}
            />
          </div>
          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold">
                IB <strong>High</strong> formed first
              </h3>
            </div>

            <ChartBar
              data={getChartDataIBBreakout(firstFormedHigh, "firstBreakout")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

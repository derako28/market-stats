import React from "react";
import {
  getChartDataIBBreakout,
  getChartDonutDataIBBreakout,
} from "../utils.js";
import {
  IB_BREAKOUT_OPTIONS,
  IB_BREAKOUT_SIDES_OPTIONS,
} from "../../../utils/constants.js";
import { ChartBar } from "./share/ChartBar.jsx";
import { ChartPie } from "./share/ChartPie.jsx";

export const IBBreakout = ({ data }) => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold">IB Breakout</h3>
            </div>
            <ChartBar
              data={getChartDataIBBreakout(
                data,
                "firstBreakout",
                IB_BREAKOUT_OPTIONS,
              )}
            />
          </div>

          <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner">
            <ChartPie
              data={getChartDonutDataIBBreakout(
                data,
                "ib_breakout",
                IB_BREAKOUT_SIDES_OPTIONS,
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

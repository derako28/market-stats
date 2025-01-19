import { SelectMy } from "../../../components/share/Select/select.jsx";
import {
  IB_BREAKOUT_OPTIONS,
  PERCENTAGE_OPTIONS,
} from "../../../utils/constants.js";
import { ChartBar } from "./share/ChartBar.jsx";
import { getChartDataRetestIB } from "../utils.js";
import { getDataWithTestIB } from "../../../utils/prepareData.js";
import React, { useEffect, useState } from "react";

export const RetestIB = ({ data }) => {
  const [zonePercentFromHigh, setZonePercentFromHigh] = useState(50);
  const [zonePercentFromLow, setZonePercentFromLow] = useState(50);

  const [
    zonePercentFromHighAfterBreakout,
    setZonePercentFromHighAfterBreakout,
  ] = useState(50);
  const [zonePercentFromLowAfterBreakout, setZonePercentFromLowAfterBreakout] =
    useState(50);

  const firstBreakoutLow = data.filter(
    ({ firstBreakout }) => firstBreakout === IB_BREAKOUT_OPTIONS.ib_low_broken,
  );
  const firstBreakoutHigh = data.filter(
    ({ firstBreakout }) => firstBreakout === IB_BREAKOUT_OPTIONS.ib_high_broken,
  );
  const handleZoneChangeHigh = (e) =>
    setZonePercentFromHigh(Number(e.target.value));
  const handleZoneChangeLow = (e) => {
    setZonePercentFromLow(Number(e.target.value));
  };

  const handleZoneChangeHighAfterBreakout = (e) =>
    setZonePercentFromHighAfterBreakout(Number(e.target.value));
  const handleZoneChangeLowAfterBreakout = (e) => {
    setZonePercentFromLowAfterBreakout(Number(e.target.value));
  };

  return (
    <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold">
              Retest IB <span className={"text-orange-500"}>Until</span>{" "}
              Breakout
              <span className={"text-green-500 font-bold"}> High </span>(
              {firstBreakoutHigh.length} days)
            </h3>
            <SelectMy
              className="absolute top-0 right-0 bg-gray-700 text-white rounded-md p-2"
              value={zonePercentFromHigh}
              onChange={handleZoneChangeHigh}
              options={PERCENTAGE_OPTIONS}
            />
          </div>
          <ChartBar
            data={getChartDataRetestIB(
              getDataWithTestIB(firstBreakoutHigh, zonePercentFromHigh),
              "testZoneIbUntilBreakout",
            )}
          />
        </div>

        <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold">
              Retest IB <span className={"text-orange-500"}>Until</span>{" "}
              Breakout
              <span className={"text-red-500 font-bold"}> Low </span>(
              {firstBreakoutLow.length} days)
            </h3>
            <SelectMy
              className="absolute top-0 right-0 bg-gray-700 text-white rounded-md p-2"
              value={zonePercentFromLow}
              onChange={handleZoneChangeLow}
              options={PERCENTAGE_OPTIONS}
            />
          </div>
          <ChartBar
            data={getChartDataRetestIB(
              getDataWithTestIB(firstBreakoutLow, zonePercentFromLow),
              "testZoneIbUntilBreakout",
            )}
          />
        </div>
      </div>

      {/*AFTER BREAKOUT*/}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold">
              Retest IB <span className={"text-orange-500"}>After</span>{" "}
              Breakout
              <span className={"text-green-500 font-bold"}> High </span>(
              {firstBreakoutHigh.length} days)
            </h3>
            <SelectMy
              className="absolute top-0 right-0 bg-gray-700 text-white rounded-md p-2"
              value={zonePercentFromHighAfterBreakout}
              onChange={handleZoneChangeHighAfterBreakout}
              options={PERCENTAGE_OPTIONS}
            />
          </div>
          <ChartBar
            data={getChartDataRetestIB(
              getDataWithTestIB(
                firstBreakoutHigh,
                zonePercentFromHighAfterBreakout,
              ),
              "testZoneIbAfterBreakout",
            )}
          />
        </div>

        <div className="flex-1 bg-gray-800 p-4 rounded-md shadow-inner relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold">
              Retest IB <span className={"text-orange-500"}>After</span>{" "}
              Breakout
              <span className={"text-red-500 font-bold"}> Low </span>(
              {firstBreakoutLow.length} days)
            </h3>
            <SelectMy
              className="absolute top-0 right-0 bg-gray-700 text-white rounded-md p-2"
              value={zonePercentFromLowAfterBreakout}
              onChange={handleZoneChangeLowAfterBreakout}
              options={PERCENTAGE_OPTIONS}
            />
          </div>
          <ChartBar
            data={getChartDataRetestIB(
              getDataWithTestIB(
                firstBreakoutLow,
                zonePercentFromLowAfterBreakout,
              ),
              "testZoneIbAfterBreakout",
            )}
          />
        </div>
      </div>
    </div>
  );
};

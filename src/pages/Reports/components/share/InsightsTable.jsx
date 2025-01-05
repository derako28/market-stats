import React from "react";
import { getChartDataGreenRedDays } from "../../utils.js";
import { DAY_TRENDS, DAYS_LABEL } from "../../../../utils/constants.js";

const getTotal = (data) => {
  return Object.keys(data).reduce(
    (acc, weekday) => {
      const item = data[weekday];

      acc.bullishDays = acc.bullishDays + item.bullish;
      acc.bearishDays = acc.bearishDays + item.bearish;
      acc.totalDays = acc.totalDays + item.total;

      return acc;
    },
    {
      bullishDays: 0,
      bearishDays: 0,
      totalDays: 0,
    },
  );
};

export const InsightsTable = ({ data }) => {
  const { bullishDays, bearishDays, totalDays } = getTotal(data);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs md:text-sm text-gray-400">
        <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="py-2 px-4">Day</th>
            <th className="py-2 px-4">Green Days</th>
            <th className="py-2 px-4">Red Days</th>
            <th className="py-2 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(DAYS_LABEL).map((day) => {
            const { bullish, bearish, total } = data[day];
            return (
              <tr
                key={day}
                className="hover:bg-gray-700 transition-colors border-b border-gray-700"
              >
                <td className="py-2 px-4">{day}</td>
                <td className="py-2 px-4">{bullish}</td>
                <td className="py-2 px-4">{bearish}</td>
                <td className="py-2 px-4">{total}</td>
              </tr>
            );
          })}
          <tr className="font-semibold bg-gray-800 text-white">
            <td className="py-2 px-4 font-bold">Total</td>
            <td className="py-2 px-4  font-bold">{bullishDays}</td>
            <td className="py-2 px-4 font-bold">{bearishDays}</td>
            <td className="py-2 px-4 font-bold">{totalDays}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

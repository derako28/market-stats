import { AgCharts } from "ag-charts-react";
import { getBarChartHorizontalConfig, getDataChart } from "./utils.js";

export const ChartBar = ({
  data,
  customHandler,
  property,
  title,
  labels,
  width,
  height,
}) => {
  return (
    <>
      <div className={"flex flex-col justify-center items-center"}>
        <div className={"text-gray-300"}>{title}</div>
        <AgCharts
          options={
            customHandler
              ? customHandler()
              : getBarChartHorizontalConfig(
                  getDataChart(data, property, labels),
                  data.length,
                  width,
                  height,
                )
          }
        />
      </div>
    </>
  );
};

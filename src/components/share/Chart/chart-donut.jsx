import { AgCharts } from "ag-charts-react";
import { getChartConfig } from "../../../pages/Stats/utils.js";

export const ChartDonut = ({
  data,
  customHandler,
  property,
  title,
  labels,
  width = 700,
  height = 700,
}) => {
  return (
    <>
      <div className={"flex flex-col justify-center items-center"}>
        <div className={"text-gray-300 mb-4"}>{title}</div>
        <AgCharts
          options={
            customHandler
              ? customHandler(data, property, labels, width, height)
              : getChartConfig(data, property, labels, width, height)
          }
        />
      </div>
    </>
  );
};

import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const getOptions = (paramsOptions) => {
  return {
    responsive: true,

    plugins: {
      datalabels: {
        color: "#fff",
        size: 12,
        formatter: (value) => labelFormatter(value, paramsOptions?.symbol),
        font: {
          size: 14,
        },
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        display: paramsOptions?.legend || true,
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 10,
          },
        },
      },
    },
    // layout: {
    //   padding: {
    //     top: 20, // Отступ сверху
    //     bottom: 20, // Отступ снизу
    //   },
    // },
    // scales: {
    //   x: {
    //     stacked: true,
    //     ticks: { color: "#ffffff" },
    //     grid: { color: "#374151" },
    //   },
    //   y: {
    //     stacked: true,
    //     ticks: { color: "#ffffff" },
    //     grid: { color: "#374151" },
    //   },
    // },
  };
};

const labelFormatter = (value, symbol = "percent") => {
  const symbolFoLabel = symbol === "percent" ? "%" : "";

  return value > 0 ? value + symbolFoLabel : null;
};

export const ChartDonut = ({ data, paramsOptions }) => {
  return (
    <div className={"p-4"} style={{ maxWidth: 350, margin: "0 auto" }}>
      <Pie data={data} options={getOptions(paramsOptions)} />
    </div>
  );
};

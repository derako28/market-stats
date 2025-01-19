import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const getOptions = (paramsOptions) => {
  return {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        color: "#fff",
        size: 18,
        formatter: (value) => labelFormatter(value, paramsOptions?.symbol),
        font: {
          size: 14,
        },
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        display: paramsOptions?.legend || false,
        position: "bottom",
        labels: {
          color: "#ffffff",
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#ffffff" },
        grid: { color: "#374151" },
      },
      y: {
        min: 0,
        max: 100,
        stacked: true,
        ticks: { color: "#ffffff", stepSize: 10 },
        grid: { color: "#374151" },
      },
    },
  };
};

const labelFormatter = (value, symbol = "percent") => {
  const symbolFoLabel = symbol === "percent" ? "%" : "";

  return value > 0 ? value + symbolFoLabel : null;
};

export const ChartBar = ({ data, paramsOptions }) => {
  return (
    <div className="relative h-64 md:64 lg:64">
      <Bar data={data} options={getOptions(paramsOptions)} />
    </div>
  );
};

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const getOptions = (paramsOptions) => {
  return {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
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
        stacked: true,
        ticks: { color: "#ffffff" },
        grid: { color: "#374151" },
      },
    },
  };
};

export const ChartBar = ({ data, paramsOptions }) => {
  return (
    <div className="relative h-64 md:64 lg:64">
      <Bar data={data} options={getOptions(paramsOptions)} />
    </div>
  );
};
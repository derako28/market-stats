export const getBarChartHorizontalConfig = (
  data = [],
  total,
  width = 300,
  height = 300,
) => {
  return {
    background: {
      visible: false,
    },
    width: width,
    height: height,
    data: data,
    series: [
      {
        type: "bar",
        xKey: "asset",
        yKey: "amount",
        label: {
          color: "#fff",

          formatter: ({ value }) => {
            // return `${value}%`;
            return `${value.toFixed(0)} ${total ? `(${((value / total) * 100).toFixed(1)}%)` : ""} `;
          },
        },

        itemStyler: ({ datum, yKey }) => ({
          fill: "rgba(0, 117, 225, 1)",
        }),
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          color: "#fff",
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          color: "#fff",
        },
      },
    ],
  };
};

export const getDataChart = (data = [], property, labels) => {
  return Object.keys(labels)
    .map((key) => {
      return {
        asset: labels[key],
        amount: data.filter((item) => {
          return (
            item[property]?.toString()?.toLowerCase() ===
            labels[key]?.toString()?.toLowerCase()
          );
        }).length,
      };
    })
    .filter(({ amount }) => amount);
};

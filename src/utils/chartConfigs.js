export const chartConfig = (
  getData,
  data,
  property,
  labels,
  width = 300,
  height = 300,
) => {
  const newData = getData(data, property, labels);
  return {
    data: newData,
    width: width,
    height: height,
    theme: "ag-default-dark",
    background: {
      visible: false,
    },

    series: [
      {
        type: "donut",
        calloutLabelKey: "asset",
        angleKey: "amount",
        innerRadiusRatio: 0.8,

        fills: [
          "rgba(0, 117, 225, 1)",
          "rgba(0, 117, 225, .9)",
          "rgba(0, 117, 225, .8)",
          "rgba(0, 117, 225, .7)",
          "rgba(0, 117, 225, .6)",
        ],

        calloutLabel: {
          formatter: ({ datum }) => {
            return `${datum.asset}: ${datum.amount}`;
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
      pagination: false,
      item: {
        label: {
          spacing: 20,
          formatter: ({ itemId, value }) => {
            return `${value}: (${((newData[itemId].amount / data.length) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
  };
};

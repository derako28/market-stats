import { OPENS_OPTIONS, TEST_OPTIONS } from "../../utils/constants.js";
import moment from "moment";
import dataTapok from "../../Data/tapok-sep.json";
import { chartConfig } from "../../utils/chartConfigs.js";

export const getDayOfWeek = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number); // Преобразуем дату в формате DD/MM/YYYY
  const dateObj = new Date(year, month - 1, day); // Создаем объект Date
  return dateObj.getDay().toString();
};

export const getMonth = (dateString) => {
  const date = moment(dateString, "DD-MM-YYYY");
  const month = date.month() + 1;

  return month;
};

export const filterByDayOfWeek = (data, dayFilter) => {
  return data.filter((item) => dayFilter?.includes(getDayOfWeek(item.date)));
};

export const getOptions = (options = {}) => {
  return (
    Object.keys(options).map((key) => ({
      value: options[key].replaceAll("_", " "),
      label: capitalizeFirstLetter(options[key].replaceAll("_", " ")),
    })) || []
  );
};

export const getConfigChart = (data = {}) => {
  const labels = Object.keys(data);
  const series = Object.keys(data)?.map((key) => data[key]);

  return {
    type: "donut",
    width: 280,
    height: 280,
    series: series,
    options: {
      labels: labels,
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },

      dataLabels: {
        enabled: true,

        formatter: function (val, { seriesIndex }) {
          return labels[seriesIndex] + ": " + series[seriesIndex];
        },
      },
      colors: [
        "rgba(0, 117, 225, 1)",
        "rgba(0, 117, 225, .9)",
        "rgba(0, 117, 225, .8)",
        "rgba(0, 117, 225, .7)",
        "rgba(0, 117, 225, .6)",
      ],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "",
              },
            },
          },
        },
      },
    },
  };
};

export const getChartConfig = (
  data = [],
  property,
  labels,
  width = 300,
  height = 300,
) => {
  const newData = getDataChart(data, property, labels).sort(
    (a, b) => b.amount - a.amount,
  );

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
            // return `${datum.asset}`
            return `${datum.asset}: ${datum.amount}`;
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
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

export const getBarChartConfig = (
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
        direction: "horizontal",
        xKey: "asset",
        yKey: "amount",
        label: {
          color: "#fff",
          formatter: ({ value }) => {
            return `${value.toFixed(0)} (${((value / total) * 100).toFixed(0)}%)`;
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
        position: "left",
        label: {
          color: "#fff",
        },
      },
      {
        type: "number",
        position: "bottom",
        label: {
          color: "#fff",
        },
      },
    ],
  };
};

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
          fontSize: 10,

          formatter: ({ value }) => {
            return `${value}`;
            // return `${value.toFixed(0)} ${total ? `(${((value / total) * 100).toFixed(1)}%)` : ""} `;
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

export const dataWithIbInfo = (data, property = "ib_broken") => {
  return data.map((item) => {
    const isHighBroken = item[property]?.includes("High Broken");
    const isLowBroken = item[property]?.includes("Low Broken");

    return {
      is_ib_broken: isHighBroken || isLowBroken,
      ib_one_side_broken:
        (isLowBroken && !isHighBroken) || (!isLowBroken && isHighBroken),
      ib_high_broken: isHighBroken,
      ib_low_broken: isLowBroken,
      ib_both_broken: isLowBroken && isHighBroken,
      ib_no_broken: !isLowBroken && !isHighBroken,
    };
  });
};

export const getDataIBSizeChart = (data, property, subProperty = null) => {
  const newData = {};

  data.forEach((item) => {
    const key = subProperty ? item[property][subProperty] : item[property];

    if (key !== 0) {
      newData[key] = newData[key] ? newData[key] + 1 : 1;
    }
  });

  return Object.keys(newData)
    .sort((a, b) => a - b)
    .map((key) => {
      return { asset: key, amount: newData[key] };
    });
  // .filter((item) => item.amount > data.length * (1 / 100));
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

export const getDataIBChart = (data = [], labels) => {
  return Object.keys(labels).map((key) => {
    return {
      asset: labels[key],
      amount: data.filter((item) => {
        return item[key];
      }).length,
    };
  });
};

export const getChartConfigForExt = (
  data = [],
  property,
  labels,
  total,
  width = 300,
  height = 300,
) => {
  const newData = getDataIExtensionChart(data, property);

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
            return `${datum.asset}`;
            // return `${datum.asset}: ${datum.amount}`
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
      item: {
        label: {
          spacing: 20,
          formatter: ({ itemId, value }) => {
            return `${value} (${((newData[itemId].amount / total) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
  };
};

export const getChartConfigFoBroken = (
  data = [],
  property,
  labels,
  total,
  width = 300,
  height = 300,
) => {
  const newData = getDataIBChart(dataWithIbInfo(data));

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
            // return `${datum.asset}`
            return `${datum.asset}: ${datum.amount}`;
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
      item: {
        label: {
          spacing: 20,
          formatter: ({ itemId, value }) => {
            return `${value} (${((newData[itemId].amount / total) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
  };
};

export const getDataIExtensionChart = (
  data,
  property = "ib_ext",
  subProperty = null,
) => {
  const newDataReduce = data.reduce((acc, item) => {
    const ib_size = item.ib_size || item.ibSize;
    const ibExt = subProperty ? item[property][subProperty] : item[property];

    const ibExtCof = ((ibExt / ib_size) * 100).toFixed(0);
    const roundedIbExt = roundToNearest(ibExtCof, 25);

    if (ibExt !== 0) {
      acc[roundedIbExt] = acc[roundedIbExt] ? acc[roundedIbExt] + 1 : 1;
    }

    return acc;
  }, {});

  return Object.keys(newDataReduce)
    .sort((a, b) => a - b)
    .map((key) => {
      return {
        asset: key === "0" ? "0-25" : key + "%",
        amount: newDataReduce[key],
      };
    })
    .filter((item) => item.amount > data.length * (1 / 100));
};

export const getChartConfigForBacktest = (
  data = [],
  dataBacktest = [],
  labels,
  total,
  width = 300,
  height = 300,
) => {
  // const newData =  getDataBacktest(data, dataBacktest);

  return {
    ...chartConfig,
    data: getDataBacktest(data, dataBacktest),
    width: width,
    height: height,
  };
};

export const getDataBacktest = (data, dataBacktest) => {
  const newData = data.reduce(
    (acc, item) => {
      dataBacktest
        .filter((bac) => item.date === bac.date)
        .forEach((item) => {
          if (item.RR === 1) {
            acc.win = acc.win + 1;
          } else {
            acc.lose = acc.lose + 1;
          }
        });

      return acc;
    },
    { win: 0, lose: 0 },
  );

  return [
    { asset: "Win", amount: newData.win },
    { asset: "Lose", amount: newData.lose },
  ];
};

export const getChartConfigForExtProbabilityReturn = (
  data = [],
  property,
  total,
  width = 300,
  height = 300,
) => {
  const newData = getDataIExtensionChart2(data, property);

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
            return `${datum.asset}`;
            // return `${datum.asset}: ${datum.amount}`
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
      item: {
        label: {
          spacing: 20,
          formatter: ({ itemId, value }) => {
            return `${value} (${((newData[itemId].amount / total) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
  };
};

export const getDataIExtensionChart2 = (data, property = "ib_ext") => {
  const newDataReduce = data.reduce((acc, item) => {
    const { ib_size } = item;
    const ibExt = item[property];
    const ibExtCof = ibExt / ib_size;

    if (ibExtCof >= 5) {
      const property = ">5x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    } else if (ibExtCof >= 4) {
      const property = "4x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    } else if (ibExtCof >= 3) {
      const property = "3x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    } else if (ibExtCof >= 2) {
      const property = "2x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    } else if (ibExtCof >= 1.5) {
      const property = "1.5x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    } else {
      const property = "<1.5x";

      acc[property] = acc[property] ? acc[property] + 1 : 1;
    }

    return acc;
  }, {});

  newDataReduce["1.5x"] = newDataReduce["1.5x"];
  newDataReduce["2x"] = newDataReduce["2x"];
  newDataReduce["3x"] = newDataReduce["3x"];
  newDataReduce["4x"] = newDataReduce["4x"];
  newDataReduce[">5x"] = newDataReduce[">5x"];

  return Object.keys(newDataReduce).map((key) => {
    return { asset: key, amount: newDataReduce[key] };
  });
};

export const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const getChartConfigForExtContinuation = (
  data = [],
  width = 300,
  height = 300,
) => {
  const newData = getDataIExtensiContinuationonChart(data);

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
            return `${datum.asset}`;
            // return `${datum.asset}: ${datum.amount}`
          },
          // avoidCollisions: false
        },
      },
    ],
    legend: {
      enabled: true,
      item: {
        label: {
          spacing: 20,
          formatter: ({ itemId, value }) => {
            return `${value} (${((newData[itemId].amount / data.length) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
  };
};

export const getDataIExtensiContinuationonChart = (data) => {
  const newDataReduce = data.reduce(
    (acc, item) => {
      const { ib_ext, ib_ext_ny } = item;

      if (ib_ext_ny < ib_ext) {
        acc.yes = acc.yes + 1;
      } else {
        acc.no = acc.no + 1;
      }

      return acc;
    },
    { yes: 0, no: 0 },
  );

  return [
    { asset: "Continuation", amount: newDataReduce.yes },
    { asset: "Reverse", amount: newDataReduce.no },
  ];
};

export const segmentData = (data, segmentSize = 5) => {
  return data.map((item) => {
    const ib_size = toNumber(item.ib_size);
    const ib_ext = toNumber(item.ib_ext);
    const ib_ext_high = toNumber(item.ib_ext_high);
    const ib_ext_low = toNumber(item.ib_ext_low);

    return {
      ...item,
      ib_size_segmented: roundToNearest(ib_size, segmentSize),
      ib_ext_segmented: roundToNearest(ib_ext, segmentSize),
      ib_ext_high_segmented: roundToNearest(ib_ext_high, segmentSize),
      ib_ext_low_segmented: roundToNearest(ib_ext_low, segmentSize),
    };
  });
};

function roundToNearest(number, segmentSize) {
  return Math.round(number / segmentSize) * segmentSize;
}

export const getProfit = (data) => {
  const profit = data.reduce((acc, { result }) => {
    if (result === "win") {
      acc++;
    } else {
      acc--;
    }

    return acc;
  }, 0);

  return profit + "RR";
};

export const getRelation = (acc, current, type) => {
  const prevItem = acc[acc.length - 1];

  const openClose = type === "open" ? current?.TPO_Open : current?.TPO_Close;

  if (prevItem === undefined) {
    return "-";
  }

  if (openClose >= prevItem?.VAL && openClose <= prevItem?.VAH) {
    return OPENS_OPTIONS.IN_VA;
  }

  if (openClose > prevItem?.TPO_High) {
    return OPENS_OPTIONS.ABOVE_RANGE;
  }

  if (openClose < prevItem?.TPO_Low) {
    return OPENS_OPTIONS.LOWER_RANGE;
  }

  if (openClose > prevItem?.VAH) {
    return OPENS_OPTIONS.ABOVE_VA;
  }

  if (openClose < prevItem?.VAL) {
    return OPENS_OPTIONS.LOWER_VA;
  }
};

export const getCloseRelation = (item) => {
  const { VAL, VAH } = item;

  const tpoClose = item?.TPO_Close
    ? toNumber(item.TPO_Close)
    : toNumber(item.TPO_Last_Price);

  if (tpoClose >= VAL && tpoClose <= VAH) {
    return OPENS_OPTIONS.IN_VA;
  }

  if (tpoClose > VAH) {
    return OPENS_OPTIONS.ABOVE_VA;
  }

  if (tpoClose < VAL) {
    return OPENS_OPTIONS.LOWER_VA;
  }
};

export const getIbExt = (item, type) => {
  const tpoHigh = toNumber(item?.TPO_High);
  const tpoLow = toNumber(item?.TPO_Low);

  const IBHigh = toNumber(item?.IBRHigh);
  const IBLow = toNumber(item?.IBRLow);

  return tpoHigh - IBHigh > (tpoLow - IBLow) * -1
    ? tpoHigh - IBHigh
    : (tpoLow - IBLow) * -1;
};

export const getIbExtSide = (item, type) => {
  const tpoHigh = toNumber(item?.TPO_High);
  const tpoLow = toNumber(item?.TPO_Low);

  const IBHigh = toNumber(item?.IBRHigh);
  const IBLow = toNumber(item?.IBRLow);

  if (type === "high") {
    return tpoHigh - IBHigh < 0 ? 0 : tpoHigh - IBHigh;
  }

  if (type === "low") {
    return (tpoLow - IBLow) * -1 < 0 ? 0 : (tpoLow - IBLow) * -1;
  }

  return tpoHigh - IBHigh > (tpoLow - IBLow) * -1
    ? tpoHigh - IBHigh
    : (tpoLow - IBLow) * -1;
};

export const getIbBroken = (item) => {
  const roundNumber = 0.5;
  const admission = 0.5;
  const ibBroken = [];

  const tpoHigh = roundToNearest(toNumber(item?.TPO_High), roundNumber);
  const tpoLow = roundToNearest(toNumber(item?.TPO_Low), roundNumber);

  const IBHigh = roundToNearest(toNumber(item?.IBRHigh), roundNumber);
  const IBLow = roundToNearest(toNumber(item?.IBRLow), roundNumber);

  if (tpoHigh - admission > IBHigh) {
    ibBroken.push("High Broken");
  }
  if (tpoLow + admission < IBLow) {
    ibBroken.push("Low Broken");
  }

  return ibBroken.join(", ");
};

export const isTestVA = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.TPO_Open;
  const TPO_Low = item.TPO_Low;
  const TPO_High = item.TPO_High;

  const { VAL, VAH } = prevItem;

  if (open >= VAL && open <= VAH) {
    return TEST_OPTIONS.YES;
  }

  if (open > VAH && TPO_Low < VAH) {
    return TEST_OPTIONS.YES;
  }

  if (open < VAL && TPO_High > VAL) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestRange = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.TPO_Open;
  const TPO_Low = item.TPO_Low;
  const TPO_High = item.TPO_High;

  const { TPO_High: TPO_HighPrev, TPO_Low: TPO_LowPrev } = prevItem;

  if (open >= TPO_LowPrev && open <= TPO_HighPrev) {
    return TEST_OPTIONS.OPEN_IN_RANGE;
  }

  if (open > TPO_HighPrev && TPO_Low < TPO_HighPrev) {
    return TEST_OPTIONS.YES;
  }

  if (open < TPO_LowPrev && TPO_High > TPO_LowPrev) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestIB = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.TPO_Open;
  const TPO_Low = item.TPO_Low;
  const TPO_High = item.TPO_High;

  const { IBRHigh, IBRLow } = prevItem;

  if (open >= IBRLow && open <= IBRHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open > IBRHigh && TPO_Low < IBRHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open < IBRLow && TPO_High > IBRLow) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestPOC = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const admission = 3.75;

  const open = item.TPO_Open;
  const TPO_Low = item.TPO_Low;
  const TPO_High = item.TPO_High;

  const { POC } = prevItem;
  const POC_High = +POC + admission;
  const POC_LOW = +POC + admission;

  if (open > POC && TPO_Low < POC_High) {
    return TEST_OPTIONS.YES;
  }

  if (open < POC && TPO_High > POC_LOW) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const prepareDataFiniteq = (data) => {
  return data
    .reverse()
    .reduce((acc, item) => {
      return [
        ...acc,
        {
          ...item,
          ib_size: toNumber(item.ib_size),
          TPO_Open: toNumber(item.TPO_Open),
          TPO_High: toNumber(item.TPO_High),
          TPO_Low: toNumber(item.TPO_Low),
          VAH: toNumber(item.VAH),
          VAL: toNumber(item.VAL),
          open_relation: getRelation(acc, item, "open"),
          close_relation_prev: getRelation(acc, item, "close"),
          close_relation: getCloseRelation(item),

          opening_type: determineOpenType(acc, item),
          ib_ext: getIbExt(item),
          ib_ext_high: getIbExtSide(item, "high"),
          ib_ext_low: getIbExtSide(item, "low"),
          ib_broken: getIbBroken(item),
          type_day: determineDayType(item),
          isTestVA: isTestVA(acc, item),
          isTestPOC: isTestPOC(acc, item),
          isTestRange: isTestRange(acc, item),
          isTestIB: isTestIB(acc, item),
        },
      ];
    }, [])
    .reverse();
};

export const toNumber = (number) => {
  return Number(number);
};

export const determineDayType = ({
  TPO_High,
  TPO_Low,
  IBRHigh,
  IBRLow,
  TPO_Close,
  VAH,
  VAL,
  ib_size,
}) => {
  const ibRange = toNumber(IBRHigh) - toNumber(IBRLow);
  const dayRange = toNumber(TPO_High) - toNumber(TPO_Low);
  const lastPrice = toNumber(TPO_Close);

  // Убедимся, что диапазоны и другие данные адекватны
  if (isNaN(ibRange) || isNaN(dayRange) || isNaN(lastPrice)) {
    return "Data Error"; // Ошибка в данных
  }

  // Критерии для определения типа дня
  if (dayRange > 2 * ibRange) {
    return "Trend";
  }

  // Normal of Variation Day: Дневной диапазон больше IB, но не в 2 раза
  if (dayRange > ibRange && dayRange <= 1.5 * ibRange) {
    return "NORMAL OF VARIATION";
  }

  // Neutral Day: Цена закрывается внутри диапазона Value Area
  if (lastPrice >= VAL && lastPrice <= VAH) {
    return "Neutral";
  }

  // Normal Day: Цена остается в пределах Initial Balance
  if (dayRange <= ibRange) {
    return "Normal";
  }

  return "Unknown Day Type";
};

const determineOpenType2 = ({
  TPO_Open, // Цена открытия
  VAH, // Верхняя граница Value Area
  VAL, // Нижняя граница Value Area
  POC, // Точка контроля
  TPO_High, // Верхняя цена дня
  TPO_Low, // Нижняя цена дня
}) => {
  /**
   * Определяет тип открытия на основе данных Market Profile.
   * @param {Object} data - Данные Market Profile за день.
   * @returns {String} Тип открытия: OA, OD, ORR, или Gap.
   */

  const openPrice = parseFloat(TPO_Open);
  const vaHigh = parseFloat(VAH);
  const vaLow = parseFloat(VAL);
  const poc = parseFloat(POC);
  const dayHigh = parseFloat(TPO_High);
  const dayLow = parseFloat(TPO_Low);

  // Проверка на валидность данных
  if (
    isNaN(openPrice) ||
    isNaN(vaHigh) ||
    isNaN(vaLow) ||
    isNaN(poc) ||
    isNaN(dayHigh) ||
    isNaN(dayLow)
  ) {
    return "Data Error"; // Ошибка в данных
  }

  // Типы открытия:
  if (openPrice >= vaLow && openPrice <= vaHigh) {
    // **Open Auction (OA)**: Открытие в сбалансированном диапазоне, в пределах VA
    return "OA";
  } else if (openPrice > vaHigh || openPrice < vaLow) {
    // **Open Drive (OD)**: Открытие с сильным движением в одном направлении (выше VAH или ниже VAL)
    return "OD";
  } else if (
    (openPrice < poc && openPrice > vaLow) ||
    (openPrice > poc && openPrice < vaHigh)
  ) {
    // **Open Rejection Reverse (ORR)**: Открытие в пределах диапазона, но с быстрым изменением направления
    return "ORR";
  } else if (openPrice > dayHigh || openPrice < dayLow) {
    // **Open with Gap**: Открытие с разрывом (выше или ниже предыдущего диапазона)
    return "Gap";
  }

  return "Unknown Open Type"; // Не удалось точно определить тип
};

const determineOpenType = (acc, current) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem || !current) {
    return "-";
  }

  const openPrice = toNumber(current.TPO_Open);
  const vaHigh = toNumber(current.VAH);
  const vaLow = toNumber(current.VAL);
  const poc = toNumber(current.POC);
  const dayHigh = toNumber(current.TPO_High);
  const dayLow = toNumber(current.TPO_Low);

  const prevDayHigh = toNumber(prevItem.TPO_High);
  const prevDayLow = toNumber(prevItem.TPO_Low);
  const prevVah = toNumber(prevItem.VAH);
  const prevVal = toNumber(prevItem.VAL);

  // Проверка на валидность данных
  if (
    isNaN(openPrice) ||
    isNaN(vaHigh) ||
    isNaN(vaLow) ||
    isNaN(poc) ||
    isNaN(dayHigh) ||
    isNaN(dayLow) ||
    isNaN(prevDayHigh) ||
    isNaN(prevDayLow) ||
    isNaN(prevVah) ||
    isNaN(prevVal)
  ) {
    return "Data Error"; // Ошибка в данных
  }

  if (openPrice > prevVah || openPrice < prevVal) {
    if (openPrice > vaHigh || openPrice < vaLow) {
      return "OD"; // Открытие за пределами VA и движение в одном направлении
    }
  }

  // **OTD (Open-Test-Drive)**: Открытие за пределами VA с тестом зоны справедливой стоимости
  if (
    (openPrice > prevVah || openPrice < prevVal) &&
    openPrice > vaLow &&
    openPrice < vaHigh
  ) {
    return "OTD"; // Открытие за пределами VA с тестом диапазона и продолжением в том же направлении
  }

  // **ORR (Open-Rejection-Reverse)**: Открытие за пределами VA, с отклонением и разворотом
  if (
    (openPrice > prevVah || openPrice < prevVal) &&
    (openPrice < poc || openPrice > poc)
  ) {
    return "ORR"; // Открытие за пределами VA с отклонением и разворотом
  }

  // **OA (Open-Auction)**: Открытие внутри VA предыдущего дня
  if (openPrice >= prevVal && openPrice <= prevVah) {
    return "OA"; // Открытие внутри VA
  }

  return "Unknown Open Type"; // Не удалось точно определить тип
};

export const getChartConfigUniversal = (
  data = [],
  getData,
  property,
  labels,
  width = 300,
  height = 300,
) => {
  return {
    ...chartConfig(getData, data, property, labels),
    width: width,
    height: height,
  };
};

export const getDataChartIBBroken = (data, property = "ib_broken", labels) => {
  const newData = data.map((item) => {
    const isHighBroken = item[property]?.includes("High Broken");
    const isLowBroken = item[property]?.includes("Low Broken");

    return {
      is_ib_broken: isHighBroken || isLowBroken,
      ib_high_broken: isHighBroken,
      ib_low_broken: isLowBroken,
      ib_both_broken: isLowBroken && isHighBroken,
      ib_one_side_broken:
        (isLowBroken && !isHighBroken) || (!isLowBroken && isHighBroken),
    };
  });

  const newData2 = Object.keys(labels).map((key) => {
    return {
      asset: labels[key],
      amount: newData.filter((item) => {
        return item[key];
      }).length,
    };
  });

  return newData2;
};

export const prepareDataABC = (data) => {
  return data.reduce((acc, item) => {
    return [
      ...acc,
      {
        ...item,
        ib_size: toNumber(item.ib_size),
        TPO_Open: toNumber(item.TPO_Open),
        TPO_High: toNumber(item.TPO_High),
        TPO_Low: toNumber(item.TPO_Low),
        VAH: toNumber(item.VAH),
        VAL: toNumber(item.VAL),
        open_relation: getRelation(acc, item, "open"),
        close_relation_prev: getRelation(acc, item, "close"),
        close_relation: getCloseRelation(item),
        ibRange: getIbRange(item),

        opening_type: determineOpenTypeABC(acc, item),
        type_day: determineDayType(item),
        isTestVA: isTestVA(acc, item),
        isTestPOC: isTestPOC(acc, item),
      },
    ];
  }, []);
};

export const setMatchOpeningType = (data) => {
  return data.map((item) => {
    const itemDate = moment(item.TPO_Date, "DD-MM-YYYY");
    const itemTapok = dataTapok?.find((el) =>
      itemDate.isSame(moment(el.date, "MMMM DD, YYYY")),
    );

    return {
      ...item,
      matchOpeningType: item.opening_type === itemTapok.opening_type,
      manualOpeningType: itemTapok.opening_type,
    };
  });
};

const determineOpenTypeABC = (acc, current) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem || !current) {
    return "-";
  }

  const admission = 2.5;

  const openPrice = current?.TPO_Open;
  const vaHigh = toNumber(current?.VAH);
  const vaLow = toNumber(current?.VAL);
  const poc = toNumber(current?.POC);
  const dayHigh = toNumber(current?.TPO_High);
  const dayLow = toNumber(current?.TPO_Low);
  const aHigh = toNumber(current?.A_High);
  const aLow = toNumber(current?.A_Low);
  const bHigh = current?.B_High;
  const bLow = current?.B_Low;
  const cHigh = current?.C_High;
  const cLow = current?.C_Low;
  const ibRange = current?.ibRange;

  const prevHigh = toNumber(prevItem?.TPO_High);
  const prevLow = toNumber(prevItem?.TPO_Low);
  const vah = toNumber(prevItem?.VAH);
  const val = toNumber(prevItem?.VAL);

  // const prevHigh = parseFloat(prevDay.TPO_High); // High предыдущего дня
  // const prevLow = parseFloat(prevDay.TPO_Low); // Low предыдущего дня

  const isCAboveAandB = cHigh > aHigh + admission && cHigh > bHigh + admission; // C выше обоих
  const isCBelowAandB = cLow < aLow - admission && cLow < bLow - admission;

  const isBAboveA = bHigh > aHigh; // C выше обоих
  const isBBelowA = bLow < aLow;

  const isOpenOnExtremum = aLow - openPrice > admission * 2;

  const highestHigh = Math.max(aHigh, bHigh, cHigh);
  const lowestLow = Math.min(aLow, bLow, cLow);

  // Проверяем, находится ли TPO_Open в пределах допуска
  const isNearHigh = openPrice >= highestHigh - admission * 3;
  const isNearLow = openPrice <= lowestLow + admission * 3;

  if (!aHigh || !aLow || !bHigh || !bLow || !cHigh || !cHigh) {
    return "-";
  }

  // 4. Open-Auction (OA)
  if (openPrice >= val && openPrice <= vah) {
    return "OA";
  }

  // 1. Open-Drive (OD)
  if (
    ((cLow < bLow && bLow < aLow) ||
      (cHigh > bHigh && bHigh > aHigh) ||
      (isNearHigh && aHigh > bHigh && aHigh > cHigh) ||
      (isNearLow && cLow > bLow && aLow > cLow)) &&
    (isNearHigh || isNearLow)
  ) {
    return "OD";
  }

  if (openPrice >= vah && aLow <= vah) {
    return "OTD";
  }

  if (
    (openPrice > vah && aLow <= vah) ||
    (openPrice < val && aHigh >= val) ||
    (openPrice > vah &&
      aLow < openPrice - admission * 4 &&
      cHigh > bHigh + admission) ||
    (openPrice > val &&
      aHigh > openPrice + admission * 4 &&
      cLow < bLow - admission)
  ) {
    return "OTD";
  }

  if (
    (openPrice > vah && aLow <= vah) ||
    (openPrice < val && aHigh >= val) ||
    (openPrice > vah &&
      aLow < openPrice - admission * 4 &&
      cHigh > bHigh + admission) ||
    (openPrice > val &&
      aHigh > openPrice + admission * 4 &&
      cLow < bLow - admission)
  ) {
    return "OTD";
  }

  if (
    openPrice >= val &&
    openPrice <= vah &&
    (((aHigh > vah || bHigh > vah) && cLow < vah) ||
      ((aLow < val || bLow < val) && cHigh > val))
  ) {
    return "ORR";
  }

  if (
    ((openPrice >= vah &&
      (aHigh > openPrice || bHigh > openPrice) &&
      cLow < aLow &&
      cLow < bLow) ||
      (openPrice <= val &&
        (aLow < openPrice || bLow < openPrice) &&
        cHigh > aHigh &&
        cHigh > bHigh)) &&
    !(aLow < val && aHigh > vah)
  ) {
    return "ORR";
  }

  if (
    (aHigh === bHigh &&
      aLow === bLow &&
      !(
        cLow < lowestLow - admission * 3 || cHigh > highestHigh + admission * 3
      )) ||
    (aHigh > bHigh && aLow < bLow)
  ) {
    return "OA";
  }

  // 4. Open-Auction (OA)
  if (
    openPrice >= val &&
    openPrice <= vah && // Внутри VA
    aHigh <= vah &&
    aLow >= val
  ) {
    return "OA";
  }

  if (
    ((!isCAboveAandB && !isCBelowAandB) || (!isBAboveA && !isBBelowA)) &&
    !(isNearHigh || isNearLow)
  ) {
    return "OA";
  }

  if (cLow >= lowestLow && cHigh <= highestHigh) {
    return "OA";
  }

  return "-"; // Не удалось точно определить тип
};

function determineTypeOpen(data) {
  return data.map((day) => {
    const openPrice = parseFloat(day.TPO_Open);
    const vah = parseFloat(day.VAH);
    const val = parseFloat(day.VAL);
    const dayHigh = parseFloat(day.TPO_High);
    const dayLow = parseFloat(day.TPO_Low);
    const poc = parseFloat(day.POC);

    const aHigh = parseFloat(day.A_High);
    const aLow = parseFloat(day.A_Low);

    // Определяем тип открытия
    if (openPrice === dayHigh || openPrice === dayLow) {
      return { ...day, type_open: "Open-Drive" }; // Open-Drive
    }
    if (openPrice >= val && openPrice <= vah && (aLow <= val || aHigh >= vah)) {
      return { ...day, type_open: "Open-Test-Drive" }; // Open-Test-Drive
    }
    if (
      (openPrice > vah || openPrice < val) &&
      (aHigh === dayHigh || aLow === dayLow)
    ) {
      return { ...day, type_open: "Open-Rejection-Reverse" }; // Open-Rejection-Reverse
    }
    if (openPrice >= val && openPrice <= vah) {
      return { ...day, type_open: "Open-Auction" }; // Open-Auction
    }

    // Неизвестный тип
    return { ...day, type_open: "Unknown" };
  });
}

export const getIbRange = (item) => {
  const { A_High, A_Low, B_High, B_Low } = item;

  const maxHigh = Math.max(A_High, B_High);
  const minLow = Math.min(A_Low, B_Low);

  return maxHigh - minLow;
};

export const convertToSegmentHighLow = (data) => {
  // Группировка данных по дате
  const grouped = data.reduce((acc, entry) => {
    const date = new Date(entry.time).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  // Преобразование в массив с сегментами по дням
  return Object.entries(grouped).map(([date, dayData]) => {
    const segments = ["A", "B", "C"];

    const daySegments = dayData
      .slice(0, segments.length)
      .reduce((result, entry, index) => {
        const segment = segments[index];
        result[`${segment}_High`] = entry.high;
        result[`${segment}_Low`] = entry.low;
        return result;
      }, {});

    return {
      date,
      ...daySegments,
    };
  });
};

export const mergeDataByDate = (data1, data2) => {
  return data1.map((item) => {
    const itemDate = moment(item.TPO_Date, "DD/MM/YYYY");

    const dataPeriods = data2.find((el) => {
      const elDate = moment(el.date, "YYYY-MM-DD");

      return itemDate.isSame(elDate);
    });

    return { ...item, ...dataPeriods };
  });
};

export const mergeTPOData = (tpoArray, segmentArray) => {
  // Функция для преобразования даты из формата dd/MM/yyyy в yyyy-MM-dd
  const normalizeDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // Преобразуем segmentArray в карту для быстрого поиска по дате
  const segmentMap = segmentArray.reduce((map, entry) => {
    const normalizedDate = entry.date; // Дата в segmentArray уже в формате yyyy-MM-dd
    map[normalizedDate] = entry; // Сохраняем объект с ключом даты

    return map;
  }, {});

  // Смерджим данные
  return tpoArray.map((tpoEntry) => {
    const normalizedDate = normalizeDate(tpoEntry.TPO_Date); // Приводим TPO_Date к формату yyyy-MM-dd

    // Ищем соответствующие данные сегментов по нормализованной дате
    const segmentData = segmentMap[normalizedDate] || {};

    // Объединяем данные TPO и сегменты
    return {
      ...tpoEntry,
      ...segmentData, // Добавляем сегменты, если они есть
    };
  });
};

export const getChartConfigForBreakoutPeriods = (
  data = [],
  type,
  labels,
  width = 300,
  height = 300,
) => {
  const newData = getDataChartForBreakoutPeriods(data, type, labels);

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
          "rgba(0, 117, 225, .5)",
          "rgba(0, 117, 225, .4)",
          "rgba(0, 117, 225, .3)",
          "rgba(0, 117, 225, .2)",
          "rgba(0, 117, 225, .1)",
        ],

        calloutLabel: {
          formatter: ({ value }) => {
            return `${value.toFixed(0)} ${data.length ? `(${((value / data.length) * 100).toFixed(0)}%)` : ""} `;
          },
        },

        innerLabels: [
          {
            text: data.length.toString(),
            fontSize: 16,
          },
        ],
      },
    ],
    legend: {
      enabled: true,
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

export const getDataChartForBreakoutPeriods = (data = [], type, labels) => {
  return Object.keys(labels)
    .map((key) => {
      return {
        asset: labels[key],
        amount: data.filter((item) => {
          const value = item["breakoutPeriods"][type].period;

          return (
            value?.toString()?.toLowerCase() ===
            labels[key]?.toString()?.toLowerCase()
          );
        }).length,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .filter(({ amount }) => amount);
};

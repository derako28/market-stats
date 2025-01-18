import moment from "moment";
import {
  IB_BREAKOUT_LABELS,
  DAYS_LABEL,
  DAY_TRENDS,
  DATE_RANGE_VALUE,
  IB_BREAKOUT_OPTIONS,
  TOUCH_ZONES,
  TOUCH_ZONES_KEYS,
  OPENS_RELATION_TO_TOC,
} from "../../utils/constants.js";
import { roundToNearest } from "../../utils/prepareData.js";

const getDayOfWeek = (date) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return days[date.day() - 1];
};

export const groupByWeekday = (data) => {
  return data.reduce((grouped, item) => {
    const date = moment(item.date);
    const weekday = getDayOfWeek(date);

    if (!grouped[weekday]) {
      grouped[weekday] = [];
    }

    grouped[weekday].push(item);

    return grouped;
  }, {});
};

export const getChartDataGreenRedDays = (data) => {
  const daysArr = Object.values(DAYS_LABEL);

  const dataGroupByWeekday = groupByWeekday(data);

  const prepareData = daysArr.reduce((acc, weekday) => {
    const dataByWeekday = dataGroupByWeekday[weekday];
    let bullishDays = 0;
    let bearishDays = 0;

    dataByWeekday?.forEach((item) => {
      if (item.trend === DAY_TRENDS.BULLISH) {
        bullishDays++;
      }

      if (item.trend === DAY_TRENDS.BEARISH) {
        bearishDays++;
      }
    });

    acc[weekday] = {
      bullish: bullishDays,
      bearish: bearishDays,
      total: bullishDays + bearishDays,
      bullishPercentage2: (
        (bullishDays / (bullishDays + bearishDays)) *
        100
      ).toFixed(2),
      bullishPercentage: getPercent(bullishDays, bullishDays + bearishDays),
      bearishPercentage: getPercent(bearishDays, bullishDays + bearishDays),
    };

    return acc;
  }, {});

  const dataF = daysArr.reduce(
    (acc, day) => {
      const item = prepareData[day];
      acc.bullish.push(item.bullishPercentage);
      acc.bearish.push(item.bearishPercentage);

      return acc;
    },
    {
      bullish: [],
      bearish: [],
    },
  );

  return {
    dataSet: {
      labels: Object.values(DAYS_LABEL),
      datasets: [
        {
          label: "Green Days",
          data: dataF.bullish,
          backgroundColor: "#3b82f6",
          borderRadius: 10,
        },
        {
          label: "Red Days",
          data: dataF.bearish,
          backgroundColor: "#0d0f12",
          borderRadius: 10,
        },
      ],
    },
    insights: prepareData,
  };
};

export const getChartDataIBBreakout = (
  data,
  property = "ibBreakout",
  labels = [],
) => {
  const dataWithIbBreakout = dataWithIbInfo(data, property);

  const dataPrepare = Object.keys(labels).reduce((acc, key) => {
    const counts = dataWithIbBreakout.reduce((acc, item) => {
      if (item[key]) {
        acc = acc + 1;
      }

      return acc;
    }, 0);

    acc[IB_BREAKOUT_LABELS[key]] = getPercent(
      counts,
      dataWithIbBreakout.length,
    );

    return acc;
  }, {});

  const dataSet = [
    {
      data: Object.values(dataPrepare),
      backgroundColor: ["#3b82f6", "#0d0f12"],
      borderRadius: 10,
    },
  ];

  return {
    labels: Object.keys(dataPrepare),
    datasets: dataSet,
  };
};

export const getChartDataIBSizes = (data) => {
  const prepareData = data.reduce((acc, item) => {
    const ibSize = roundToNearest(item.ibSize, 5);

    acc[ibSize] = acc[ibSize] ? acc[ibSize] + 1 : 1;

    return acc;
  }, {});

  const dataSet = [
    {
      data: Object.values(prepareData),
      backgroundColor: "#3b82f6",
    },
  ];

  return {
    dataSet: {
      labels: Object.keys(prepareData),
      datasets: dataSet,
    },
  };
};

export const dataWithIbInfo = (data, property = "ibBreakout") => {
  return data.map((item) => {
    const isHighBreakout = item[property]?.includes("High Breakout");
    const isLowBreakout = item[property]?.includes("Low Breakout");

    return {
      is_ib_breakout: isHighBreakout || isLowBreakout,
      ib_one_side_broken:
        (isLowBreakout && !isHighBreakout) ||
        (!isLowBreakout && isHighBreakout),
      ib_high_broken: isHighBreakout,
      // ib_high_broken: isHighBreakout && !isLowBreakout,
      // ib_low_broken: isLowBreakout && !isHighBreakout,
      ib_low_broken: isLowBreakout,
      ib_both_broken: isLowBreakout && isHighBreakout,
      ib_no_broken: !isLowBreakout && !isHighBreakout,
    };
  });
};

export const onFilterData = (data, dataFilter) => {
  if (!dataFilter) {
    return data;
  }

  return data.filter((item) => {
    return Object.keys(dataFilter).every((key) => {
      if (
        dataFilter[key] === "" ||
        dataFilter[key] === undefined ||
        key === "ticker"
      )
        return true;

      if (key === "day") {
        return moment(item.date).day() === +dataFilter.day;
      }

      // if (key === "date") {
      //   const currentDate = moment(item.date);
      //
      //   return moment(currentDate).isBetween(startDate, endDate);
      // }

      if (key === "ibSize") {
        return +item[key] === +dataFilter[key];
      }

      if (key === "ib_size_from") {
        return +dataFilter.ib_size_from <= +item.ibSize;
      }

      if (key === "ib_size_to") {
        return +dataFilter.ib_size_to >= +item.ibSize;
      }

      if (key === "firstBreakoutInPeriod") {
        const periods = dataFilter?.firstBreakoutInPeriod || [];

        return !periods.includes(item?.breakoutPeriods?.firstBreakout?.period);
      }

      if (key === "date_range") {
        const dateEl = moment(item.date);
        const now = moment();

        if (dataFilter[key] === DATE_RANGE_VALUE.LAST_MONTH) {
          const startDate = now.clone().subtract(1, "month");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.THREE_MONTH) {
          const startDate = now.clone().subtract(3, "month");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.SIX_MONTH) {
          const startDate = now.clone().subtract(6, "month");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.ONE_YEAR) {
          const startDate = now.clone().subtract(1, "year");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.TWO_YEAR) {
          const startDate = now.clone().subtract(2, "year");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.THREE_YEAR) {
          const startDate = now.clone().subtract(3, "year");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.FOUR_YEAR) {
          const startDate = now.clone().subtract(4, "year");

          return dateEl.isBetween(startDate, now, "day");
        }

        if (dataFilter[key] === DATE_RANGE_VALUE.FIVE_YEAR) {
          const startDate = now.clone().subtract(5, "year");

          return dateEl.isBetween(startDate, now, "day");
        }

        return true;
      }

      return item[key]
        ?.toString()
        .toLowerCase()
        ?.includes(dataFilter[key].toString().toLowerCase());
    });
  });
};

export const getChartDataTouchesZones = (data, property) => {
  const totalDays = data.length;

  const isTestCounts = data.reduce((acc, item) => {
    if (item[property] === "YES") {
      acc = acc + 1;
    }

    return acc;
  }, 0);

  const percentage = {
    yes: getPercent(isTestCounts, totalDays),
    no: getPercent(totalDays - isTestCounts, totalDays),
  };

  return {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "",
        data: [percentage.yes, percentage.no],
        backgroundColor: ["#3b82f6", "#0d0f12"],
        borderRadius: 10,
      },
    ],
  };
};

const generateData = (data, keys) => {
  return data.reduce(
    (acc, item) => {
      keys.map((key) => {
        if (item[key] === "YES") {
          acc[key] = acc[key] + 1;
        }
      });

      return acc;
    },
    {
      isTouchVAL: 0,
      isTouchVAH: 0,
    },
  );
};

const getDataPercentage = (data, totalDays) => {
  return Object.keys(data).reduce((acc, key) => {
    const value = data[key];

    acc[key] = getPercent(value, totalDays);

    return acc;
  }, {});
};

export const getChartDataTouchesZonesVa = (data) => {
  const keys = Object.values(TOUCH_ZONES_KEYS);
  const totalDays = data.length;

  const dataOpenAbovePoc = data.filter(
    (item) => item.open_relation_to_poc === OPENS_RELATION_TO_TOC.ABOVE_POC,
  );
  const dataOpenBelowPoc = data.filter(
    (item) => item.open_relation_to_poc === OPENS_RELATION_TO_TOC.LOWER_POC,
  );

  const data1 = generateData(data, keys);
  const data2 = generateData(dataOpenAbovePoc, keys);
  const data3 = generateData(dataOpenBelowPoc, keys);

  const data1Per = getDataPercentage(data1, totalDays);
  const data2Per = getDataPercentage(data2, dataOpenAbovePoc.length);
  const data3Per = getDataPercentage(data3, dataOpenBelowPoc.length);

  const dataPercentageYes = [
    data1Per.isTouchVAL,
    data1Per.isTouchVAH,
    data2Per.isTouchVAL,
    data2Per.isTouchVAH,
    data3Per.isTouchVAL,
    data3Per.isTouchVAH,
  ];

  const dataPercentageNo = dataPercentageYes.map((item) => 100 - item);

  return {
    labels: Object.values(TOUCH_ZONES),
    datasets: [
      {
        label: "Yes",
        data: dataPercentageYes,
        backgroundColor: "#3b82f6",
        borderRadius: [10, 10, 10, 10],
      },
      {
        label: "No",
        data: dataPercentageNo,
        backgroundColor: "#0d0f12",
        borderRadius: [10, 10, 10, 10],
      },
    ],
  };
};

export const getSetting = () => {
  return JSON.parse(localStorage.getItem("settings")) || null;
};

export const getPercent = (count, total) => {
  if (count === 0) return 0;
  return ((count / total) * 100).toFixed(0);
};

export const getChartDonutDataIBBreakout = (
  data,
  property = "ibBreakout",
  labels = [],
) => {
  const dataWithIbBreakout = dataWithIbInfo(data, property);

  const dataPrepare = Object.keys(labels).reduce((acc, key) => {
    const counts = dataWithIbBreakout.reduce((acc, item) => {
      if (item[key]) {
        acc = acc + 1;
      }

      return acc;
    }, 0);

    acc[IB_BREAKOUT_LABELS[key]] = getPercent(
      counts,
      dataWithIbBreakout.length,
    );

    return acc;
  }, {});

  const dataSet = [
    {
      data: Object.values(dataPrepare),
      backgroundColor: ["#3b82f6", "#0d0f12", "#818181FF"],
      borderWidth: 0,
    },
  ];

  return {
    labels: Object.keys(dataPrepare),
    datasets: dataSet,
  };
};

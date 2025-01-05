import moment from "moment";
import {
  IB_BROKEN_LABELS,
  DAYS_LABEL,
  DAY_TRENDS,
  DATE_RANGE_VALUE,
} from "../../utils/constants.js";

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
      bullishPercentage: (
        (bullishDays / (bullishDays + bearishDays)) *
        100
      ).toFixed(2),
      bearishPercentage: (
        (bearishDays / (bullishDays + bearishDays)) *
        100
      ).toFixed(2),
    };

    return acc;
  }, {});

  const dataF = daysArr.reduce(
    (acc, day) => {
      const item = prepareData[day];
      const itemsOfDays = item.bullish + item.bearish;

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

export const getChartDataIBBreakout = (data) => {
  const dataWithIbBreakout = dataWithIbInfo(data);

  const dataNew = Object.keys(IB_BROKEN_LABELS).reduce((acc, key) => {
    const counts = dataWithIbBreakout.reduce((acc, item) => {
      if (item[key]) {
        acc = acc + 1;
      }

      return acc;
    }, 0);

    acc.push(((counts / dataWithIbBreakout.length) * 100).toFixed(2));

    return acc;
  }, []);

  const data2 = Object.keys(IB_BROKEN_LABELS).reduce((acc, key) => {
    const counts = dataWithIbBreakout.reduce((acc, item) => {
      if (item[key]) {
        acc = acc + 1;
      }

      return acc;
    }, 0);

    acc[IB_BROKEN_LABELS[key]] = (
      (counts / dataWithIbBreakout.length) *
      100
    ).toFixed(2);

    return acc;
  }, {});

  const dataSet = [
    {
      data: Object.values(data2),
      backgroundColor: "#3b82f6",
      borderRadius: 10,
    },
  ];

  Object.values(IB_BROKEN_LABELS).reduce((acc, label) => {
    return acc;
  }, []);

  return {
    dataSet: {
      labels: Object.keys(data2),
      datasets: dataSet,
    },
  };
};

export const dataWithIbInfo = (data, property = "ibBroken") => {
  return data.map((item) => {
    const isHighBroken = item[property]?.includes("High Broken");
    const isLowBroken = item[property]?.includes("Low Broken");

    return {
      is_ib_broken: isHighBroken || isLowBroken,
      ib_one_side_broken:
        (isLowBroken && !isHighBroken) || (!isLowBroken && isHighBroken),
      ib_high_broken: isHighBroken,
      // ib_high_broken: isHighBroken && !isLowBroken,
      // ib_low_broken: isLowBroken && !isHighBroken,
      ib_low_broken: isLowBroken,
      ib_both_broken: isLowBroken && isHighBroken,
      ib_no_broken: !isLowBroken && !isHighBroken,
    };
  });
};

export const onFilterData = (data, dataFilter) => {
  if (!dataFilter) {
    return data;
  }

  const startDate = moment(dataFilter.date?.startDate);
  const endDate = moment(dataFilter.date?.endDate);

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

      if (key === "date") {
        const currentDate = moment(item.date);

        return moment(currentDate).isBetween(startDate, endDate);
      }

      if (key === "ibSize") {
        return +item[key] === +dataFilter[key];
      }

      if (key === "ib_size_from") {
        return +dataFilter.ib_size_from <= +item.ibSize;
      }

      if (key === "ib_size_to") {
        return +dataFilter.ib_size_to >= +item.ibSize;
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
      }

      return item[key]
        ?.toString()
        .toLowerCase()
        ?.includes(dataFilter[key].toString().toLowerCase());
    });
  });
};

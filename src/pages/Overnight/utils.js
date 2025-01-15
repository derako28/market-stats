import { roundToNearest } from "../../utils/prepareData.js";
import { TRENDS } from "../../utils/constants.js";

export const prepareData = (data) => {
  const groupedData = data.reduce((acc, entry) => {
    const date = entry.time.split("T")[0];

    if (!entry.time.includes("22:00") && !entry.time.includes("22:30")) {
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
    }

    return acc;
  }, {});

  return Object.entries(groupedData)
    .filter(([_, dailyData]) => dailyData.length === 44)
    .map(([date, dailyData]) => {
      const overnight = dailyData.slice(0, 31);
      const rth = dailyData.slice(-13);

      const overnightMax = Math.max(...overnight.map((item) => item.high));
      const overnightMin = Math.min(...overnight.map((item) => item.low));

      const dayMax = Math.max(...dailyData.map((item) => item.high));
      const dayMin = Math.min(...dailyData.map((item) => item.high));

      const extHigh = dayMax > overnightMax ? dayMax - overnightMax : 0;
      const extLow = dayMin < overnightMin ? overnightMin - dayMin : 0;
      const extMax = extHigh > extLow ? extHigh : extLow;

      const overnightRange = overnightMax - overnightMin;
      const dayRange = dayMax - dayMin;

      return {
        date,
        // dailyData,
        overnight_range: roundToNearest(overnightRange, 10),
        overnight_max: overnightMax,
        overnight_min: overnightMin,
        day_range: roundToNearest(dayRange, 10),
        day_max: dayMax,
        day_min: dayMin,
        ov_ext_high: extHigh,
        ov_ext_low: extLow,
        ov_ext_max: extMax,
        overnight_breakout: getBreakout(
          dayMin,
          dayMax,
          overnightMin,
          overnightMax,
        ),
        first_overnight_breakout: findFirstBreakoutPeriods(
          rth,
          overnightMax,
          overnightMin,
        ),
        breakoutPeriods: findBreakoutPeriods(rth, overnightMax, overnightMin),
        first_breakout_period: findBreakoutPeriods(
          rth,
          overnightMax,
          overnightMin,
        ).firstBreakout.period,
        opposite_breakout_period: findBreakoutPeriods(
          rth,
          overnightMax,
          overnightMin,
        ).oppositeBreakout.period,
        ...getLowHighPeriod(rth),
        trend_overnight: getTrend(overnight),
        trend_rth: getTrend(rth),
      };
    });
};

export const findFirstBreakoutPeriods = (ohlcData, ovHigh, ovMin) => {
  // 1. Добавляем алфавитные обозначения для периодов
  const alphabet = "ABCDEFGHIJKLM";
  ohlcData.forEach((period, index) => {
    period.period = alphabet[index]; // Присваиваем букву
  });

  let firstBreakout = null;
  let oppositeBreakout = null;

  // 3. Найти первый пробой IB
  for (const period of ohlcData) {
    if (!firstBreakout && (period.high > ovHigh || period.low < ovMin)) {
      firstBreakout = {
        period: period.period,
        time: period.time,
        breakoutType: period.high > ovHigh ? "High Breakout" : "Low Breakout",
      };
    }

    // 4. Найти противоположный пробой
    if (
      firstBreakout &&
      !oppositeBreakout &&
      ((firstBreakout.breakoutType === "High Breakout" && period.low < ovMin) ||
        (firstBreakout.breakoutType === "Low Breakout" && period.high > ovHigh))
    ) {
      oppositeBreakout = {
        period: period.period,
        time: period.time,
        breakoutType:
          firstBreakout.breakoutType === "High Breakout"
            ? "Low Breakout"
            : "High Breakout",
      };
      break;
    }
  }

  return firstBreakout?.breakoutType || "No Breakout";
};

export const getRangeSizeChart = (data, property) => {
  const newData = {};

  data.forEach((item) => {
    const key = item[property];

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

const getBreakout = (dayLow, dayHigh, ovLow, ovHigh) => {
  const highBreakout = dayHigh > ovHigh;
  const lowBreakout = dayLow < ovLow;

  if (highBreakout && lowBreakout) return "High Breakout, Low Breakout";
  if (highBreakout) return "High Breakout";
  if (lowBreakout) return "Low Breakout";
  return "No Breakout";
};

export const findBreakoutPeriods = (ohlcData, ovHigh, ovMin) => {
  // 1. Добавляем алфавитные обозначения для периодов
  const alphabet = "ABCDEFGHIJKLM";
  ohlcData.forEach((period, index) => {
    period.period = alphabet[index]; // Присваиваем букву
  });

  let firstBreakout = null;
  let oppositeBreakout = null;

  for (const period of ohlcData) {
    if (!firstBreakout && (period.high > ovHigh || period.low < ovMin)) {
      firstBreakout = {
        period: period.period,
        time: period.time,
        breakoutType: period.high > ovHigh ? "High Breakout" : "Low Breakout",
      };
    }

    // 4. Найти противоположный пробой
    if (
      firstBreakout &&
      !oppositeBreakout &&
      ((firstBreakout.breakoutType === "High Breakout" && period.low < ovMin) ||
        (firstBreakout.breakoutType === "Low Breakout" && period.high > ovHigh))
    ) {
      oppositeBreakout = {
        period: period.period,
        time: period.time,
        breakoutType:
          firstBreakout.breakoutType === "High Breakout"
            ? "Low Breakout"
            : "High Breakout",
      };
      break;
    }
  }

  // 5. Возвращаем результаты
  return {
    firstBreakout: firstBreakout || {
      period: null,
      time: null,
      breakoutType: "No Breakout",
    },
    oppositeBreakout: oppositeBreakout || {
      period: null,
      time: null,
      breakoutType: "No Breakout",
    },
  };
};

export const dataWithBreakoutInfo = (data, property = "ib_breakout") => {
  return data.map((item) => {
    const isHighBreakout = item[property]?.includes("High Breakout");
    const isLowBreakout = item[property]?.includes("Low Breakout");

    return {
      is_breakout: isHighBreakout || isLowBreakout,
      one_side_broken:
        (isLowBreakout && !isHighBreakout) ||
        (!isLowBreakout && isHighBreakout),
      high_broken: isHighBreakout,
      low_broken: isLowBreakout,
      both_broken: isLowBreakout && isHighBreakout,
      no_broken: !isLowBreakout && !isHighBreakout,
    };
  });
};

const getLowHighPeriod = (ohlcData) => {
  const alphabet = "ABCDEFGHIJKLMN";
  ohlcData.forEach((period, index) => {
    period.period = alphabet[index]; // Присваиваем букву
  });

  let highInPeriod = {
    high: 0,
    period: null,
  };
  let lowInPeriod = {
    low: ohlcData[0].low,
    period: null,
  };

  ohlcData.forEach((item) => {
    if (item.high > highInPeriod.high) {
      highInPeriod.high = item.high;
      highInPeriod.period = item.period;
    }

    if (item.low < lowInPeriod.low) {
      lowInPeriod.low = item.low;
      lowInPeriod.period = item.period;
    }
  });

  return {
    lowInPeriod: lowInPeriod.period,
    highInPeriod: highInPeriod.period,
  };
};

const getTrend = (data) => {
  const open = data[0].open;
  const close = data[data.length - 1].close;

  if (open > close) {
    return TRENDS.BEARISH;
  }
  if (open < close) {
    return TRENDS.BULLISH;
  }
};

import moment from "moment";
import {
  TRENDS,
  CLOSES_OPTIONS,
  OPENS_OPTIONS,
  OPENS_RELATION_TO_TOC,
  TEST_OPTIONS,
  FIRST_FORMED,
  CANDLE_TYPES,
} from "../../utils/constants.js";

export const calculateMarketProfileByDay = (
  data,
  valueAreaPercent = 68,
  tpr = 5,
) => {
  // 1. Группируем данные по дням
  const dailyData = data.reduce((acc, entry) => {
    const day = entry.time.split("T")[0]; // Извлекаем дату в формате "YYYY-MM-DD"
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});

  // 2. Рассчитываем профиль для каждого дня
  return Object.entries(dailyData).map(([date, dayData]) => {
    // Считаем частоты по строкам профиля
    const priceFrequency = {};
    dayData.forEach(({ high, low }) => {
      for (
        let price = Math.floor(low / tpr) * tpr;
        price <= high;
        price += tpr
      ) {
        priceFrequency[price] = (priceFrequency[price] || 0) + 1;
      }
    });

    // Сортируем строки профиля по частоте
    const sortedPrices = Object.entries(priceFrequency)
      .map(([price, frequency]) => ({ price: parseFloat(price), frequency }))
      .sort((a, b) => b.frequency - a.frequency);

    // Найти poc
    const poc = sortedPrices[0].price;

    // Общая сумма частот
    const totalFrequency = Object.values(priceFrequency).reduce(
      (sum, freq) => sum + freq,
      0,
    );
    const targetFrequency = totalFrequency * (valueAreaPercent / 100);

    // Определяем VAH и VAL
    let cumulativeFrequency = 0;
    let valueAreaPrices = [];

    for (const { price, frequency } of sortedPrices) {
      cumulativeFrequency += frequency;
      valueAreaPrices.push(price);
      if (cumulativeFrequency >= targetFrequency) break;
    }

    const firstTwoPeriods = dayData.slice(0, 2);
    const firstTwoPeriodByNY = dayData.slice(15, 17);

    const vah = Math.max(...valueAreaPrices);
    const val = Math.min(...valueAreaPrices);

    const tpoHigh = Math.max(...dayData.map(({ high }) => high));
    const tpoLow = Math.min(...dayData.map(({ low }) => low));

    const tpoOpen = dayData[0]?.open;
    const tpoClose = dayData[dayData.length - 1]?.close;

    const londonHighLow = getSessionHighLow(
      dayData,
      londonSession.start,
      londonSession.end,
    );

    const allDayHighLow = getSessionHighLow(
      dayData,
      londonNewYorkSession.start,
      londonNewYorkSession.end,
    );

    const nyHighLow = getSessionHighLow(
      dayData,
      newYorkSession.start,
      newYorkSession.end,
    );

    const ibHigh = Math.max(...firstTwoPeriods.map(({ high }) => high));
    const ibLow = Math.min(...firstTwoPeriods.map(({ low }) => low));

    const ibHighNY = Math.max(...firstTwoPeriodByNY.map(({ high }) => high));
    const ibLowNY = Math.min(...firstTwoPeriodByNY.map(({ low }) => low));

    const ibSize = ibHigh - ibLow;

    return {
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      date,
      poc,
      vah,
      val,
      ibHigh,
      ibLow,
      ibSize,
      firstSideFormed: getFirstSideFormed(firstTwoPeriods),
      ibBreakoutByLondon: getIbBreakout(
        londonHighLow.high,
        londonHighLow.low,
        ibHigh,
        ibLow,
      ),
      ibBreakoutByAllDay: getIbBreakout(
        allDayHighLow.high,
        allDayHighLow.low,
        ibHigh,
        ibLow,
      ),
      ibBreakoutNY: getIbBreakout(nyHighLow.high, nyHighLow.low, ibHigh, ibLow),
      ibExtByLondon: getIbExt(
        londonHighLow.high,
        londonHighLow.low,
        ibHigh,
        ibLow,
      ),
      ibExtByAllDay: getIbExt(tpoHigh, tpoLow, ibHigh, ibLow),
      ibExtByNY: getIbExt(nyHighLow.high, nyHighLow.low, ibHighNY, ibLowNY),
    };
  });
};

const getSessionHighLow = (data, sessionStartTime, sessionEndTime) => {
  const sessionData = data.filter((item) => {
    const itemTime = moment(item.time);
    const itemHoursMinutes = itemTime.format("HH:mm");

    return (
      itemHoursMinutes >= sessionStartTime && itemHoursMinutes <= sessionEndTime
    );
  });

  const high =
    sessionData.length > 0
      ? Math.max(...sessionData.map((item) => item.high))
      : null;
  const low =
    sessionData.length > 0
      ? Math.min(...sessionData.map((item) => item.low))
      : null;

  return { high, low };
};

const getIbBreakout = (high, low, ibHigh, ibLow) => {
  const highBreakout = high > ibHigh;
  const lowBreakout = low < ibLow;

  if (highBreakout && lowBreakout) return "High Breakout, Low Breakout";
  if (highBreakout) return "High Breakout";
  if (lowBreakout) return "Low Breakout";
  return "No Breakout";
};

export const getIbExt = (high, low, ibHigh, ibLow) => {
  const highExt = high > ibHigh ? high - ibHigh : 0;
  const lowExt = low < ibLow ? ibLow - low : 0;
  const maxExt = highExt > lowExt ? highExt : lowExt;

  return { highExt, lowExt, maxExt };
};

// Сессии
const londonSession = {
  start: "09:30",
  end: "13:30",
};

const londonNewYorkSession = {
  start: "08:00",
  end: "24:00",
};

const newYorkSession = {
  start: "15:30",
  end: "24:00",
};

export const segmentData = (data, segmentSize = 5) => {
  return data.map((item) => {
    const ibSize = item.ibSize;
    // const ib_ext = toNumber(item.ib_ext);
    // const ib_ext_high = toNumber(item.ib_ext_high);
    // const ib_ext_low = toNumber(item.ib_ext_low);

    return {
      ...item,
      ib_size_segmented: roundToNearest(ibSize, segmentSize),
      // ib_ext_segmented: roundToNearest(ib_ext, segmentSize),
      // ib_ext_high_segmented: roundToNearest(ib_ext_high, segmentSize),
      // ib_ext_low_segmented: roundToNearest(ib_ext_low, segmentSize),
    };
  });
};

function roundToNearest(number, segmentSize) {
  return Math.round(number / segmentSize) * segmentSize;
}

const minPercentage = 0.5;
export const filterLeastFrequentByIbSize = (
  data,
  percentage = minPercentage,
) => {
  // Проверка на пустой массив
  if (!data.length) {
    return [];
  }

  // Шаг 1: Подсчет частоты значений `ibSize`
  const frequencyMap = data.reduce(
    (acc, { ibSize }) => acc.set(ibSize, (acc.get(ibSize) || 0) + 1),
    new Map(),
  );

  // Шаг 2: Найти минимальную частоту
  const totalItems = data.length;
  const minAllowedFrequency = (percentage / 100) * totalItems;

  // Шаг 3: Отфильтровать элементы, которые встречаются реже минимальной частоты
  return data.filter(
    ({ ibSize }) => frequencyMap.get(ibSize) >= minAllowedFrequency,
  );
};

export const getLeastFrequentByIbSize = (data, percentage = minPercentage) => {
  // Проверка на пустой массив
  if (!data.length) {
    return [];
  }

  // Шаг 1: Подсчет частоты значений `ibSize`
  const frequencyMap = data.reduce(
    (acc, { ibSize }) => acc.set(ibSize, (acc.get(ibSize) || 0) + 1),
    new Map(),
  );

  // Шаг 2: Найти минимальную частоту, соответствующую проценту
  const totalItems = data.length;
  const maxAllowedFrequency = (percentage / 100) * totalItems || Infinity; // Если процент = 0, берутся все самые редкие

  // Шаг 3: Найти наименее частые значения
  const leastFrequentValues = Array.from(frequencyMap.entries())
    .filter(([, freq]) => freq <= maxAllowedFrequency)
    .map(([ibSize]) => ibSize);

  // Шаг 4: Вернуть элементы с наименее частыми значениями `ibSize`
  return data.filter(({ ibSize }) => leastFrequentValues.includes(ibSize));
};

export const getIbSizeBreaksByLondon = (data) => {
  // Проверка на пустой массив
  if (!data.length) {
    return null;
  }

  // Шаг 1: Разделить данные на "High Breakout" и "Low Breakout"
  const highBreakout = data.filter(
    ({ ibBreakoutByLondon }) => ibBreakoutByLondon === "High Breakout",
  );
  const lowBreakout = data.filter(
    ({ ibBreakoutByLondon }) => ibBreakoutByLondon === "Low Breakout",
  );

  // Шаг 2: Функция для подсчета частоты
  const calculateFrequency = (items) =>
    items.reduce((acc, { ibSize }) => {
      if (ibSize !== undefined && ibSize !== null) {
        acc.set(ibSize, (acc.get(ibSize) || 0) + 1);
      }
      return acc;
    }, new Map());

  // Шаг 3: Подсчет частоты для каждого типа ломки
  const highFrequencyMap = calculateFrequency(highBreakout);
  const lowFrequencyMap = calculateFrequency(lowBreakout);

  // Шаг 4: Определить наиболее частое значение для "High Breakout"
  const getMostFrequent = (frequencyMap) => {
    let maxFrequency = 0;
    let mostFrequentIbSize = null;

    for (const [ibSize, frequency] of frequencyMap.entries()) {
      if (frequency > maxFrequency) {
        maxFrequency = frequency;
        mostFrequentIbSize = ibSize;
      }
    }

    return { mostFrequentIbSize, frequency: maxFrequency };
  };

  const mostFrequentHigh = getMostFrequent(highFrequencyMap);
  const mostFrequentLow = getMostFrequent(lowFrequencyMap);

  return {
    highBreakout: mostFrequentHigh,
    lowBreakout: mostFrequentLow,
  };
};

export const filter = (filterValue, item) => {};

export const prepareData = (data) => {
  return data.reduce((acc, item) => {
    return [
      ...acc,
      {
        ...item,
        open_relation: getOpenRelation(acc, item),
        close_relation_prev: getCloseRelationByPrevDay(acc, item),
        close_relation: getCloseRelation(item),

        // opening_type: determineOpenTypeABC(acc, item),
        // type_day: determineDayType(item),
        isTouchVA: isTouchVA(acc, item),
        isTouchPOC: isTouchPOC(acc, item),
        isTouchVAL: isTouchVAL(acc, item),
        isTouchVAH: isTouchVAH(acc, item),
        isTouchRange: isTouchRange(acc, item),
        isTouchIB: isTouchIB(acc, item),
        open_relation_to_poc: getOpenRelationToPoc(acc, item),
      },
    ];
  }, []);
};

export const getOpenRelation = (acc, current) => {
  const prevItem = acc[acc.length - 1];
  const openClose = current?.tpoOpen;

  if (prevItem === undefined) {
    return "-";
  }

  if (openClose >= prevItem?.val && openClose <= prevItem?.vah) {
    return OPENS_OPTIONS.IN_VA;
  }

  if (openClose > prevItem?.tpoHigh) {
    return OPENS_OPTIONS.ABOVE_RANGE;
  }

  if (openClose < prevItem?.tpoLow) {
    return OPENS_OPTIONS.LOWER_RANGE;
  }

  if (openClose > prevItem?.vah) {
    return OPENS_OPTIONS.ABOVE_VA;
  }

  if (openClose < prevItem?.val) {
    return OPENS_OPTIONS.LOWER_VA;
  }
};

export const getCloseRelation = (item) => {
  const { val, vah } = item;

  const tpoClose = item.tpoClose;

  if (tpoClose >= val && tpoClose <= vah) {
    return CLOSES_OPTIONS.IN_VA;
  }

  if (tpoClose > vah) {
    return CLOSES_OPTIONS.ABOVE_VA;
  }

  if (tpoClose < val) {
    return CLOSES_OPTIONS.LOWER_VA;
  }
};

export const getCloseRelationByPrevDay = (acc, current) => {
  const prevItem = acc[acc.length - 1];
  const tpoClose = current?.tpoClose;

  if (prevItem === undefined) {
    return "-";
  }

  if (tpoClose >= prevItem?.val && tpoClose <= prevItem?.vah) {
    return CLOSES_OPTIONS.IN_VA;
  }

  if (tpoClose > prevItem?.tpoHigh) {
    return CLOSES_OPTIONS.ABOVE_RANGE;
  }

  if (tpoClose < prevItem?.tpoLow) {
    return CLOSES_OPTIONS.LOWER_RANGE;
  }

  if (tpoClose > prevItem?.vah) {
    return CLOSES_OPTIONS.ABOVE_VA;
  }

  if (tpoClose < prevItem?.val) {
    return CLOSES_OPTIONS.LOWER_VA;
  }
};

export const isTouchVA = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoOpen, tpoLow, tpoHigh } = item;

  const { val, vah } = prevItem;

  if (tpoOpen >= val && tpoOpen <= vah) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen >= vah && tpoLow <= vah) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen <= val && tpoHigh >= val) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTouchRange = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoOpen, tpoLow, tpoHigh } = item;
  const { tpoLow: tpoLowPrev, tpoHigh: tpoHighPrev } = prevItem;

  if (tpoOpen >= tpoLowPrev && tpoOpen <= tpoHighPrev) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen > tpoHighPrev && tpoLow <= tpoHighPrev) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen < tpoLowPrev && tpoHigh >= tpoLowPrev) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTouchIB = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoOpen, tpoLow, tpoHigh } = item;

  const { ibHigh, ibLow } = prevItem;

  if (tpoOpen >= ibLow && tpoOpen <= ibHigh) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen > ibHigh && tpoLow < ibHigh) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen < ibLow && tpoHigh > ibLow) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTouchPOC = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const admission = 2;

  const { tpoOpen, tpoLow, tpoHigh } = item;

  const { poc } = prevItem;
  const POC_High = poc + admission;
  const POC_LOW = poc + admission;

  if (tpoOpen > poc && tpoLow < POC_High) {
    return TEST_OPTIONS.YES;
  }

  if (tpoOpen < poc && tpoHigh > POC_LOW) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const calculateAverageIBSize = (data) => {
  const ibSizes = data.map((day) => day.ibSize);

  const totalIBSize = ibSizes.reduce((sum, size) => sum + size, 0);
  const averageIBSize = totalIBSize / ibSizes.length;

  return parseFloat(averageIBSize.toFixed(2));
};

export const getOpenRelationToPoc = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return null;
  }

  const { poc: prevPoc } = prevItem;
  const { tpoOpen } = item;

  if (tpoOpen < prevPoc) {
    return OPENS_RELATION_TO_TOC.LOWER_POC;
  }

  if (tpoOpen > prevPoc) {
    return OPENS_RELATION_TO_TOC.ABOVE_POC;
  }
};

export const getFirstSideFormed = (firstTwoPeriods) => {
  const aPeriod = firstTwoPeriods[0];
  const bPeriod = firstTwoPeriods[1];

  const aTrend = aPeriod.close > aPeriod.open ? TRENDS.BULLISH : TRENDS.BEARISH;
  const bTrend = bPeriod.close > bPeriod.open ? TRENDS.BULLISH : TRENDS.BEARISH;

  const close = bPeriod.close;

  if (aTrend === TRENDS.BULLISH && aPeriod.low < bPeriod.low) {
    return FIRST_FORMED.LOW;
  } else if (aTrend === TRENDS.BEARISH && aPeriod.high > bPeriod.high) {
    return FIRST_FORMED.HIGH;
  } else if (aTrend === TRENDS.BULLISH && aPeriod.high > bPeriod.high) {
    return FIRST_FORMED.HIGH;
  } else if (aTrend === TRENDS.BEARISH && aPeriod.high > bPeriod.high) {
    return FIRST_FORMED.HIGH;
  } else if (aTrend === TRENDS.BEARISH && aPeriod.low < bPeriod.low) {
    return FIRST_FORMED.LOW;
  } else if (bTrend === TRENDS.BULLISH && bPeriod.low < aPeriod.low) {
    return FIRST_FORMED.LOW;
  } else if (bTrend === TRENDS.BEARISH && bPeriod.high > aPeriod.high) {
    return FIRST_FORMED.HIGH;
  } else if (close > aPeriod.high && close > aPeriod.low) {
    return FIRST_FORMED.LOW;
  } else if (close < aPeriod.low && close > bPeriod.low) {
    return FIRST_FORMED.HIGH;
  } else if (aPeriod.high >= bPeriod.high) {
    return FIRST_FORMED.HIGH;
  } else if (bPeriod.low <= aPeriod.low) {
    return FIRST_FORMED.LOW;
  }

  return "No clear formation";
};

const getFirstCandle = ({ open, close }) => {
  if (open > close) {
    return CANDLE_TYPES.BEARISH;
  }

  if (close > open) {
    return CANDLE_TYPES.BULLISH;
  }
};

export const isTouchVAL = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoOpen, tpoLow, tpoHigh } = item;

  const { val: prevVal, poc: prevPoc } = prevItem;

  if (tpoLow <= prevVal) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTouchVAH = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoHigh } = item;

  const { vah: prevVah } = prevItem;

  if (tpoHigh >= prevVah) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const prepareWeaklyData = (data) => {
  return data.map((item) => {
    const weeklySize = roundToNearest(item.high - item.low, 25);

    return { ...item, weekly_size: weeklySize };
  });
};

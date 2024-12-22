import moment from "moment";
import {
  CLOSES_OPTIONS,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "../Stats/constants.js";

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
      ibBrokenByLondon: getIbBroken(
        londonHighLow.high,
        londonHighLow.low,
        ibHigh,
        ibLow,
      ),
      ibBrokenByAllDay: getIbBroken(
        allDayHighLow.high,
        allDayHighLow.low,
        ibHigh,
        ibLow,
      ),
      ibBrokenNY: getIbBroken(nyHighLow.high, nyHighLow.low, ibHigh, ibLow),
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

const getIbBroken = (high, low, ibHigh, ibLow) => {
  const highBroken = high > ibHigh;
  const lowBroken = low < ibLow;

  if (highBroken && lowBroken) return "High Broken, Low Broken";
  if (highBroken) return "High Broken";
  if (lowBroken) return "Low Broken";
  return "No Broken";
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

  // Шаг 1: Разделить данные на "High Broken" и "Low Broken"
  const highBroken = data.filter(
    ({ ibBrokenByLondon }) => ibBrokenByLondon === "High Broken",
  );
  const lowBroken = data.filter(
    ({ ibBrokenByLondon }) => ibBrokenByLondon === "Low Broken",
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
  const highFrequencyMap = calculateFrequency(highBroken);
  const lowFrequencyMap = calculateFrequency(lowBroken);

  // Шаг 4: Определить наиболее частое значение для "High Broken"
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
    highBroken: mostFrequentHigh,
    lowBroken: mostFrequentLow,
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
        isTestVA: isTestVA(acc, item),
        isTestPOC: isTestPOC(acc, item),
        isTestRange: isTestRange(acc, item),
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

export const isTestVA = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.tpoOpen;
  const tpoLow = item.tpoLow;
  const tpoHigh = item.tpoHigh;

  const { VAL, VAH } = prevItem;

  if (open >= VAL && open <= VAH) {
    return TEST_OPTIONS.YES;
  }

  if (open > VAH && tpoLow < VAH) {
    return TEST_OPTIONS.YES;
  }

  if (open < VAL && tpoHigh > VAL) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestRange = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.tpoOpen;
  const tpoLow = item.tpoLow;
  const tpoHigh = item.tpoHigh;

  const { tpoLow: tpoLowPrev, tpoHigh: tpoHighPrev } = prevItem;

  if (open >= tpoLow && open <= tpoHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open > tpoHigh && tpoLow < tpoHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open < tpoLow && tpoHigh > tpoLow) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestIB = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const open = item.tpoOpen;
  const tpoLow = item.tpoLow;
  const tpoHigh = item.tpoHigh;

  const { ibHigh, ibLow } = prevItem;

  if (open >= ibLow && open <= ibHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open > ibHigh && tpoLow < ibHigh) {
    return TEST_OPTIONS.YES;
  }

  if (open < ibLow && tpoHigh > ibLow) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestPOC = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const admission = 2;

  const open = item.tpoOpen;
  const tpoLow = item.tpoLow;
  const tpoHigh = item.tpoHigh;

  const { poc } = prevItem;
  const POC_High = poc + admission;
  const POC_LOW = poc + admission;

  if (open > poc && tpoLow < POC_High) {
    return TEST_OPTIONS.YES;
  }

  if (open < poc && tpoHigh > POC_LOW) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

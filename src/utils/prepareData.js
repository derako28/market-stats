import {
  CANDLE_TYPES,
  CLOSES_OPTIONS,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "./constants.js";

const getIbBroken = (high, low, ibHigh, ibLow) => {
  const highBroken = high > ibHigh;
  const lowBroken = low < ibLow;

  if (highBroken && lowBroken) return "High Broken, Low Broken";
  if (highBroken) return "High Broken";
  if (lowBroken) return "Low Broken";
  return "No Broken";
};

export const getIbExt = (high, low, ibHigh, ibLow) => {
  const highExt = high > ibHigh ? (high - ibHigh) * 4 : 0;
  const lowExt = low < ibLow ? (ibLow - low) * 4 : 0;
  const maxExt = highExt > lowExt ? highExt : lowExt;

  return { highExt, lowExt, maxExt };
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

export const roundToNearest = (number, segmentSize = 1) => {
  return Math.round(number / segmentSize) * segmentSize;
};

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
        isTestVA: isTestVA(acc, item),
        isTestVAL: isTestVAL(acc, item),
        isTestVAH: isTestVAH(acc, item),
        isTestPOC: isTestPOC(acc, item),
        isTestRange: isTestRange(acc, item),
        isTestIB: isTestIB(acc, item),
        open_relation_to_poc: getOpenRelationToPoc(acc, item),
        // type_day: determineDayType(item),
      },
    ];
  }, []);
};

export const setOpeningType = (data) => {
  return data.reduce((acc, item) => {
    return [
      ...acc,
      {
        ...item,
        opening_type: determineOpenTypeABC(acc, item),
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

export const getOpenRelationToPoc = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return null;
  }

  const { poc: prevPoc } = prevItem;
  const { tpoOpen } = item;

  if (tpoOpen < prevPoc) {
    return "underPoc";
  }

  if (tpoOpen > prevPoc) {
    return "overPoc";
  }
};
export const isTestVA = (acc, item) => {
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

export const isTestVAL = (acc, item) => {
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

export const isTestVAH = (acc, item) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem) {
    return false;
  }

  const { tpoOpen, tpoLow, tpoHigh } = item;

  const { vah: prevVah } = prevItem;

  if (tpoHigh >= prevVah) {
    return TEST_OPTIONS.YES;
  }

  return TEST_OPTIONS.NO;
};

export const isTestRange = (acc, item) => {
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

export const isTestIB = (acc, item) => {
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

export const isTestPOC = (acc, item) => {
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

export const compileMarketProfileByDays = (
  data,
  valueAreaPercent = 68,
  tpr = 5,
  step = 0.25,
) => {
  const priceStep = tpr * step; // Рассчитываем шаг цен

  // Группировка данных по дням
  const groupedData = data
    .filter((item) => !item.time.includes("22:00"))
    .reduce((acc, entry) => {
      const date = entry.time.split("T")[0];

      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});

  // Итоговый массив с §данными по дням
  return Object.entries(groupedData).map(([date, dailyData]) => {
    const profileArray = calculateTPOProfile(dailyData, priceStep); // Формируем TPO профиль

    // Расчёт Value Area
    const { vah, val } = calculateValueArea(profileArray, valueAreaPercent);

    // Расчёт POC, используя метод поиска ближе к центру Value Area
    const poc = getPOCWithValueAreaCenter(profileArray, vah, val);

    // Формируем данные профиля
    const profile = profileArray.map((level) => ({
      price: level.price,
      segments: level.segments,
      tpoCount: level.segments.length,
      isPOC: level.price === poc,
      isVAH: level.price === vah,
      isVAL: level.price === val,
    }));

    const tpoHigh = Math.max(...dailyData.map(({ high }) => high));
    const tpoLow = Math.min(...dailyData.map(({ low }) => low));

    const tpoOpen = dailyData[0]?.open;
    const tpoClose = dailyData[dailyData.length - 1]?.close;

    const firstTwoPeriods = dailyData.slice(0, 2);

    const ibHigh = Math.max(...firstTwoPeriods.map(({ high }) => high));
    const ibLow = Math.min(...firstTwoPeriods.map(({ low }) => low));

    const ibSize = ibHigh - ibLow;

    const aHigh = dailyData[0].high;
    const aLow = dailyData[0].low;

    const bHigh = dailyData[1].high;
    const bLow = dailyData[1].low;

    const cHigh = dailyData[2].high;
    const cLow = dailyData[2].low;

    const trend = tpoOpen > tpoClose ? "Bearish" : "Bullish";

    return {
      date,
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      ibHigh,
      ibLow,
      ibSize,
      poc,
      vah,
      val,
      profile,
      aHigh,
      aLow,
      bHigh,
      bLow,
      cHigh,
      cLow,
      trend,
      ibBroken: getIbBroken(tpoHigh, tpoLow, ibHigh, ibLow),
      ibExt: getIbExt(tpoHigh, tpoLow, ibHigh, ibLow),
      breakoutPeriods: findBreakoutPeriods(dailyData),
      first_candle: getFirstCandle(dailyData[0]),
    };
  });
};

export const groupDataByDate = (data) => {
  const groupedData = {};

  data.forEach(({ time, high, low, open, close }) => {
    const date = new Date(time).toLocaleDateString(); // Получаем только дату (без времени)
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push({ time, high, low, open, close });
  });

  return groupedData;
};

// Функция для расчета профиля с буквами, где каждая буква соответствует 30 минутам
export const calculateTPOProfile = (data, priceStep) => {
  const profile = new Map();
  let letterIndex = 0;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Буквы для каждого блока (для 26 временных отрезков)

  data.forEach(({ time, high, low }) => {
    let price = Math.floor(low / priceStep) * priceStep;
    const letter = alphabet[letterIndex % alphabet.length]; // Используем буквы по циклу

    // Разбиваем данные по временным отрезкам (например, 30 минут)
    const timeKey = new Date(time).toLocaleString(); // Делаем ключ на основе времени, чтобы различать отрезки

    while (price <= high) {
      if (!profile.has(price)) {
        profile.set(price, []);
      }
      profile.get(price).push({ letter, timeKey }); // Добавляем букву и временной отрезок
      price += priceStep;
    }

    letterIndex++; // Увеличиваем индекс для следующей буквы
  });

  // Преобразуем Map в массив для сортировки
  return Array.from(profile.entries())
    .map(([price, segments]) => ({
      price: parseFloat(price),
      segments,
    }))
    .sort((a, b) => b.price - a.price);
};

// Функция для расчета Value Area
export const getPOCWithValueAreaCenter = (profileArray, vah, val) => {
  const valueAreaCenter = (vah + val) / 2;

  return profileArray
    .filter(
      ({ segments }) =>
        segments.length ===
        Math.max(...profileArray.map(({ segments }) => segments.length)),
    )
    .reduce((closest, level) => {
      const currentDiff = Math.abs(level.price - valueAreaCenter);
      const closestDiff = Math.abs(closest.price - valueAreaCenter);
      return currentDiff < closestDiff ? level : closest;
    }).price;
};

export const calculateValueArea = (profileArray, valueAreaPercent) => {
  const totalBlocks = profileArray.reduce(
    (sum, { segments }) => sum + segments.length,
    0,
  );
  const valueAreaTarget = totalBlocks * (valueAreaPercent / 100);

  // Найдём POC — уровень с максимальным количеством блоков
  const pocIndex = profileArray.findIndex(
    ({ segments }) =>
      segments.length ===
      Math.max(...profileArray.map(({ segments }) => segments.length)),
  );

  let valueAreaBlocks = profileArray[pocIndex].segments.length;
  let vahIndex = pocIndex;
  let valIndex = pocIndex;

  while (valueAreaBlocks < valueAreaTarget) {
    // Рассчитаем количество блоков выше и ниже текущего диапазона VA
    const above = vahIndex > 0 ? profileArray[vahIndex - 1] : null;
    const below =
      valIndex < profileArray.length - 1 ? profileArray[valIndex + 1] : null;

    const aboveBlocks = above ? above.segments.length : -1;
    const belowBlocks = below ? below.segments.length : -1;

    // Определяем, какой уровень добавить в VA: выше или ниже
    if (aboveBlocks > belowBlocks) {
      valueAreaBlocks += aboveBlocks;
      vahIndex -= 1;
    } else if (belowBlocks > aboveBlocks) {
      valueAreaBlocks += belowBlocks;
      valIndex += 1;
    } else if (aboveBlocks === belowBlocks) {
      // Если количество блоков одинаковое, выбираем уровень ближе к POC
      const aboveDistance = Math.abs(vahIndex - 1 - pocIndex);
      const belowDistance = Math.abs(valIndex + 1 - pocIndex);

      if (aboveDistance <= belowDistance) {
        valueAreaBlocks += aboveBlocks;
        vahIndex -= 1;
      } else {
        valueAreaBlocks += belowBlocks;
        valIndex += 1;
      }
    }
  }

  return {
    vah: profileArray[vahIndex]?.price,
    val: profileArray[valIndex]?.price,
  };
};

export const buildMarketProfile = (data, valueAreaPercent = 68, tpr = 5) => {
  const priceStep = tpr * 0.25;
  const profileArray = calculateTPOProfile(
    data.filter((item) => !item.time.includes("22:00")),
    priceStep,
  );

  // Вычисляем Value Area High и Value Area Low
  const { vah, val } = calculateValueArea(profileArray, valueAreaPercent);

  // Получаем POC, используя центр Value Area
  const poc = getPOCWithValueAreaCenter(profileArray, vah, val);

  return { poc, vah, val, profile: profileArray };
};

export const forecastNextDay = (historicalData, openRelation) => {
  // 1. Рассчитываем средние значения
  const averages = historicalData.reduce(
    (acc, day) => {
      acc.ibSize += day.ibSize;
      acc.highExt += day.ibExt.highExt;
      acc.lowExt += day.ibExt.lowExt;
      acc.poc += day.poc;
      acc.vah += day.vah;
      acc.val += day.val;
      return acc;
    },
    { ibSize: 0, highExt: 0, lowExt: 0, poc: 0, vah: 0, val: 0 },
  );

  const count = historicalData.length;
  const avgIbSize = averages.ibSize / count;
  const avgHighExt = averages.highExt / count;
  const avgLowExt = averages.lowExt / count;
  const avgPoc = averages.poc / count;
  const avgVah = averages.vah / count;
  const avgVal = averages.val / count;

  // 2. Прогноз уровней
  const forecast = {
    poc: avgPoc.toFixed(2),
    vah: (avgVah + avgHighExt).toFixed(2),
    val: (avgVal - avgLowExt).toFixed(2),
    probableIbSize: avgIbSize.toFixed(2),
    probableBreak: avgHighExt > avgLowExt ? "High Broken" : "Low Broken",
  };

  // 3. Учет open_relation для уточнения сценария
  switch (openRelation) {
    case "O > VA":
      forecast.openRelationScenario = "Likely bullish start with upward trend.";
      break;
    case "O < VA":
      forecast.openRelationScenario =
        "Likely bearish start with downward trend.";
      break;
    case "O in VA":
      forecast.openRelationScenario = "Likely ranging day within value area.";
      break;
    default:
      forecast.openRelationScenario = "No specific scenario for open relation.";
  }

  // 4. Определяем трендовый или флэтовый сценарий
  forecast.trendBias =
    forecast.vah - forecast.val > avgIbSize ? "Trending Day" : "Ranging Day";

  return forecast;
};

const determineOpenTypeABC = (acc, current, admission = 2.5) => {
  const prevItem = acc[acc.length - 1];

  if (!prevItem || !current) {
    return "-";
  }

  const {
    aHigh,
    aLow,
    bHigh,
    bLow,
    cHigh,
    cLow,
    tpoOpen: openPrice,
    open_relation: openRelation,
  } = current;
  const {
    vah: prevVah,
    val: prevVal,
    tpoLow: prevTpoLow,
    tpoHigh: prevTpoHigh,
  } = prevItem;

  const isCAboveAandB = cHigh > aHigh + admission && cHigh > bHigh + admission;
  const isCBelowAandB = cLow < aLow - admission && cLow < bLow - admission;

  const isBAboveA = bHigh > aHigh;
  const isBBelowA = bLow < aLow;

  const isCAboveA = cHigh > aHigh;
  const isCBelowA = cLow < aLow;

  const isCAboveB = cHigh > bHigh;
  const isCBelowB = cLow < bLow;

  const isOpenOnExtremum = aLow - openPrice > admission * 2;

  const highestHigh = Math.max(aHigh, bHigh, cHigh);
  const lowestLow = Math.min(aLow, bLow, cLow);

  // Проверяем, находится ли TPO_Open в пределах допуска
  const isNearHigh = openPrice >= highestHigh - admission * 2;
  const isNearLow = openPrice <= lowestLow + admission * 2;

  if (!aHigh || !aLow || !bHigh || !bLow || !cHigh || !cLow) {
    return "-";
  }

  if (aHigh >= bHigh && aLow <= bLow) {
    return "OA";
  }

  if (openRelation === OPENS_OPTIONS.IN_VA) {
    if (isNearLow && aLow > prevVal && aHigh > prevVah && isCAboveA) {
      return "OA (OD)";
    }

    if (isNearHigh && aHigh < prevVah && aLow < prevVah && isCBelowA) {
      return "OA (OD)";
    }

    if (
      (aLow < prevVal && aHigh > prevVal) ||
      (aHigh > prevVah && aLow < prevVah)
    ) {
      return "OA (ORR)";
    }

    if (prevVal - aLow < 1 || prevVah - aHigh < 1) {
      return "OA (OTD)";
    }

    return "OA";
  }

  if (
    openRelation === OPENS_OPTIONS.ABOVE_VA ||
    openRelation === OPENS_OPTIONS.ABOVE_RANGE
  ) {
    if (isNearHigh && aLow < prevVah && isCBelowA) {
      return "OD";
    }

    if (isNearLow && aHigh > prevVah && isCAboveA) {
      return "OD";
    }

    if (aHigh > prevTpoHigh && isBBelowA) {
      return "ORR";
    }

    if (aLow <= prevVah + admission && (bHigh > prevVah || cHigh > prevVah)) {
      return "OTD";
    }
  }

  if (
    openRelation === OPENS_OPTIONS.LOWER_VA ||
    openRelation === OPENS_OPTIONS.LOWER_RANGE
  ) {
    if (isNearLow && aHigh > prevVal && isCAboveA) {
      return "OD";
    }

    if (isNearHigh && aLow > prevVal && isCBelowA) {
      return "OD";
    }

    if (aLow < prevTpoLow && isBAboveA) {
      return "ORR";
    }

    if (aHigh >= prevVal - admission && (bLow < prevVal || cLow < prevVal)) {
      return "OTD";
    }
  }

  // OLD

  if (
    ((cLow < bLow && bLow < aLow) ||
      (cHigh > bHigh && bHigh > aHigh) ||
      (isNearHigh && aHigh > bHigh && aHigh > cHigh) ||
      (isNearLow && cLow > bLow && aLow > cLow)) &&
    (isNearHigh || isNearLow)
  ) {
    return "OD";
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

  if (
    openPrice >= prevVal &&
    openPrice <= prevVah &&
    (((aHigh > prevVah || bHigh > prevVah) && cLow < prevVah) ||
      ((aLow < prevVal || bLow < prevVal) && cHigh > prevVal))
  ) {
    return "ORR";
  }

  if (
    ((openPrice >= prevVah &&
      (aHigh > openPrice || bHigh > openPrice) &&
      cLow < aLow &&
      cLow < bLow) ||
      (openPrice <= prevVal &&
        (aLow < openPrice || bLow < openPrice) &&
        cHigh > aHigh &&
        cHigh > bHigh)) &&
    !(aLow < prevVal && aHigh > prevVah)
  ) {
    return "ORR";
  }

  if (
    (openPrice > prevVah && aLow <= prevVah && cHigh > bHigh) ||
    (openPrice < prevVal && aHigh >= prevVal && cLow < bLow) ||
    (openPrice > prevVah &&
      aLow < openPrice - admission * 4 &&
      cHigh > bHigh + admission) ||
    (openPrice > prevVal &&
      aHigh > openPrice + admission * 4 &&
      cLow < bLow - admission)
  ) {
    return "OTD";
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

  // OLD

  return "-"; // Не удалось точно определить тип
};

export const findBreakoutPeriods = (ohlcData) => {
  // 1. Добавляем алфавитные обозначения для периодов
  const alphabet = "ABCDEFGHIJKLM";
  ohlcData.forEach((period, index) => {
    period.period = alphabet[index]; // Присваиваем букву
  });

  // 2. Рассчитать IB High и IB Low (первые два периода: A и B)
  const ibHigh = Math.max(ohlcData[0].high, ohlcData[1].high);
  const ibLow = Math.min(ohlcData[0].low, ohlcData[1].low);

  let firstBreakout = null;
  let oppositeBreakout = null;

  // 3. Найти первый пробой IB
  for (const period of ohlcData.slice(2)) {
    if (!firstBreakout && (period.high > ibHigh || period.low < ibLow)) {
      firstBreakout = {
        period: period.period,
        time: period.time,
        breakoutType: period.high > ibHigh ? "High Breakout" : "Low Breakout",
      };
    }

    // 4. Найти противоположный пробой
    if (
      firstBreakout &&
      !oppositeBreakout &&
      ((firstBreakout.breakoutType === "High Breakout" && period.low < ibLow) ||
        (firstBreakout.breakoutType === "Low Breakout" && period.high > ibHigh))
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
    ibHigh,
    ibLow,
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

export const calculateTrendStatistics = (data) => {
  const groupedByDay = {};

  // Group data by date
  data.forEach((candle) => {
    const date = candle.time.split("T")[0]; // Extract date from ISO format
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(candle);
  });

  // Initialize statistics
  const stats = {
    bullishFirstCandle: { bullishDay: 0, bearishDay: 0 },
    bearishFirstCandle: { bullishDay: 0, bearishDay: 0 },
  };

  // Process each day
  Object.entries(groupedByDay).forEach(([day, candles]) => {
    if (!candles.length) return;

    // Determine first candle trend
    const firstCandle = candles[0];
    const firstTrend =
      firstCandle.close > firstCandle.open ? "bullish" : "bearish";

    // Determine daily trend (close vs open of the last candle)
    const dailyTrend =
      candles[candles.length - 1].close > candles[0].open
        ? "bullish"
        : "bearish";

    // Update statistics
    if (firstTrend === "bullish") {
      if (dailyTrend === "bullish") {
        stats.bullishFirstCandle.bullishDay += 1;
      } else {
        stats.bullishFirstCandle.bearishDay += 1;
      }
    } else {
      if (dailyTrend === "bullish") {
        stats.bearishFirstCandle.bullishDay += 1;
      } else {
        stats.bearishFirstCandle.bearishDay += 1;
      }
    }
  });

  // Calculate percentages
  const percentages = {};
  Object.entries(stats).forEach(([trend, outcomes]) => {
    const total = outcomes.bullishDay + outcomes.bearishDay;
    percentages[trend] =
      total > 0
        ? {
            bullish: ((outcomes.bullishDay / total) * 100).toFixed(0),
            bearish: ((outcomes.bearishDay / total) * 100).toFixed(0),
          }
        : {
            bullish: 0,
            bearish: 0,
          };
  });

  return percentages;
};

export const getDataChartByFirstCandle = (data = [], property) => {
  return [
    {
      asset: "Bearish Day",
      amount: +data[property]?.bearish,
    },
    {
      asset: "Bullish Day",
      amount: +data[property]?.bullish,
    },
  ];
};

const getFirstCandle = ({ open, close }) => {
  if (open > close) {
    return CANDLE_TYPES.BEARISH;
  }

  if (close > open) {
    return CANDLE_TYPES.BULLISH;
  }
};

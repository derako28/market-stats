import {
  CLOSES_OPTIONS,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "../Stats/constants.js";
import { toNumber } from "../Stats/utils.js";

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

function roundToNearest(number, segmentSize) {
  return Math.round(number / segmentSize) * segmentSize;
}

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
        isTestIB: isTestIB(acc, item),
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
  tpr = 40,
  step = 0.25,
) => {
  const priceStep = tpr * step;

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

    const ibSize = (ibHigh - ibLow) * 4;

    const A_High = dailyData[0].high;
    const A_Low = dailyData[0].low;

    const B_High = dailyData[1].high;
    const B_Low = dailyData[1].low;

    const C_High = dailyData[2].high;
    const C_Low = dailyData[2].low;

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
      ibBroken: getIbBroken(tpoHigh, tpoLow, ibHigh, ibLow),
      ibExt: getIbExt(tpoHigh, tpoLow, ibHigh, ibLow),
      A_High,
      A_Low,
      B_High,
      B_Low,
      C_High,
      C_Low,
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

export const buildMarketProfile = (
  data,
  valueAreaPercent = 68,
  tpr = 5,
  step = 1,
) => {
  const priceStep = tpr * step;
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

const determineOpenTypeABC = (acc, current) => {
  const prevItem = acc[acc.length - 1];

  // console.log("#prevItem: ", prevItem);
  // console.log("#current: ", current);

  // if (!prevItem || !current) {
  //   return "-";
  // }

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
    (openPrice > vah && aLow <= vah && cHigh > bHigh) ||
    (openPrice < val && aHigh >= val && cLow < bLow) ||
    (openPrice > vah &&
      aLow < openPrice - admission * 4 &&
      cHigh > bHigh + admission) ||
    (openPrice > val &&
      aHigh > openPrice + admission * 4 &&
      cLow < bLow - admission)
  ) {
    return "OTD";
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

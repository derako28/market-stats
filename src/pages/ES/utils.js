import {
  CLOSES_OPTIONS,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "../Stats/constants.js";

export const buildMarketProfileOld = (data, valueAreaPercent = 68, tpr = 5) => {
  const priceStep = tpr * 0.25; // Шаг цены для округления уровней, учитывая ticks per row
  const profile = new Map(); // Хранение TPO по уровням цен

  // Заполнение TPO профиля
  data.forEach(({ high, low }) => {
    let price = Math.floor(low / priceStep) * priceStep; // Округление до ближайшего шага цены
    while (price <= high) {
      profile.set(price, (profile.get(price) || 0) + 1);
      price += priceStep;
    }
  });

  // Преобразование Map в массив для анализа
  const profileArray = Array.from(profile.entries())
    .map(([price, tpo]) => ({ price: parseFloat(price), tpo }))
    .sort((a, b) => b.price - a.price);

  // Вычисление POC, VAH, VAL
  const totalTPOs = profileArray.reduce((sum, { tpo }) => sum + tpo, 0);
  let valueAreaTPOs = 0;
  const valueAreaThreshold = (valueAreaPercent / 100) * totalTPOs;
  let poc = null;
  let vah = null;
  let val = null;

  profileArray.forEach(({ tpo }, index) => {
    if (poc === null || tpo > profileArray[poc].tpo) {
      poc = index;
    }

    if (valueAreaTPOs < valueAreaThreshold) {
      valueAreaTPOs += tpo;
      if (vah === null) vah = index;
      val = index;
    }
  });

  return {
    poc: profileArray[poc]?.price,
    vah: profileArray[vah]?.price,
    val: profileArray[val]?.price,
    profile: profileArray,
  };
};

export const calculateOHLCProfile = (data, valueAreaPercent = 68) => {
  // Группировка данных по дням
  const groupedByDay = data.reduce((acc, period) => {
    const date = period.time.split("T")[0]; // Получаем дату из строки времени
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(period);
    return acc;
  }, {});

  // Функция для расчета POC, VAH и VAL для данных одного дня
  const calculateProfile = (dayData) => {
    let priceLevels = {};

    // Заполняем ценовые уровни
    dayData.forEach((period) => {
      const { low, high } = period;
      const step = 0.25; // Шаг для уровней цен (можно варьировать)

      // Для каждого периода рассчитываем диапазон цен
      for (let price = low; price <= high; price += step) {
        const roundedPrice = Math.round(price * 100) / 100; // округляем до 2 знаков
        priceLevels[roundedPrice] = (priceLevels[roundedPrice] || 0) + 1;
      }
    });

    // Преобразуем объект в массив для сортировки
    let sortedPriceLevels = Object.entries(priceLevels).map(
      ([price, count]) => ({
        price: parseFloat(price),
        count,
      }),
    );

    // Сортируем по убыванию частоты появления
    sortedPriceLevels.sort((a, b) => b.count - a.count);

    // Общая сумма блоков
    const totalBlocks = sortedPriceLevels.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );
    const targetBlocks = totalBlocks * (valueAreaPercent / 100);

    let vaBlocks = [];
    let vaBlockCount = 0;

    // Собираем блоки до достижения целевого количества для VA
    for (
      let i = 0;
      vaBlockCount < targetBlocks && i < sortedPriceLevels.length;
      i++
    ) {
      vaBlocks.push(sortedPriceLevels[i]);
      vaBlockCount += sortedPriceLevels[i].count;
    }

    // Определяем POC, VAH и VAL
    const poc = sortedPriceLevels[0].price; // Цена с максимальной плотностью
    const vah = Math.max(...vaBlocks.map((block) => block.price)); // Value Area High
    const val = Math.min(...vaBlocks.map((block) => block.price)); // Value Area Low

    return { poc, vah, val };
  };

  // Для каждого дня вычисляем POC, VAH, VAL и возвращаем результаты
  return Object.entries(groupedByDay).map(([date, dayData]) => {
    const profile = calculateProfile(dayData);
    return {
      date,
      poc: profile.poc,
      vah: profile.vah,
      val: profile.val,
    };
  });
};

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

    const vah = Math.max(...valueAreaPrices);
    const val = Math.min(...valueAreaPrices);

    const tpoHigh = Math.max(...dayData.map(({ high }) => high));
    const tpoLow = Math.min(...dayData.map(({ low }) => low));

    const tpoOpen = dayData[0]?.open;
    const tpoClose = dayData[dayData.length - 1]?.close;

    const ibHigh = Math.max(...firstTwoPeriods.map(({ high }) => high));
    const ibLow = Math.min(...firstTwoPeriods.map(({ low }) => low));

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
      ibBroken: getIbBroken(tpoHigh, tpoLow, ibHigh, ibLow),
      ibExt: getIbExt(tpoHigh, tpoLow, ibHigh, ibLow),
    };
  });
};

export const calculateMarketProfileByDay2 = (
  data,
  valueAreaPercent = 68,
  ticksPerRow = 5,
) => {
  const dailyData = data.reduce((acc, entry) => {
    const day = entry.time.split("T")[0]; // Извлекаем дату в формате "YYYY-MM-DD"
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);

    return acc;
  }, {});

  return Object.entries(dailyData).map(([date, dayData]) => {
    let totalVolume = 0;
    let priceVolumes = {};

    // Шаг 1: Фильтруем данные по дате (по времени свечи)
    const targetDate = new Date().toDateString(); // Берем текущую дату для фильтрации данных

    // Фильтруем только те данные, которые принадлежат нужной дате
    const filteredData = data.filter((candle) => {
      const candleDate = new Date(candle.time); // Преобразуем время свечи в объект Date
      return candleDate.toDateString() === targetDate; // Сравниваем только день (игнорируем время)
    });

    // Шаг 2: Суммируем объемы для каждого ценового уровня
    filteredData.forEach((candle) => {
      const { open, high, low, close, volume } = candle;
      const priceRange = [low, high];

      // Создаем диапазон цен для расчета
      let step = ticksPerRow; // Шаг равен ticksPerRow (5)
      let startPrice = Math.floor(low / step) * step; // Начальная цена для диапазона
      let endPrice = Math.ceil(high / step) * step; // Конечная цена для диапазона

      // Разбиваем диапазон цен на уровни
      for (let price = startPrice; price <= endPrice; price += step) {
        priceVolumes[price] = (priceVolumes[price] || 0) + volume;
      }

      totalVolume += volume;
    });

    // Шаг 3: Находим POC (уровень с максимальным объемом)
    let maxVolume = -Infinity;
    let POC = null;
    for (let price in priceVolumes) {
      if (priceVolumes[price] > maxVolume) {
        maxVolume = priceVolumes[price];
        POC = parseFloat(price); // Определяем POC
      }
    }

    // Шаг 4: Вычисляем VAH и VAL для заданного процента объема (Value Area)
    let cumulativeVolume = 0;
    let VAH = null,
      VAL = null;
    const priceLevels = Object.keys(priceVolumes)
      .map(Number)
      .sort((a, b) => a - b); // Цены отсортированы по возрастанию

    const valueAreaVolume = totalVolume * (valueAreaPercent / 100); // Рассчитываем объем для Value Area (68% по умолчанию)

    for (let price of priceLevels) {
      cumulativeVolume += priceVolumes[price];

      if (cumulativeVolume <= valueAreaVolume) {
        VAL = price;
      }

      if (cumulativeVolume >= valueAreaVolume) {
        VAH = price;
        break;
      }
    }

    // 7. Возвращаем результ
    const firstTwoPeriods = dayData.slice(0, 2);

    const tpoHigh = Math.max(...dayData.map(({ high }) => high));
    const tpoLow = Math.min(...dayData.map(({ low }) => low));

    const tpoOpen = dayData[0]?.open;
    const tpoClose = dayData[dayData.length - 1]?.close;

    const ibHigh = Math.max(...firstTwoPeriods.map(({ high }) => high));
    const ibLow = Math.min(...firstTwoPeriods.map(({ low }) => low));

    const ibSize = (ibHigh - ibLow) * 4;

    return {
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      date,
      poc: POC,
      vah: VAH,
      val: VAL,
      ibHigh,
      ibLow,
      ibSize,
      ibBroken: getIbBroken(tpoHigh, tpoLow, ibHigh, ibLow),
      ibExt: getIbExt(tpoHigh, tpoLow, ibHigh, ibLow),
    };
  });
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

        // opening_type: determineOpenTypeABC(acc, item),
        // type_day: determineDayType(item),
        isTestVA: isTestVA(acc, item),
        isTestPOC: isTestPOC(acc, item),
        isTestRange: isTestRange(acc, item),
        isTestIB: isTestIB(acc, item),
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
  tpr = 5,
) => {
  const priceStep = tpr * 0.25; // Рассчитываем шаг цен

  // Группировка данных по дням
  const groupedData = data.reduce((acc, entry) => {
    const date = entry.time.split("T")[0]; // Извлечение даты
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
  const profileArray = calculateTPOProfile(data, priceStep);

  // Вычисляем Value Area High и Value Area Low
  const { vah, val } = calculateValueArea(profileArray, valueAreaPercent);

  // Получаем POC, используя центр Value Area
  const poc = getPOCWithValueAreaCenter(profileArray, vah, val);

  return { poc, vah, val, profile: profileArray };
};

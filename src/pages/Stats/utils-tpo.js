export const calculateTPOPerDay = (data, valueAreaPercent = 68) => {
  // Группировка данных по дням
  const groupedByDay = data.reduce((acc, { time, open, high, low, close }) => {
    const day = new Date(time).toISOString().split("T")[0]; // Извлекаем дату
    if (!acc[day]) acc[day] = [];
    acc[day].push({ open, high, low, close });
    return acc;
  }, {});

  // Вычисление TPO, POC, VAH, VAL и других метрик для каждого дня
  return Object.entries(groupedByDay).map(([day, dayData]) => {
    // Шаг 1: Генерация частотного распределения
    const tpoCounts = dayData.reduce((acc, { high, low }) => {
      for (let price = Math.floor(low); price <= Math.ceil(high); price++) {
        acc.set(price, (acc.get(price) || 0) + 1);
      }
      return acc;
    }, new Map());

    // Шаг 2: Сортировка по количеству TPO
    const sortedTPO = Array.from(tpoCounts.entries())
      .map(([price, count]) => ({ price: +price, count }))
      .sort((a, b) => b.count - a.count);

    // Шаг 3: Расчет POC
    const poc = sortedTPO[0]?.price;

    // Шаг 4: Расчет зон стоимости
    const totalTPO = Array.from(tpoCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
    const valueAreaThreshold = totalTPO * (valueAreaPercent / 100);

    let valueAreaTPO = 0;
    const valueAreaPrices = [];

    for (const { price, count } of sortedTPO) {
      valueAreaTPO += count;
      valueAreaPrices.push(price);
      if (valueAreaTPO >= valueAreaThreshold) break;
    }

    const vah = Math.max(...valueAreaPrices); // Value Area High
    const val = Math.min(...valueAreaPrices); // Value Area Low

    // Шаг 5: Расчет TPO_High, TPO_Low, TPO_Open, TPO_Close
    const tpoHigh = Math.max(...dayData.map(({ high }) => high));
    const tpoLow = Math.min(...dayData.map(({ low }) => low));
    const tpoOpen = dayData[0]?.open; // Открытие первого интервала
    const tpoClose = dayData[dayData.length - 1]?.close; // Закрытие последнего интервала

    // Шаг 6: Расчет Initial Balance Range (IBR)
    const initialBalanceData = dayData.slice(0, 2); // Предполагаем, что IBR — это первые два интервала
    const ibrHigh = Math.max(...initialBalanceData.map(({ high }) => high));
    const ibrLow = Math.min(...initialBalanceData.map(({ low }) => low));
    const ibSize = ibrHigh - ibrLow;

    return {
      day,
      poc,
      vah,
      val,
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      ibrHigh,
      ibrLow,
      ibSize,
    };
  });
};

export const calculateTPOPerDay2 = (
  data,
  valueAreaPercent = 68,
  tprIntervalMinutes = 30,
) => {
  // Группировка данных по дням
  const groupedByDay = data.reduce((acc, { time, open, high, low, close }) => {
    const day = new Date(time).toISOString().split("T")[0]; // Извлекаем дату
    if (!acc[day]) acc[day] = [];
    acc[day].push({ time, open, high, low, close });
    return acc;
  }, {});

  // Вычисление TPO, POC, VAH, VAL и других метрик для каждого дня
  return Object.entries(groupedByDay).map(([day, dayData]) => {
    // Шаг 1: Генерация частотного распределения
    const tpoCounts = dayData.reduce((acc, { high, low }) => {
      for (let price = Math.floor(low); price <= Math.ceil(high); price++) {
        acc.set(price, (acc.get(price) || 0) + 1);
      }
      return acc;
    }, new Map());

    // Шаг 2: Сортировка по количеству TPO
    const sortedTPO = Array.from(tpoCounts.entries())
      .map(([price, count]) => ({ price: +price, count }))
      .sort((a, b) => b.count - a.count);

    // Шаг 3: Расчет POC (Point of Control)
    const poc = sortedTPO[0]?.price;

    // Шаг 4: Расчет зон стоимости
    const totalTPO = Array.from(tpoCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
    const valueAreaThreshold = totalTPO * (valueAreaPercent / 100);

    let valueAreaTPO = 0;
    const valueAreaPrices = [];

    for (const { price, count } of sortedTPO) {
      valueAreaTPO += count;
      valueAreaPrices.push(price);
      if (valueAreaTPO >= valueAreaThreshold) break;
    }

    const vah = Math.max(...valueAreaPrices); // Value Area High
    const val = Math.min(...valueAreaPrices); // Value Area Low

    // Шаг 5: Расчет TPO_High, TPO_Low, TPO_Open, TPO_Close
    const tpoHigh = Math.max(...dayData.map(({ high }) => high));
    const tpoLow = Math.min(...dayData.map(({ low }) => low));
    const tpoOpen = dayData[0]?.open; // Открытие первого интервала
    const tpoClose = dayData[dayData.length - 1]?.close; // Закрытие последнего интервала

    // Шаг 6: Расчет Initial Balance Range (IBR)
    const firstTwoPeriods = dayData.slice(0, 2); // Берем только первые два периода A и B
    const ibrHigh = Math.max(...firstTwoPeriods.map(({ high }) => high)); // Максимум между A и B
    const ibrLow = Math.min(...firstTwoPeriods.map(({ low }) => low)); // МИНИМУМ между A и B
    const ibSize = ibrHigh - ibrLow;

    // Шаг 7: Расчет TPR (Time Per Row)
    const tpr = Math.ceil(dayData.length / (1440 / tprIntervalMinutes)); // Количество строк на основе временных интервалов

    return {
      day,
      poc,
      vah,
      val,
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      ibrHigh,
      ibrLow,
      ibSize,
      tpr,
    };
  });
};

export const analyzeDayData = (data) => {
  // Группировка данных по дням
  const groupedByDay = data.reduce(
    (
      acc,
      {
        day,
        open,
        high,
        low,
        close,
        tpoOpen,
        tpoHigh,
        tpoLow,
        tpoClose,
        vah,
        val,
        poc,
        ibrHigh,
        ibrLow,
        ibSize,
      },
    ) => {
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        open,
        high,
        low,
        close,
        tpoOpen,
        tpoHigh,
        tpoLow,
        tpoClose,
        vah,
        val,
        poc,
        ibrHigh,
        ibrLow,
        ibSize,
      });
      return acc;
    },
    {},
  );

  // Функция для анализа данных за день
  const calculateDayAnalysis = (dayData) => {
    const {
      tpoHigh,
      tpoLow,
      tpoOpen,
      tpoClose,
      vah,
      val,
      poc,
      ibrHigh,
      ibrLow,
    } = dayData[0]; // Извлекаем данные из первого периода дня

    // 1. Как сломался IB (с 8:00 до 13:30)
    const brokenIB = dayData.some(({ time, high, low }) => {
      const hour = new Date(time).getHours();
      return hour >= 8 && hour <= 13 && (high > ibrHigh || low < ibrLow);
    });

    // 2. Был ли тест POC
    const pocTest = dayData.some(({ high, low }) => high >= poc || low <= poc);

    // 3. Был ли тест зоны VA
    const vaTest = dayData.some(({ high, low }) => high >= vah || low <= val);

    // 4. Где мы открылись относительно предыдущего дня
    const openRelativeToVA = {
      oGreaterThanVA: tpoOpen > vah,
      oLessThanVA: tpoOpen < val,
      oInsideVA: tpoOpen >= val && tpoOpen <= vah,
    };

    // 5. На сколько расширился IB (с 8:00 до 13:30)
    const ibExtension = dayData.some(({ time, high, low }) => {
      const hour = new Date(time).getHours();
      return hour >= 8 && hour <= 13 && (high > ibrHigh || low < ibrLow);
    });

    // 6. Как сломался IB (по всему дню)
    const brokenIBFullDay = dayData.some(
      ({ high, low }) => high > ibrHigh || low < ibrLow,
    );

    // 7. На сколько расширился IB за весь день
    const ibExtensionFullDay = Math.abs(ibrHigh - ibrLow);

    return {
      brokenIB,
      pocTest,
      vaTest,
      openRelativeToVA,
      ibExtension,
      brokenIBFullDay,
      ibExtensionFullDay,
    };
  };

  // Применяем анализ для всех дней
  return Object.entries(groupedByDay).map(([day, dayData]) => {
    return {
      day,
      ...dayData[0],
      ...calculateDayAnalysis(dayData),
    };
  });
};

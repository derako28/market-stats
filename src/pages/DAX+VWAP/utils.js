export const determineTrendByDay = (data, startTime, endTime) => {
  // Группируем данные по дням
  const groupedByDay = data.reduce((acc, candle) => {
    const date = new Date(candle.time).toISOString().split("T")[0]; // Извлекаем только дату
    acc[date] = acc[date] || [];
    acc[date].push(candle);
    return acc;
  }, {});

  // Проверяем тренд для каждой даты
  const trendsByDay = Object.entries(groupedByDay).map(([date, candles]) => {
    // Фильтруем данные по времени
    const filteredCandles = candles.filter((candle) => {
      const candleTime = new Date(candle.time);
      const start = new Date(candle.time);
      const end = new Date(candle.time);

      start.setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0);
      end.setHours(endTime.split(":")[0], endTime.split(":")[1], 0, 0);

      return candleTime >= start && candleTime < end;
    });

    // console.log("#filteredCandles: ", filteredCandles);

    const firstCandle = filteredCandles[0];

    if (!firstCandle) return;

    // Определяем тренды для отфильтрованных свечей
    const trends = filteredCandles.map((candle) => {
      const { open, close, VWAP } = candle;
      if (open > VWAP && close > VWAP) return "uptrend";
      if (open < VWAP && close < VWAP) return "downtrend";
      return "flat";
    });

    // Проверяем, есть ли устойчивый тренд
    const hasConsistentTrend = (trend) => trends.every((t) => t === trend);

    const trend = hasConsistentTrend("uptrend")
      ? "uptrend"
      : hasConsistentTrend("downtrend")
        ? "downtrend"
        : "flat";

    return { date, trend };
  });

  return trendsByDay;
};

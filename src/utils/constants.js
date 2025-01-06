export const FILTER_TYPES = {
  TEXT: "TEXT",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  DATEPICKER_RANGE: "DATEPICKER_RANGE",
  NUMBER: "NUMBER",
  RANGE: "RANGE",
};
export const FIELD_TYPES = {
  CHECKBOX: "CHECKBOX",
};

export const DAY_TYPES = {
  TREND: "TREND",
  NORMAL: "NORMAL",
  NORMAL_OF_VARIATION: "NORMAL_OF_VARIATION",
  NEUTRAL: "NEUTRAL",
};

export const DAY_TYPES_LABEL = {
  TREND: "TREND",
  NORMAL: "NORMAL",
  NORMAL_OF_VARIATION: "NORMAL OF VARIATION",
  NEUTRAL: "NEUTRAL",
};

export const OPENING_TYPES = {
  OD: "OD",
  OTD: "OTD",
  ORR: "ORR",
  OA: "OA",
  OA_OTD: "OA (OTD)",
  OA_ORR: "OA (ORR)",
  OA_OD: "OA (OD)",
};

export const CONTINUATION_TYPES = {
  yes: "YES",
  no: "NO",
};

export const IB_BROKEN = {
  HIGH_BROKEN: "HIGH_BROKEN",
  LOW_BROKEN: "LOW_BROKEN",
};

export const OPENS = {
  IN_VA: "IN_VA",
  ABOVE_VA: "ABOVE_VA",
  LOWER_VA: "LOWER_VA",
  ABOVE_RANGE: "ABOVE_RANGE",
  LOWER_RANGE: "LOWER_RANGE",
};

export const OPENS_LABEL = {
  IN_VA: "In VA",
  ABOVE_VA: "O > VA",
  LOWER_VA: "O < VA",
  ABOVE_RANGE: "O > Range",
  LOWER_RANGE: "O < Range",
};

export const OPENS_OPTIONS = {
  IN_VA: OPENS_LABEL.IN_VA,
  ABOVE_VA: OPENS_LABEL.ABOVE_VA,
  LOWER_VA: OPENS_LABEL.LOWER_VA,
  ABOVE_RANGE: OPENS_LABEL.ABOVE_RANGE,
  LOWER_RANGE: OPENS_LABEL.LOWER_RANGE,
};

export const CLOSES = {
  IN_VA: "IN_VA",
  ABOVE_VA: "ABOVE_VA",
  LOWER_VA: "LOWER_VA",
  ABOVE_RANGE: "ABOVE_RANGE",
  LOWER_RANGE: "LOWER_RANGE",
};

export const CLOSES_LABEL = {
  IN_VA: "In VA",
  ABOVE_VA: "C > VA",
  LOWER_VA: "C < VA",
  ABOVE_RANGE: "C > Range",
  LOWER_RANGE: "C < Range",
};

export const CLOSES_TO_CURRENT_DAY_LABEL = {
  IN_VA: "In VA",
  ABOVE_VA: "C > VA",
  LOWER_VA: "C < VA",
};

export const CLOSES_OPTIONS = {
  IN_VA: CLOSES_LABEL.IN_VA,
  ABOVE_VA: CLOSES_LABEL.ABOVE_VA,
  LOWER_VA: CLOSES_LABEL.LOWER_VA,
  ABOVE_RANGE: CLOSES_LABEL.ABOVE_RANGE,
  LOWER_RANGE: CLOSES_LABEL.LOWER_RANGE,
};

export const CLOSE_LABEL_BY_CURRENT_DAY = {
  IN_VA: "In VA",
  ABOVE_VA: "O > VA",
  LOWER_VA: "O < VA",
};

export const DIRECTION = {
  LONG: "LONG",
  SHORT: "SHORT",
  NEUTRAL: "NEUTRAL",
};

export const DAYS_LABEL = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

export const DAYS_OPTIONS = [
  { value: 1, label: DAYS_LABEL.MONDAY },
  { value: 2, label: DAYS_LABEL.TUESDAY },
  { value: 3, label: DAYS_LABEL.WEDNESDAY },
  { value: 4, label: DAYS_LABEL.THURSDAY },
  { value: 5, label: DAYS_LABEL.FRIDAY },
];

export const IB_BROKEN_OPTIONS = {
  ib_high_broken: "High Broken",
  ib_low_broken: "Low Broken",
};

export const IB_BROKEN_LABELS = {
  is_ib_broken: "IB Broken",
  ib_high_broken: "IB High Broken",
  ib_low_broken: "IB Low Broken",
  ib_one_side_broken: "IB One Side Broken",
  ib_both_broken: "IB Both Side Broken",
  // ib_no_broken: "IB No Broken",
};

export const DIRECTION_OPTIONS = {
  SHORT: "short",
  LONG: "long",
};

export const RESULT_OPTIONS = {
  WIN: "win",
  LOSE: "lose",
};

export const TEST_OPTIONS = {
  YES: "YES",
  NO: "NO",
  OPEN_IN_IB: "OPEN IN IB",
  OPEN_IN_VA: "OPEN IN VA",
  OPEN_IN_RANGE: "OPEN IN Range",
};

export const DATE_RANGE_VALUE = {
  LAST_MONTH: "LAST_MONTH",
  THREE_MONTH: "THREE_MONTH",
  SIX_MONTH: "SIX_MONTH",
  ONE_YEAR: "ONE_YEAR",
  TWO_YEAR: "TWO_YEAR",
  THREE_YEAR: "THREE_YEAR",
  FOUR_YEAR: "FOUR_YEAR",
  FIVE_YEAR: "FIVE_YEAR",
};
export const DATE_RANGE_LABEL = {
  LAST_MONTH: "Last Month",
  THREE_MONTH: "Three Months",
  SIX_MONTH: "Six Month",
  ONE_YEAR: "1 YEAR",
  TWO_YEAR: "2 YEAR",
  THREE_YEAR: "3 YEAR",
  FOUR_YEAR: "4 YEAR",
  FIVE_YEAR: "5 YEAR",
};

export const DATE_RANGE_OPTIONS = [
  { value: DATE_RANGE_VALUE.LAST_MONTH, label: DATE_RANGE_LABEL.LAST_MONTH },
  { value: DATE_RANGE_VALUE.THREE_MONTH, label: DATE_RANGE_LABEL.THREE_MONTH },
  { value: DATE_RANGE_VALUE.SIX_MONTH, label: DATE_RANGE_LABEL.SIX_MONTH },
  { value: DATE_RANGE_VALUE.ONE_YEAR, label: DATE_RANGE_LABEL.ONE_YEAR },
  { value: DATE_RANGE_VALUE.TWO_YEAR, label: DATE_RANGE_LABEL.TWO_YEAR },
  { value: DATE_RANGE_VALUE.THREE_YEAR, label: DATE_RANGE_LABEL.THREE_YEAR },
  { value: DATE_RANGE_VALUE.FOUR_YEAR, label: DATE_RANGE_LABEL.FOUR_YEAR },
  { value: DATE_RANGE_VALUE.FIVE_YEAR, label: DATE_RANGE_LABEL.FIVE_YEAR },
];

export const BREAKOUT_PERIODS_LABEL = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "K:",
  L: "L:",
  M: "M:",
};

// export const CANDLE_TYPES = {
//   BEARISH: "Bearish",
//   BULLISH: "Bullish",
// };

export const CANDLE_TYPES = {
  BEARISH: "Bear",
  BULLISH: "Bull",
};

export const DAY_TRENDS = {
  BULLISH: "Bullish",
  BEARISH: "Bearish",
};

export const TICKERS = {
  ES: "ES",
  NQ: "NQ",
  YM: "YM",
  DAX: "DAX",
};

export const REPORT_TYPES = {
  GREEN_RED_DAYS: "greenRadDays",
  IB_BREAKOUT: "ibBreakout",
  IB_SIZES: "ibSize",
  TABLE: "table",
};

export const REPORT_LABELS = {
  GREEN_RED_DAYS: "Green Red Days",
  IB_BREAKOUT: "IB Breakout",
  IB_SIZES: "IB Sizes",
  TABLE: "Table",
};

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

export const OPENING_TYPES_FILTER = {
  OD: "OD",
  OTD: "OTD",
  ORR: "ORR",
  OA: "OA",
};

export const CONTINUATION_TYPES = {
  yes: "YES",
  no: "NO",
};

export const IB_BREAKOUT = {
  HIGH_BREAKOUT: "HIGH_BREAKOUT",
  LOW_BREAKOUT: "LOW_BREAKOUT",
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

export const OPENS_RELATION_TO_TOC = {
  ABOVE_POC: "Above Poc",
  LOWER_POC: "Lower Poc",
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

export const IB_BREAKOUT_OPTIONS = {
  ib_high_broken: "High Breakout",
  ib_low_broken: "Low Breakout",
};

export const IB_BREAKOUT_SIDES_OPTIONS = {
  ib_one_side_broken: "IB One Side Breakout",
  ib_both_broken: "IB Both Side Breakout",
  ib_no_broken: "IB No Breakout",
};

export const IB_EXTENSION_SIDES_OPTIONS = {
  ib_one_side_broken: "Side Extension",
  ib_both_broken: "Both Side Extension",
  ib_no_broken: "No Extension",
};

export const IB_BREAKOUT_LABELS = {
  is_ib_breakout: "IB Breakout",
  ib_high_broken: "IB Breakout High",
  ib_low_broken: "IB Breakout Low",
  ib_one_side_broken: "IB One Side Breakout",
  ib_both_broken: "IB Both Side Breakout",
  ib_no_broken: "IB No Breakout",
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
  K: "K",
  L: "L",
  M: "M",
};

// export const CANDLE_TYPES = {
//   BEARISH: "Bearish",
//   BULLISH: "Bullish",
// };

export const CANDLE_TYPES = {
  BEARISH: "Bearish",
  BULLISH: "Bullish",
};

export const DAY_TRENDS = {
  BULLISH: "Bullish",
  BEARISH: "Bearish",
};

export const TRENDS = {
  BULLISH: "Bullish",
  BEARISH: "Bearish",
};

export const FIRST_FORMED = {
  LOW: "Low",
  HIGH: "High",
};

export const TICKERS = {
  ES: "ES",
  NQ: "NQ",
  YM: "YM",
  // DAX: "DAX",
};

export const REPORT_TYPES = {
  DAYS_COUNTER: "daysCounter",
  GREEN_RED_DAYS: "greenRadDays",
  IB_BREAKOUT: "ibBreakoutWidget",
  RETEST_IB: "retestIB",
  TOUCH_ZONES: "touchZones",
  TOUCH_VA_ZONES: "touchVAZones",
  IB_SIZES: "ibSize",
  TABLE: "table",
};

export const REPORT_LABELS = {
  DAYS_COUNTER: "Days Counter",
  GREEN_RED_DAYS: "Green Red Days",
  IB_BREAKOUT: "IB Breakout",
  RETEST_IB: "Retest IB",
  TOUCH_ZONES: "Touch Zones",
  TOUCH_VA_ZONES: "Touch VA Zones",
  IB_SIZES: "IB Sizes",
  TABLE: "Table",
};

export const TOUCH_ZONES = {
  TOUCH_VAL: "Touch Val",
  TOUCH_VAH: "Touch Vah",
  TOUCH_VAL_ABOVE_POC: "Touch Val (Open Above Poc)",
  TOUCH_VAL_BELOW_POC: "Touch Vah (Open Above Poc)",
  TOUCH_VAH_ABOVE_POC: "Touch Val (Open Below Poc)",
  TOUCH_VAH_BELOW_POC: "Touch Vah (Open Below Poc)",
};

export const TOUCH_ZONES_KEYS = {
  TOUCH_VAL: "isTouchVAL",
  TOUCH_VAH: "isTouchVAH",
  // TOUCH_VAL_ABOVE_POC: "isTouchVAL",
  // TOUCH_VAL_BELOW_POC: "isTouchVAH",
  // TOUCH_VAH_ABOVE_POC: "isTouchVAL",
  // TOUCH_VAH_BELOW_POC: "isTouchVAH",
};

export const colorsForChart = [
  "rgba(0, 117, 225, 1)",
  "rgba(0, 117, 225, .9)",
  "rgba(0, 117, 225, .8)",
  "rgba(0, 117, 225, .7)",
  "rgba(0, 117, 225, .6)",
  "rgba(0, 117, 225, .5)",
  "rgba(0, 117, 225, .4)",
  "rgba(0, 117, 225, .3)",
  "rgba(0, 117, 225, .2)",
  "rgba(0, 117, 225, .1)",
];

export const CLOSE_B_PERIOD = {
  ABOVE_75: "Above 75%",
  ABOVE_50: "Above 50%",
  BELOW_50: "Below 50%",
  BELOW_25: "Below 25%",
};

export const PERCENTAGE = {
  FIVE: 5,
  TEN: 10,
  FIFTEEN: 15,
  TWENTY: 20,
  TWENTY_FIVE: 25,
  THIRTY: 30,
  THIRTY_FIVE: 35,
  FORTY: 40,
  FORTY_FIVE: 45,
  FIFTY: 50,
  FIFTY_FIVE: 55,
  SIXTY: 60,
  SIXTY_FIVE: 65,
  SEVENTY: 70,
  SEVENTY_FIVE: 75,
  EIGHTY: 80,
  EIGHTY_FIVE: 85,
  NINETY: 90,
  NINETY_FIVE: 95,
  // HUNDRED: 100,
};

export const PERCENTAGE_LABELS = {
  FIVE: "5%",
  TEN: "10%",
  FIFTEEN: "15%",
  TWENTY: "20%",
  TWENTY_FIVE: "25%",
  THIRTY: "30%",
  THIRTY_FIVE: "35%",
  FORTY: "40%",
  FORTY_FIVE: "45%",
  FIFTY: "50%",
  FIFTY_FIVE: "55%",
  SIXTY: "60%",
  SIXTY_FIVE: "65%",
  SEVENTY: "70%",
  SEVENTY_FIVE: "75%",
  EIGHTY: "80%",
  EIGHTY_FIVE: "85%",
  NINETY: "90%",
  NINETY_FIVE: "95%",
  // HUNDRED: "100%",
};

export const PERCENTAGE_OPTIONS = [
  { value: PERCENTAGE.FIVE, label: PERCENTAGE_LABELS.FIVE },
  { value: PERCENTAGE.TEN, label: PERCENTAGE_LABELS.TEN },
  { value: PERCENTAGE.FIFTEEN, label: PERCENTAGE_LABELS.FIFTEEN },
  { value: PERCENTAGE.TWENTY, label: PERCENTAGE_LABELS.TWENTY },
  { value: PERCENTAGE.TWENTY_FIVE, label: PERCENTAGE_LABELS.TWENTY_FIVE },
  { value: PERCENTAGE.THIRTY, label: PERCENTAGE_LABELS.THIRTY },
  { value: PERCENTAGE.THIRTY_FIVE, label: PERCENTAGE_LABELS.THIRTY_FIVE },
  { value: PERCENTAGE.FORTY, label: PERCENTAGE_LABELS.FORTY },
  { value: PERCENTAGE.FORTY_FIVE, label: PERCENTAGE_LABELS.FORTY_FIVE },
  { value: PERCENTAGE.FIFTY, label: PERCENTAGE_LABELS.FIFTY },
  { value: PERCENTAGE.FIFTY_FIVE, label: PERCENTAGE_LABELS.FIFTY_FIVE },
  { value: PERCENTAGE.SIXTY, label: PERCENTAGE_LABELS.SIXTY },
  { value: PERCENTAGE.SIXTY_FIVE, label: PERCENTAGE_LABELS.SIXTY_FIVE },
  { value: PERCENTAGE.SEVENTY, label: PERCENTAGE_LABELS.SEVENTY },
  { value: PERCENTAGE.SEVENTY_FIVE, label: PERCENTAGE_LABELS.SEVENTY_FIVE },
  { value: PERCENTAGE.EIGHTY, label: PERCENTAGE_LABELS.EIGHTY },
  { value: PERCENTAGE.EIGHTY_FIVE, label: PERCENTAGE_LABELS.EIGHTY_FIVE },
  { value: PERCENTAGE.NINETY, label: PERCENTAGE_LABELS.NINETY },
  { value: PERCENTAGE.NINETY_FIVE, label: PERCENTAGE_LABELS.NINETY_FIVE },
  // { value: PERCENTAGE.HUNDRED, label: PERCENTAGE_LABELS.HUNDRED },
];

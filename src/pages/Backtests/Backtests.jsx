import { Page } from "../../components/share/Page/page.jsx";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { useState } from "react";

import dataBacktest from "../../Data-Backetsts/NQ-Overnight.json";

import { AgCharts } from "ag-charts-react";
import {
  getChartConfigForBacktest,
  getWinRateByDay,
  getWinRateByMonth,
  optionsForLineChart,
  prepareData,
  getDayOfWeek,
  getMonth,
  getYear,
  mergedBacktestWithStatistic,
  connectTwoData,
  getBarChartHorizontalConfig,
  getDataIBSizeChart,
  getOptions,
  getChartConfig,
} from "./utils";
import {
  DIRECTION_POSITION,
  FILTER_TYPES,
  MONTH_LABELS,
  OPENING_TYPES,
  OPENS_LABEL,
  OPENS_OPTIONS,
  PERIOD_TYPES,
} from "./constants";
import moment from "moment/moment";
import { Statistic } from "./components/statistic.jsx";
import { FIELD_TYPES } from "./constants";
import {
  compileMarketProfileByDays,
  segmentData,
  setOpeningType,
  prepareData as prepareDataStatistic,
} from "../../utils/prepareData.js";
import data from "../../Data-TW/ES.json";

const columns = [
  { id: "date", title: "Date" },
  { id: "open", title: "Open Relation" },
  { id: "opening_type", title: "Opening Type" },
  { id: "period", title: "Period" },
  { id: "location", title: "Location" },
  { id: "sl_location", title: "SL Location" },
  { id: "ibSize", title: "IB Size" },
  { id: "ib_ext", title: "IB Exp" },
  { id: "result", title: "Result" },
  { id: "1r", title: "1R", type: FIELD_TYPES.CHECKBOX },
  { id: "1.5r", title: "1.5R", type: FIELD_TYPES.CHECKBOX },
  { id: "2r", title: "2R", type: FIELD_TYPES.CHECKBOX },
  // { id: '10p_reason', title: '10R Reason', type: FIELD_TYPES.CHECKBOX },
];

const filterOptions = [
  // { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

  { id: "ibSize", title: "IB Size" },
  { id: "ibSize_from", title: "IB Size From" },
  { id: "ibSize_to", title: "IB Size To" },
  { id: "ibSize_segmented", title: "IB Size Segmented" },

  // { id: 'ibSize_range', title: 'IB Size Range (-+5)' },

  // { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
  // { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
  // { id: 'type_day', title: 'Type Day', filter: false },
  // { id: 'ib_breakout', title: 'IB Breakout', type: FILTER_TYPES.SELECT, options: getOptions(IB_BREAKOUT)  },
  // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION_OPTIONS) },
  // {
  //   id: "result",
  //   title: "Result",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(RESULT_OPTIONS),
  // },
  // { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS }
];

const excludeFilterOptions = [
  // { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

  { id: "ibSize", title: "IB Size" },
  { id: "ibSize_less", title: "IB Size Less" },
  { id: "ibSize_more", title: "IB Size More" },

  {
    id: "Direction",
    title: "Direction",
    type: FILTER_TYPES.SELECT,
    options: getOptions(DIRECTION_POSITION),
  },
  // {
  //   id: "location",
  //   title: "Location",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(LOCATION_TYPES),
  // },
  // {
  //   id: "sl_location",
  //   title: "SL Location",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(SL_OPTIONS),
  // },
  //
  // {
  //   id: "period",
  //   title: "Period",
  //   type: FILTER_TYPES.MULTI_SELECT,
  //   options: getOptions(PERIOD_TYPES),
  // },
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.MULTI_SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  {
    id: "opening_type",
    title: "Opening Type",
    type: FILTER_TYPES.MULTI_SELECT,
    options: getOptions(OPENING_TYPES),
  },
  // {
  //   id: "day",
  //   title: "Day",
  //   type: FILTER_TYPES.MULTI_SELECT,
  //   options: DAYS_OPTIONS,
  // },
  // {
  //   id: "month",
  //   title: "Month",
  //   type: FILTER_TYPES.MULTI_SELECT,
  //   options: getOptions(MONTH_LABELS),
  // },
  // { id: 'year', title: 'Year', type: FILTER_TYPES.SELECT, options: getOptions(YEAR_LABEL) },

  // { id: 'ibSize_segmented', title: 'IB Size Segmented'},
  // { id: 'type_day', title: 'Type Day', filter: false },
  // { id: 'ib_breakout', title: 'IB Breakout', type: FILTER_TYPES.SELECT, options: getOptions(IB_BREAKOUT)  },
  // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION_OPTIONS) },
  // {
  //   id: "result",
  //   title: "Result",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(RESULT_OPTIONS),
  // },

  // { id: 'Month', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
];

const initialData = prepareData(dataBacktest);

const statistics = segmentData(
  setOpeningType(
    prepareDataStatistic(compileMarketProfileByDays(data, 68, 5, 0.25)),
  ).reverse(),
);

const mergedData = mergedBacktestWithStatistic(statistics, initialData).filter(
  ({ ibSize }) => ibSize,
);
// .filter((item) => {
//   return (
//     item.open_relation !== OPENS_OPTIONS.LOWER_RANGE &&
//     item.Direction !== DIRECTION_POSITION.SHORT
//   );
// });

export const Backtests = () => {
  const [tableData, setTableData] = useState(mergedData || []);

  // const dataFilter = (dataFilter) => {
  //   const startDate = moment(dataFilter.date?.startDate);
  //   const endDate = moment(dataFilter.date?.endDate);
  //
  //   const filteredData = mergedData.filter((item) => {
  //     return Object.keys(dataFilter).every((key) => {
  //       if (dataFilter[key] === "" || dataFilter[key] === undefined)
  //         return true;
  //
  //       if (key === "day") {
  //         return getDayOfWeek(item.date) === dataFilter.day;
  //       }
  //
  //       if (key === "date") {
  //         const currentDate = moment(item.date);
  //
  //         return moment(currentDate).isBetween(startDate, endDate);
  //       }
  //
  //       if (key === "ibSize") {
  //         return +item[key] === +dataFilter[key];
  //       }
  //
  //       if (key === "ibSize_from") {
  //         return +dataFilter.ibSize_from <= +item.ibSize;
  //       }
  //
  //       if (key === "ibSize_to") {
  //         return +dataFilter.ibSize_to >= +item.ibSize;
  //       }
  //
  //       return item[key]
  //         ?.toString()
  //         ?.toLowerCase()
  //         ?.includes(dataFilter[key].toString()?.toLowerCase());
  //     });
  //   });
  //
  //   setTableData(filteredData);
  // };

  const dataExcludeFilter = (dataFilter) => {
    const startDate = moment(dataFilter.date?.startDate);
    const endDate = moment(dataFilter.date?.endDate);

    const filteredData = mergedData.filter((item) => {
      return Object.keys(dataFilter).every((key) => {
        if (dataFilter[key] === "" || dataFilter[key] === undefined)
          return true;

        // if(key === 'day') {
        //     return getDayOfWeek(item.date) !== dataFilter.day
        // }

        if (key === "date") {
          const currentDate = moment(item.date);

          return moment(currentDate).isBetween(startDate, endDate);
        }

        if (key === "ibSize") {
          return !dataFilter[key].split(", ").includes(item[key]?.toString());
        }

        if (key === "ibSize_less") {
          return +dataFilter.ibSize_less <= +item.ibSize;
        }

        if (key === "ibSize_more") {
          return +dataFilter.ibSize_more >= +item.ibSize;
        }

        if (key === "ibSize_segmented") {
          return !dataFilter[key].split(", ").includes(item[key]?.toString());
        }

        if (key === "day") {
          return !dataFilter[key]
            ?.map((item) => item.value?.toString())
            .includes(getDayOfWeek(item.date)?.toString());
        }

        if (key === "month") {
          return !dataFilter[key]
            ?.map((item) => item.value?.toString())
            .includes(MONTH_LABELS[getMonth(item.date)]);
        }

        if (key === "year") {
          return dataFilter[key]?.toString() !== getYear(item.date)?.toString();
        }

        if (
          key === "period" ||
          key === "open_relation" ||
          key === "opening_type"
        ) {
          return !dataFilter[key]
            ?.map((item) => item.value?.toString())
            .includes(item[key]?.toString());
        }

        return !dataFilter[key]?.split(", ").includes(item[key]?.toString());

        // return !item[key]?.toString()?.toLowerCase()?.includes(dataFilter[key].toString()?.toLowerCase());
      });
    });

    setTableData(filteredData);
  };

  return (
    <Page>
      <div>
        <Filter
          options={excludeFilterOptions}
          initialData={mergedData}
          onChange={dataExcludeFilter}
          handler={false}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-10 mb-20 px-20"}>
        <div className={"flex flex-col items-center"}>
          <AgCharts
            options={optionsForLineChart(
              connectTwoData(mergedData, tableData),
              1500,
              500,
            )}
          />

          <div className={"text-white flex flex-col gap-2"}>
            <Statistic data={mergedData} />
            <Statistic data={tableData} />
          </div>
        </div>
      </div>

      <div className={"flex justify-center gap-16 mb-20"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Direction</div>
          <AgCharts
            options={getChartConfig(
              tableData,
              "Direction",
              DIRECTION_POSITION,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Direction (Win)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "win"),
              "Direction",
              DIRECTION_POSITION,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Direction (Lose)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "lose"),
              "Direction",
              DIRECTION_POSITION,
              500,
              500,
            )}
          />
        </div>
      </div>

      <div className={"flex justify-center gap-16 mb-20"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Open relation</div>
          <AgCharts
            options={getChartConfig(
              tableData,
              "open_relation",
              OPENS_LABEL,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Open relation (Win)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "win"),
              "open_relation",
              OPENS_LABEL,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Open relation (Lose)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "lose"),
              "open_relation",
              OPENS_LABEL,
              500,
              500,
            )}
          />
        </div>
      </div>

      <div className={"flex justify-center gap-16 mb-20"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Opening Type</div>
          <AgCharts
            options={getChartConfig(
              tableData,
              "opening_type",
              OPENING_TYPES,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Opening Type Win</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "win"),
              "opening_type",
              OPENING_TYPES,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Opening Type Lose</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "lose"),
              "opening_type",
              OPENING_TYPES,
              500,
              500,
            )}
          />
        </div>
      </div>

      {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Location</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData, 'location', LOCATION_TYPES,  500, 500)} />*/}
      {/*    </div>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Location (Win)</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'win')), 'location', LOCATION_TYPES,  500, 500) } />*/}
      {/*    </div>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Location (Lose)</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'lose')), 'location', LOCATION_TYPES,  500, 500)} />*/}
      {/*    </div>*/}
      {/*</div>*/}

      <div className={"flex justify-center gap-16 mb-20"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Period</div>
          <AgCharts
            options={getChartConfig(
              tableData,
              "period",
              PERIOD_TYPES,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Period (Win)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "win"),
              "period",
              PERIOD_TYPES,
              500,
              500,
            )}
          />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300 mb-10"}>Period (Lose)</div>
          <AgCharts
            options={getChartConfig(
              tableData.filter((item) => item.result === "lose"),
              "period",
              PERIOD_TYPES,
              500,
              500,
            )}
          />
        </div>
      </div>

      {/*<div className={"flex justify-center gap-16 mb-20"}>*/}
      {/*  <div className={"flex flex-col justify-center items-center"}>*/}
      {/*    <div className={"text-gray-300 mb-10"}>SL Location</div>*/}
      {/*    <AgCharts*/}
      {/*      options={getChartConfig(*/}
      {/*        tableData,*/}
      {/*        "sl_location",*/}
      {/*        SL_OPTIONS,*/}
      {/*        500,*/}
      {/*        500,*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <div className={"flex flex-col justify-center items-center"}>*/}
      {/*    <div className={"text-gray-300 mb-10"}>SL Location (Win)</div>*/}
      {/*    <AgCharts*/}
      {/*      options={getChartConfig(*/}
      {/*        tableData.filter((item) => item.result === "win"),*/}
      {/*        "sl_location",*/}
      {/*        SL_OPTIONS,*/}
      {/*        500,*/}
      {/*        500,*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <div className={"flex flex-col justify-center items-center"}>*/}
      {/*    <div className={"text-gray-300 mb-10"}>SL Location (Lose)</div>*/}
      {/*    <AgCharts*/}
      {/*      options={getChartConfig(*/}
      {/*        tableData.filter((item) => item.result === "lose"),*/}
      {/*        "sl_location",*/}
      {/*        SL_OPTIONS,*/}
      {/*        500,*/}
      {/*        500,*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Day Type</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  500, 500)} />*/}
      {/*    </div>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Day Type Win</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'win')), 'type_day', DAY_TYPES_LABEL,  500, 500) } />*/}
      {/*    </div>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300 mb-10'}>Day Type Lose</div>*/}
      {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'lose')), 'type_day', DAY_TYPES_LABEL,  500, 500)} />*/}
      {/*    </div>*/}
      {/*</div>*/}

      <div className={"flex justify-center gap-16 mt-10 mb-20 px-20"}>
        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Day</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData,
              getWinRateByDay,
              null,
              500,
              500,
            )}
          />
        </div>

        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Day (Win)</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData.filter((item) => item.result === "win"),
              getWinRateByDay,
              null,
              500,
              500,
            )}
          />
        </div>

        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Day (Lose)</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData.filter((item) => item.result === "lose"),
              getWinRateByDay,
              null,
              500,
              500,
            )}
          />
        </div>
      </div>

      <div className={"flex justify-center gap-16 mt-10 mb-20 px-20"}>
        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Month</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData,
              getWinRateByMonth,
              null,
              500,
              700,
            )}
          />
        </div>

        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Month Win</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData.filter((item) => item.result === "win"),
              getWinRateByMonth,
              null,
              500,
              700,
            )}
          />
        </div>

        <div className={"flex flex-col items-center"}>
          <div className={"text-gray-300 mb-5"}>Positions by Month Lose</div>
          <AgCharts
            options={getChartConfigForBacktest(
              tableData.filter((item) => item.result === "lose"),
              getWinRateByMonth,
              null,
              500,
              700,
            )}
          />
        </div>
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-10"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300"}>IB Size </div>
          <AgCharts
            options={getBarChartHorizontalConfig(
              getDataIBSizeChart(tableData, "ib_size_segmented"),
              1700,
              1400,
            )}
          />
        </div>
      </div>

      {/*<div className={'flex justify-center gap-16 mt-20 mb-10'}>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300'}>IB Size Segmented</div>*/}
      {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ibSize_segmented'), 1700, 300)} />*/}
      {/*    </div>*/}
      {/*</div>*/}

      <div className={"flex justify-center gap-5 mt-20 mb-20"}>
        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300"}>IB Size (Win)</div>
          <AgCharts
            options={getBarChartHorizontalConfig(
              getDataIBSizeChart(
                tableData.filter((item) => item.result === "win"),
                "ib_size_segmented",
              ),
              850,
              700,
            )}
          />
        </div>

        <div className={"flex flex-col justify-center items-center"}>
          <div className={"text-gray-300"}>IB Size (Lose)</div>
          <AgCharts
            options={getBarChartHorizontalConfig(
              getDataIBSizeChart(
                tableData.filter((item) => item.result === "lose"),
                "ib_size_segmented",
              ),
              850,
              700,
            )}
          />
        </div>
      </div>

      {/*<div className={'flex justify-center gap-5 mt-20 mb-20'}>*/}
      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300'}>IB Size Win Positions</div>*/}
      {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'win')), 'ibSize_segmented'), 850, 300)} />*/}
      {/*    </div>*/}

      {/*    <div className={'flex flex-col justify-center items-center'}>*/}
      {/*        <div className={'text-gray-300'}>IB Size Lose Positions</div>*/}
      {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'lose')), 'ibSize_segmented'), 850, 300)} />*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<ReportTable*/}
      {/*  columns={columns}*/}
      {/*  data={tableData}*/}
      {/*  filterData={tableData}*/}
      {/*  onClickRow={() => {}}*/}
      {/*/>*/}
    </Page>
  );
};

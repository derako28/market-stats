import data from "../../Data-TW/NQ.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  BREAKOUT_PERIODS_LABEL,
  CLOSES_LABEL,
  CLOSES_TO_CURRENT_DAY_LABEL,
  DATE_RANGE_OPTIONS,
  DATE_RANGE_VALUE,
  DAYS_OPTIONS,
  FILTER_TYPES,
  IB_BROKEN_LABELS,
  IB_BROKEN_OPTIONS,
  OPENS_LABEL,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "../Stats/constants.js";
import { useState } from "react";
import {
  compileMarketProfileByDays,
  prepareData,
  segmentData,
} from "../../utils/prepareData.js";
import { AgCharts } from "ag-charts-react";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartHorizontalConfig,
  getChartConfig,
  getChartConfigForBreakoutPeriods,
  getDataChart,
  getDataIBChart,
  getDataIBSizeChart,
  getDataIExtensionChart,
  getOptions,
} from "../Stats/utils.js";
import moment from "moment";
import { Filter } from "../../components/filter.jsx";
import { Table } from "../../components/table.jsx";
import { Statistic } from "./Statistic/Statistic.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";

const filterOptions = [
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "ibBrokenByLondon",
    title: "IB Broken",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BROKEN_OPTIONS),
  },
  { id: "day", title: "Day", type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
  {
    id: "date_range",
    title: "Date Range",
    type: FILTER_TYPES.SELECT,
    options: DATE_RANGE_OPTIONS,
  },
];

const columns = [
  { id: "date", title: "Date" },
  // { id: "open_relation", title: "Open Relation" },
  { id: "opening_type", title: "Opening Type" },
  { id: "tpoOpen", title: "tpoOpen" },
  { id: "tpoClose", title: "tpoClose" },
  { id: "tpoHigh", title: "tpoHigh" },
  { id: "tpoLow", title: "tpoLow" },

  // { id: "ibSize", title: "IB Size" },
  // { id: "ibHigh", title: "IB High" },
  // { id: "ibLow", title: "IB Low" },

  // { id: "ibBroken", title: "IB Broken" },

  // { id: "ibExt", subId: "highExt", title: "IB Ext High" },
  // { id: "ibExt", subId: "lowExt", title: "IB Ext Low" },

  { id: "poc", title: "poc" },
  { id: "vah", title: "vah" },
  { id: "val", title: "val" },
];

// const initialData = segmentData(
//   filterLeastFrequentByIbSize(
//     prepareData(calculateMarketProfileByDay(data)),
//   ).reverse(),
// );

// const initialData = calculateMarketProfileByDay(data);
// const initialDat2 = calculateOHLCProfile(data).reverse();

const initialData = segmentData(
  prepareData(compileMarketProfileByDays(data, 68, 5, 4)),
);

console.log("#initialData: ", initialData);

// console.log("#initialData: ", initialData);
// console.log(JSON.stringify(initialData));

// console.log("#forecastNextDay: ", forecastNextDay(initialData, "O > VA"));

export const NQ = () => {
  const [tableData, setTableData] = useState(initialData);
  const [modalData, setModalData] = useState();

  const visibleTable = false;
  const visibleCharts = true;
  const filterVisible = true;

  console.log(
    tableData.filter((item) => {
      return item?.breakoutPeriods?.oppositeBreakout.period;
    }),
  );

  const dataFilter = (dataFilter) => {
    const startDate = moment(dataFilter.date?.startDate);
    const endDate = moment(dataFilter.date?.endDate);

    const filteredData = initialData.filter((item) => {
      return Object.keys(dataFilter).every((key) => {
        if (dataFilter[key] === "" || dataFilter[key] === undefined)
          return true;

        if (key === "day") {
          return moment(item.date).day() === +dataFilter.day;
        }

        if (key === "date") {
          const currentDate = moment(item.date);

          return moment(currentDate).isBetween(startDate, endDate);
        }

        if (key === "ibSize") {
          return +item[key] === +dataFilter[key];
        }

        if (key === "ib_size_from") {
          return +dataFilter.ib_size_from <= +item.ibSize;
        }

        if (key === "ib_size_to") {
          return +dataFilter.ib_size_to >= +item.ibSize;
        }

        if (key === "date_range") {
          const dateEl = moment(item.date);
          const now = moment();

          if (dataFilter[key] === DATE_RANGE_VALUE.LAST_MONTH) {
            const startDate = now.clone().subtract(1, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.THREE_MONTH) {
            const startDate = now.clone().subtract(3, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.SIX_MONTH) {
            const startDate = now.clone().subtract(6, "month");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.ONE_YEAR) {
            const startDate = now.clone().subtract(1, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.TWO_YEAR) {
            const startDate = now.clone().subtract(2, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.THREE_YEAR) {
            const startDate = now.clone().subtract(3, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.FOUR_YEAR) {
            const startDate = now.clone().subtract(4, "year");

            return dateEl.isBetween(startDate, now, "day");
          }

          if (dataFilter[key] === DATE_RANGE_VALUE.FIVE_YEAR) {
            const startDate = now.clone().subtract(5, "year");

            return dateEl.isBetween(startDate, now, "day");
          }
        }

        return item[key]
          ?.toString()
          .toLowerCase()
          ?.includes(dataFilter[key].toString().toLowerCase());
      });
    });

    setTableData(filteredData);
  };

  return (
    <Page>
      <Modal onClose={() => setModalData(null)} onShow={!!modalData}>
        <div className={"mt-5 text-gray-200"}>
          {/*<MarketProfileChart data={modalData} />*/}
        </div>
      </Modal>

      <Statistic data={tableData} />

      {/*<MarketProfileChartList data={data} />*/}
      {filterVisible && (
        <Filter options={filterOptions} onChange={dataFilter} />
      )}
      {/*Count days: {tableData.length}*/}
      {visibleCharts && (
        <>
          <div className={"flex justify-center gap-4 mt-20 mb-20"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>Open Relation</div>
              <AgCharts
                options={getChartConfig(
                  tableData,
                  "open_relation",
                  OPENS_LABEL,
                  600,
                  600,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>Close Relation</div>
              <AgCharts
                options={getChartConfig(
                  tableData,
                  "close_relation_prev",
                  CLOSES_LABEL,
                  550,
                  600,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>
                Close Relation To Current Day
              </div>
              <AgCharts
                options={getChartConfig(
                  tableData,
                  "close_relation",
                  CLOSES_TO_CURRENT_DAY_LABEL,
                  600,
                  600,
                )}
              />
            </div>
          </div>

          {/*Touch ZONE*/}

          <div className={"flex justify-center gap-4 mb-20"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch IB</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(tableData, "isTestIB", TEST_OPTIONS),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch POC</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(tableData, "isTestPOC", TEST_OPTIONS),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch VA</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(tableData, "isTestVA", TEST_OPTIONS),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch Range</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(tableData, "isTestRange", TEST_OPTIONS),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>
          </div>

          <div className={"flex justify-center gap-4 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch VAL (Open Under POC)</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(
                    tableData.filter(
                      (item) => item.open_relation_to_poc === "underPoc",
                    ),
                    "isTestVAL",
                    TEST_OPTIONS,
                  ),
                  tableData.filter(
                    (item) => item.open_relation_to_poc === "underPoc",
                  ).length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch VAL (Open Over POC)</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(
                    tableData.filter(
                      (item) => item.open_relation_to_poc === "overPoc",
                    ),
                    "isTestVAL",
                    TEST_OPTIONS,
                  ),
                  tableData.filter(
                    (item) => item.open_relation_to_poc === "overPoc",
                  ).length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch VAH (Open Under Poc)</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(
                    tableData.filter(
                      (item) => item.open_relation_to_poc === "underPoc",
                    ),
                    "isTestVAH",
                    TEST_OPTIONS,
                  ),
                  tableData.filter(
                    (item) => item.open_relation_to_poc === "underPoc",
                  ).length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Touch VAH (Open Over Poc)</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChart(
                    tableData.filter(
                      (item) => item.open_relation_to_poc === "overPoc",
                    ),
                    "isTestVAH",
                    TEST_OPTIONS,
                  ),
                  tableData.filter(
                    (item) => item.open_relation_to_poc === "overPoc",
                  ).length,
                  400,
                  500,
                )}
              />
            </div>
          </div>

          {/*Touch ZONE END*/}

          <div className={"flex justify-center gap-16 mt-20 mb-20"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>First Breakout Periods</div>
              <AgCharts
                options={getChartConfigForBreakoutPeriods(
                  tableData,
                  "firstBreakout",
                  BREAKOUT_PERIODS_LABEL,
                  600,
                  600,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>
                Opposite Breakout Periods
              </div>
              <AgCharts
                options={getChartConfigForBreakoutPeriods(
                  tableData.filter(
                    (item) => item?.breakoutPeriods?.oppositeBreakout.period,
                  ),
                  "oppositeBreakout",
                  BREAKOUT_PERIODS_LABEL,
                  600,
                  600,
                )}
              />
            </div>
          </div>

          <div className={"flex justify-center gap-16 mt-10 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Broken</div>
              <AgCharts
                options={getBarChartConfig(
                  getDataIBChart(
                    dataWithIbInfo(tableData, "ibBroken"),
                    IB_BROKEN_LABELS,
                  ),
                  tableData.length,
                  700,
                  300,
                )}
              />
            </div>
          </div>
          {/*IB Ext Bar Type*/}
          <div className={"flex justify-center gap-4 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB High Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExt", "highExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Low Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExt", "lowExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Max Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExt", "maxExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
          </div>
          {/*IB Ext Bar Type End*/}
          <div className={"flex justify-center gap-16 mt-20 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Size</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIBSizeChart(tableData, "ibSize"),
                  tableData.length,
                  1700,
                  300,
                )}
              />
            </div>
          </div>
          <div className={"flex justify-center gap-16 mt-20 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Size Segmented</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIBSizeChart(tableData, "ib_size_segmented"),
                  tableData.length,
                  1700,
                  300,
                )}
              />
            </div>
          </div>
        </>
      )}
      {visibleTable && (
        <Table
          columns={columns}
          data={tableData}
          onClickRow={(item) => {
            setModalData(item);
          }}
        />
      )}
    </Page>
  );
};

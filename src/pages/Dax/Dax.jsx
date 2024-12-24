import data from "../../Data-TW/FDAX.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
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
} from "../../utils/constants.js";
import { useState } from "react";
import {
  calculateMarketProfileByDay,
  filterLeastFrequentByIbSize,
  prepareData,
  segmentData,
} from "./utils.js";
import { AgCharts } from "ag-charts-react";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartHorizontalConfig,
  getChartConfig,
  getDataChart,
  getDataIBChart,
  getDataIBSizeChart,
  getDataIExtensionChart,
  getOptions,
} from "../Stats/utils.js";
import moment from "moment";
import { Filter } from "../../components/filter.jsx";
import { Table } from "../../components/table.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { Switch } from "../../components/share/Switch/switch.jsx";

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
  { id: "open_relation", title: "Open Relation" },
  // { id: "tpoOpen", title: "tpoOpen" },
  // { id: "tpoClose", title: "tpoClose" },
  // { id: "tpoHigh", title: "tpoHigh" },
  // { id: "tpoLow", title: "tpoLow" },

  { id: "ibSize", title: "IB Size" },
  { id: "ibHigh", title: "IB High" },
  { id: "ibLow", title: "IB Low" },

  { id: "ibBrokenByLondon", title: "IB Broken by London" },
  { id: "ibBrokenByAllDay", title: "IB Broken by All Day" },
  // { id: "ibBrokenNY", title: "IB Broken by Ny" },

  { id: "ibExtByLondon", subId: "highExt", title: "IB Ext High" },
  { id: "ibExtByLondon", subId: "lowExt", title: "IB Ext Low" },

  // { id: "ibExtByNY", subId: "highExt", title: "IB Ext High By NY" },
  // { id: "ibExtByNY", subId: "lowExt", title: "IB Ext Low By NY" },

  { id: "ibExtByAllDay", subId: "highExt", title: "IB Ext High By All Day" },
  { id: "ibExtByAllDay", subId: "lowExt", title: "IB Ext Low By All Day" },

  { id: "poc", title: "poc" },
  { id: "vah", title: "vah" },
  { id: "val", title: "val" },
];

const initialData = segmentData(
  filterLeastFrequentByIbSize(
    prepareData(calculateMarketProfileByDay(data)),
  ).reverse(),
);

export const Dax = () => {
  const [tableData, setTableData] = useState(initialData);

  const [visibleConfig, setVisibleConfig] = useState({
    charts: true,
    filter: true,
    table: false,
  });

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
    <Page noHeader={false}>
      <Statistic data={tableData} />

      <div className={"m-4"}>
        <Switch
          labelOn={"Charts"}
          labelOff={"Table"}
          onClick={(value) => {
            setVisibleConfig({
              ...visibleConfig,
              charts: value,
              table: !value,
            });
          }}
        />
      </div>

      {visibleConfig.filter && (
        <Filter options={filterOptions} onChange={dataFilter} />
      )}
      {visibleConfig.charts && (
        <>
          <div className={"flex justify-center gap-16 mt-20 mb-20"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300 mb-4"}>Open Relation</div>
              <AgCharts
                options={getChartConfig(
                  tableData,
                  "open_relation",
                  OPENS_LABEL,
                  500,
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
                  450,
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
                  500,
                  600,
                )}
              />
            </div>
          </div>

          {/*Touch ZONE*/}

          <div className={"flex justify-center gap-2 mb-10"}>
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

          {/*Touch ZONE END*/}

          <div className={"flex justify-center gap-16 mt-10 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Broken by London</div>
              <AgCharts
                options={getBarChartConfig(
                  getDataIBChart(
                    dataWithIbInfo(tableData, "ibBrokenByLondon"),
                    IB_BROKEN_LABELS,
                  ),
                  tableData.length,
                  700,
                  300,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Broken by All Day</div>
              <AgCharts
                options={getBarChartConfig(
                  getDataIBChart(
                    dataWithIbInfo(tableData, "ibBrokenByAllDay"),
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
                  getDataIExtensionChart(tableData, "ibExtByLondon", "highExt"),
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
                  getDataIExtensionChart(tableData, "ibExtByLondon", "lowExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
          </div>
          <div className={"mb-20"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Max Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExtByLondon", "maxExt"),
                  tableData.length,
                  1400,
                  500,
                )}
              />
            </div>
          </div>
          <div className={"flex justify-center gap-4 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB High Ext By All Day</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExtByAllDay", "highExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Low Ext By All Day</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExtByAllDay", "lowExt"),
                  tableData.length,
                  700,
                  500,
                )}
              />
            </div>
          </div>
          <div>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Max Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExtByAllDay", "maxExt"),
                  tableData.length,
                  1400,
                  500,
                )}
              />
            </div>
          </div>
          {/*IB Ext Bar Type End*/}
          {/*<div className={"flex justify-center gap-16 mt-20 mb-10"}>*/}
          {/*  <div className={"flex flex-col justify-center items-center"}>*/}
          {/*    <div className={"text-gray-300"}>IB Size</div>*/}
          {/*    <AgCharts*/}
          {/*      options={getBarChartHorizontalConfig(*/}
          {/*        getDataIBSizeChart(tableData, "ibSize"),*/}
          {/*        tableData.length,*/}
          {/*        1700,*/}
          {/*        300,*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className={"flex justify-center gap-16 mt-20 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Size Segmented</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIBSizeChart(tableData, "ib_size_segmented"),
                  tableData.length,
                  1400,
                  300,
                )}
              />
            </div>
          </div>
        </>
      )}
      {visibleConfig.table && <Table columns={columns} data={tableData} />}
    </Page>
  );
};

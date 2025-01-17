import data from "../../Data-TW/FDAX-Weekly.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  FIRST_FORMED,
  IB_BREAKOUT_LABELS,
  IB_BREAKOUT_OPTIONS,
  OPENS_OPTIONS,
  OPENS_RELATION_TO_TOC,
  TEST_OPTIONS,
} from "../../utils/constants.js";
import { useState } from "react";
import {
  calculateMarketProfileByDay,
  filterLeastFrequentByIbSize,
  prepareData,
  prepareWeaklyData,
  segmentData,
} from "./utils.js";
import { AgCharts } from "ag-charts-react";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartHorizontalConfig,
  getDataChart,
  getDataIBChart,
  getDataIBSizeChart,
  getDataIExtensionChart,
  getOptions,
} from "../Stats/utils.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Table } from "../../components/share/Table/table.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { Switch } from "../../components/share/Switch/switch.jsx";
import { ChartBar } from "../../components/share/Chart/chart-bar.jsx";

const filterOptions = [
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  {
    id: "open_relation_to_poc",
    title: "Open Relation To Poc",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_RELATION_TO_TOC),
  },
  {
    id: "firstSideFormed",
    title: "First Side Formed",
    type: FILTER_TYPES.SELECT,
    options: getOptions(FIRST_FORMED),
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "ibBreakoutByLondon",
    title: "IB Breakout",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BREAKOUT_OPTIONS),
  },
  {
    id: "day",
    title: "Weekday",
    type: FILTER_TYPES.SELECT,
    options: DAYS_OPTIONS,
  },
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
  // { id: "tpoOpen", title: "tpoOpen" },npm
  // { id: "tpoClose", title: "tpoClose" },
  // { id: "tpoHigh", title: "tpoHigh" },
  // { id: "tpoLow", title: "tpoLow" },

  { id: "firstSideFormed", title: "First Side Formed" },
  { id: "ibSize", title: "IB Size" },
  { id: "ibHigh", title: "IB High" },
  { id: "ibLow", title: "IB Low" },

  { id: "ibBreakoutByLondon", title: "IB Breakout by London" },
  { id: "ibBreakoutByAllDay", title: "IB Breakout by All Day" },
  // { id: "ibBreakoutNY", title: "IB Breakout by Ny" },

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

const initialData = prepareWeaklyData(data);

export const DaxWeekly = () => {
  const [tableData, setTableData] = useState(initialData);

  const [visibleConfig, setVisibleConfig] = useState({
    charts: true,
    filter: true,
    table: false,
  });

  const onFilterData = (data) => setTableData(data);

  return (
    <Page noHeader={false}>
      {/*<Statistic data={tableData} />*/}

      {/*{visibleConfig.filter && (*/}
      {/*  <Filter*/}
      {/*    options={filterOptions}*/}
      {/*    initialData={initialData}*/}
      {/*    onChange={onFilterData}*/}
      {/*  />*/}
      {/*)}*/}

      {visibleConfig.charts && (
        <>
          <div className={"flex justify-center gap-16 mt-20 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>Size Weakly Range</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIBSizeChart(tableData, "weekly_size"),
                  tableData.length,
                  1700,
                  300,
                )}
              />

              <div>Weeks: {tableData.length}</div>
            </div>
          </div>
        </>
      )}
      {/*{visibleConfig.table && <Table columns={columns} data={tableData} />}*/}
    </Page>
  );
};

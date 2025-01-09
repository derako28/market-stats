import data from "../../Data-TW/FDAX.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  CANDLE_TYPES,
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

const initialData = segmentData(
  filterLeastFrequentByIbSize(
    prepareData(calculateMarketProfileByDay(data)),
    0.2,
  ).reverse(),
);

export const Dax = () => {
  const [tableData, setTableData] = useState(initialData);

  const [visibleConfig, setVisibleConfig] = useState({
    charts: true,
    filter: true,
    table: false,
  });

  const onFilterData = (data) => setTableData(data);

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
        <Filter
          options={filterOptions}
          initialData={initialData}
          onChange={onFilterData}
        />
      )}

      {visibleConfig.charts && (
        <>
          {/*<div className={"flex justify-center gap-16 mt-20 mb-20"}>*/}
          {/*  <div className={"flex flex-col justify-center items-center"}>*/}
          {/*    <div className={"text-gray-300 mb-4"}>Open Relation</div>*/}
          {/*    <AgCharts*/}
          {/*      options={getChartConfig(*/}
          {/*        tableData,*/}
          {/*        "open_relation",*/}
          {/*        OPENS_LABEL,*/}
          {/*        500,*/}
          {/*        600,*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}

          {/*  <div className={"flex flex-col justify-center items-center"}>*/}
          {/*    <div className={"text-gray-300 mb-4"}>Close Relation</div>*/}
          {/*    <AgCharts*/}
          {/*      options={getChartConfig(*/}
          {/*        tableData,*/}
          {/*        "close_relation_prev",*/}
          {/*        CLOSES_LABEL,*/}
          {/*        450,*/}
          {/*        600,*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}

          {/*  <div className={"flex flex-col justify-center items-center"}>*/}
          {/*    <div className={"text-gray-300 mb-4"}>*/}
          {/*      Close Relation To Current Day*/}
          {/*    </div>*/}
          {/*    <AgCharts*/}
          {/*      options={getChartConfig(*/}
          {/*        tableData,*/}
          {/*        "close_relation",*/}
          {/*        CLOSES_TO_CURRENT_DAY_LABEL,*/}
          {/*        500,*/}
          {/*        600,*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className={"flex justify-center gap-16 mt-10 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Breakout by London</div>
              <AgCharts
                options={getBarChartConfig(
                  getDataIBChart(
                    dataWithIbInfo(tableData, "ibBreakoutByLondon"),
                    IB_BREAKOUT_LABELS,
                  ),
                  tableData.length,
                  700,
                  300,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Breakout by All Day</div>
              <AgCharts
                options={getBarChartConfig(
                  getDataIBChart(
                    dataWithIbInfo(tableData, "ibBreakoutByAllDay"),
                    IB_BREAKOUT_LABELS,
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
          {/*    <div>Average IB SIze: {calculateAverageIBSize(tableData)}</div>*/}
          {/*  </div>*/}
          {/*</div>*/}

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
        </>
      )}
      {visibleConfig.table && <Table columns={columns} data={tableData} />}
    </Page>
  );
};

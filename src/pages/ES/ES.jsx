import data from "../../Data-TW/ES.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  BREAKOUT_PERIODS_LABEL,
  CLOSES_LABEL,
  CLOSES_TO_CURRENT_DAY_LABEL,
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  IB_BROKEN_LABELS,
  IB_BROKEN_OPTIONS,
  OPENING_TYPES,
  OPENS_LABEL,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "../../utils/constants.js";
import { useState } from "react";
import {
  calculateTrendStatistics,
  compileMarketProfileByDays,
  getDataChartByFirstCandle,
  prepareData,
  segmentData,
  setOpeningType,
} from "../../utils/prepareData.js";
import { AgCharts } from "ag-charts-react";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartHorizontalConfig,
  getChartConfigForBreakoutPeriods,
  getDataIBChart,
  getDataIBSizeChart,
  getDataIExtensionChart,
  getOptions,
} from "../Stats/utils.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Table } from "../../components/share/Table/table.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { MarketProfileChart } from "../../components/share/MarketProfile/MarketProfile.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { Switch } from "../../components/share/Switch/switch.jsx";
import { ChartDonut } from "../../components/share/Chart/chart-donut.jsx";
import { ChartBar } from "../../components/share/Chart/chart-bar.jsx";

const filterOptions = [
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "ibBroken",
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
  { id: "opening_type", title: "Opening Type" },
  { id: "tpoOpen", title: "tpoOpen" },

  { id: "vah", title: "vah" },
  { id: "val", title: "val" },
  { id: "poc", title: "poc" },

  { id: "tpoClose", title: "tpoClose" },
  { id: "tpoHigh", title: "tpoHigh" },
  { id: "tpoLow", title: "tpoLow" },

  { id: "aHigh", title: "aHigh" },
  { id: "aLow", title: "aLow" },

  // { id: "ibSize", title: "IB Size" },
  // { id: "ibHigh", title: "IB High" },
  // { id: "ibLow", title: "IB Low" },

  // { id: "ibBroken", title: "IB Broken" },

  // { id: "ibExt", subId: "highExt", title: "IB Ext High" },
  // { id: "ibExt", subId: "lowExt", title: "IB Ext Low" },
];

const initialData = segmentData(
  setOpeningType(
    prepareData(compileMarketProfileByDays(data, 68, 5, 0.25)),
  ).reverse(),
);

export const ES = () => {
  const [tableData, setTableData] = useState(initialData);
  const [modalData, setModalData] = useState();

  const [visibleConfig, setVisibleConfig] = useState({
    charts: true,
    table: false,
    filter: true,
  });

  const onFilterData = (data) => setTableData(data);

  return (
    <Page>
      <Modal onClose={() => setModalData(null)} onShow={!!modalData}>
        <div className={"mt-5 text-gray-200"}>
          <MarketProfileChart data={modalData} />
        </div>
      </Modal>

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
          <div className={"flex justify-center mt-20 mb-20"}>
            <ChartDonut
              data={tableData}
              title={"Open Relation"}
              property={"open_relation"}
              labels={OPENS_LABEL}
              width={600}
              height={600}
            />

            <ChartDonut
              data={tableData}
              title={"Open Relation"}
              property={"close_relation_prev"}
              labels={CLOSES_LABEL}
              width={550}
              height={600}
            />

            <ChartDonut
              data={tableData}
              title={"Close Relation To Current Day"}
              property={"close_relation"}
              labels={CLOSES_TO_CURRENT_DAY_LABEL}
              width={550}
              height={600}
            />
          </div>

          <div className={"flex gap-8 justify-center mt-20 mb-20"}>
            <ChartDonut
              data={tableData.map((item) => ({
                ...item,
                opening_type: item.opening_type.includes("OA")
                  ? "OA"
                  : item.opening_type,
              }))}
              title={"Open Relation"}
              property={"opening_type"}
              labels={OPENING_TYPES}
              width={600}
              height={600}
            />

            <ChartDonut
              data={tableData.map((item) => ({
                ...item,
                opening_type: item.opening_type.includes("OA")
                  ? "OA"
                  : item.opening_type,
              }))}
              title={"Opening Type With Alternative Opening"}
              property={"opening_type"}
              labels={OPENING_TYPES}
              width={600}
              height={600}
            />
          </div>

          {/*Touch ZONE*/}

          <div className={"flex justify-center gap-4 mb-10"}>
            <ChartBar
              data={tableData}
              property={"isTestIB"}
              title={"Touch IB"}
              labels={TEST_OPTIONS}
              width={400}
              height={500}
            />

            <ChartBar
              data={tableData}
              property={"isTestPOC"}
              title={"Touch POC"}
              labels={TEST_OPTIONS}
              width={400}
              height={500}
            />

            <ChartBar
              data={tableData}
              property={"isTestVA"}
              title={"Touch VA"}
              labels={TEST_OPTIONS}
              width={400}
              height={500}
            />

            <ChartBar
              data={tableData}
              property={"isTestRange"}
              title={"Touch Range"}
              labels={TEST_OPTIONS}
              width={400}
              height={500}
            />
          </div>

          {1 > 2 && (
            <>
              <div className={"flex justify-center gap-4 mb-10"}>
                <ChartBar
                  data={tableData.filter(
                    (item) => item.open_relation_to_poc === "underPoc",
                  )}
                  property={"isTestVAL"}
                  title={"Touch VAL (Open Under POC)"}
                  labels={TEST_OPTIONS}
                  width={400}
                  height={500}
                />

                <ChartBar
                  data={tableData.filter(
                    (item) => item.open_relation_to_poc === "overPoc",
                  )}
                  property={"isTestVAL"}
                  title={"Touch VAL (Open Over POC)"}
                  labels={TEST_OPTIONS}
                  width={400}
                  height={500}
                />

                <ChartBar
                  data={tableData.filter(
                    (item) => item.open_relation_to_poc === "underPoc",
                  )}
                  property={"isTestVAH"}
                  title={"Touch VAH (Open Under Poc)"}
                  labels={TEST_OPTIONS}
                  width={400}
                  height={500}
                />

                <ChartBar
                  data={tableData.filter(
                    (item) => item.open_relation_to_poc === "overPoc",
                  )}
                  property={"isTestVAH"}
                  title={"Touch VAH (Open Over Poc)"}
                  labels={TEST_OPTIONS}
                  width={400}
                  height={500}
                />
              </div>
            </>
          )}

          {/*Touch ZONE END*/}

          <div className={"flex justify-center gap-4 mb-10"}>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>First Candle Bullish</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChartByFirstCandle(
                    calculateTrendStatistics(data),
                    "bullishFirstCandle",
                  ),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>First Candle Bearish</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataChartByFirstCandle(
                    calculateTrendStatistics(data),
                    "bearishFirstCandle",
                  ),
                  tableData.length,
                  400,
                  500,
                )}
              />
            </div>
          </div>

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
          <div className={"flex justify-center gap-2 mb-10"}>
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
          </div>
          <div>
            <div className={"flex flex-col justify-center items-center"}>
              <div className={"text-gray-300"}>IB Max Ext</div>
              <AgCharts
                options={getBarChartHorizontalConfig(
                  getDataIExtensionChart(tableData, "ibExt", "maxExt"),
                  tableData.length,
                  1400,
                  500,
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
                  1500,
                  300,
                )}
              />
            </div>
          </div>
        </>
      )}
      {visibleConfig.table && (
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

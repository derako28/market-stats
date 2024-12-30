import data from "../../Data-TW/NQ.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  BREAKOUT_PERIODS_LABEL,
  CANDLE_TYPES,
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
  compileMarketProfileByDays,
  prepareData,
  segmentData,
  setOpeningType,
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
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Table } from "../../components/share/Table/table.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { MarketProfileChart } from "../../components/share/MarketProfile/MarketProfile.jsx";
import { Switch } from "../../components/share/Switch/switch.jsx";

const filterOptions = [
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  {
    id: "first_candle",
    title: "First Candle",
    type: FILTER_TYPES.SELECT,
    options: getOptions(CANDLE_TYPES),
  },
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

const initialData = segmentData(
  setOpeningType(
    prepareData(compileMarketProfileByDays(data, 68, 5, 4)),
  ).reverse(),
);

export const NQ = () => {
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
                  550,
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

          {1 > 2 && (
            <div className={"flex justify-center gap-4 mb-10"}>
              <div className={"flex flex-col justify-center items-center"}>
                <div className={"text-gray-300"}>
                  Touch VAL (Open Under POC)
                </div>
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
                <div className={"text-gray-300"}>
                  Touch VAH (Open Under Poc)
                </div>
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
          )}

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
          {/*IB Ext Bar Type End*/}
          {/*<div className={"flex justify-center gap-16 mt-20 mb-10"}>*/}
          {/*  <div className={"flex flex-col justify-center items-center"}>*/}
          {/*    <div className={"text-gray-300"}>IB Size</div>*/}
          {/*    <AgCharts*/}
          {/*      options={getBarChartHorizontalConfig(*/}
          {/*        getDataIBSizeChart(tableData, "ibSize"),*/}
          {/*        tableData.length,*/}
          {/*        1400,*/}
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

import data from "../../Data-TW/ES.json";

import esOvernight from "../../Data-TW/ES-Overnight.json";
import { prepareData as prepareDataOvernight } from "../Overnight/utils.js";

import { Page } from "../../components/share/Page/page.jsx";
import {
  CANDLE_TYPES,
  DATE_RANGE_OPTIONS,
  DAYS_OPTIONS,
  FILTER_TYPES,
  FIRST_FORMED,
  IB_BREAKOUT_OPTIONS,
  OPENING_TYPES_FILTER,
  OPENS_OPTIONS,
  OPENS_RELATION_TO_TOC,
  TRENDS,
} from "../../utils/constants.js";
import { useState } from "react";
import {
  compileMarketProfileByDays,
  mergeArraysByDate,
  prepareData,
  segmentData,
  setOpeningType,
} from "../../utils/prepareData.js";
import { getOptions } from "../Stats/utils.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Table } from "../../components/share/Table/table.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { MarketProfileChart } from "../../components/share/MarketProfile/MarketProfile.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { Switch } from "../../components/share/Switch/switch.jsx";
import { StatisticsCharts } from "../../components/share/StatisticsCharts/statistics-charts.jsx";

const filterOptions = [
  { id: "ov_size_from", title: "Ov Range Size From" },
  { id: "ov_size_to", title: "Ov Range Size To" },

  { id: "day_size_from", title: "Day Range Size From" },
  { id: "day_size_to", title: "Day Range Size To" },

  {
    id: "trend_overnight",
    title: "Trend Overnight",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TRENDS),
  },
  {
    id: "trend_rth",
    title: "Trend Rth",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TRENDS),
  },
  {
    id: "first_overnight_breakout",
    title: "First Overnight Breakout",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BREAKOUT_OPTIONS),
  },

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
    id: "first_candle",
    title: "First Candle",
    type: FILTER_TYPES.SELECT,
    options: getOptions(CANDLE_TYPES),
  },
  {
    id: "firstSideFormed",
    title: "First Side Formed",
    type: FILTER_TYPES.SELECT,
    options: getOptions(FIRST_FORMED),
  },
  {
    id: "opening_type",
    title: "Opening Type",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENING_TYPES_FILTER),
  },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  {
    id: "firstBreakout",
    title: "IB Breakout",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BREAKOUT_OPTIONS),
  },
  // {
  //   id: "first_overnight_breakout",
  //   title: "Overnight Breakout",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(IB_BREAKOUT_OPTIONS),
  // },
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
  { id: "opening_type", title: "Opening Type" },
  { id: "first_candle", title: "First Candle" },
  { id: "firstSideFormed", title: "First Side Formed" },
  { id: "firstBreakout", title: "IB Breakout" },
  { id: "overnight_range", title: "Overnight Range" },
  { id: "day_range", title: "Day Range" },
];

const overnight = prepareDataOvernight(esOvernight);

const initialData = segmentData(
  setOpeningType(
    prepareData(compileMarketProfileByDays(data, 68, 5, 0.25)),
  ).reverse(),
);

const dataWithOvernight = mergeArraysByDate(initialData, overnight);

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
          initialData={dataWithOvernight}
          onChange={onFilterData}
        />
      )}

      {visibleConfig.charts && <StatisticsCharts data={tableData} />}

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

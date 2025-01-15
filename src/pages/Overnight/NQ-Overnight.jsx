import data from "../../Data-TW/NQ-Overnight.json";

import { Page } from "../../components/share/Page/page.jsx";
import {
  DAYS_OPTIONS,
  FILTER_TYPES,
  IB_BREAKOUT_OPTIONS,
} from "../../utils/constants.js";
import { useState } from "react";
import { getOptions } from "../Stats/utils.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Table } from "../../components/share/Table/table.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";
import { MarketProfileChart } from "../../components/share/MarketProfile/MarketProfile.jsx";
import { StatisticsChartsOvernight } from "../../components/share/StatisticsChartsOvernight/statistics-charts-overnight.jsx";
import { prepareData } from "./utils.js";
import { useLocation } from "react-router-dom";

const filterOptions = [
  { id: "ov_size_from", title: "Ov Range Size From" },
  { id: "ov_size_to", title: "Ov Range Size To" },

  { id: "day_size_from", title: "Day Range Size From" },
  { id: "day_size_to", title: "Day Range Size To" },

  {
    id: "first_overnight_breakout",
    title: "First Breakout",
    type: FILTER_TYPES.SELECT,
    options: getOptions(IB_BREAKOUT_OPTIONS),
  },
  { id: "day", title: "Day", type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
];

const columns = [
  { id: "date", title: "Date" },

  { id: "day_range", title: "Day Range" },
  { id: "overnight_range", title: "Overnight Range" },

  { id: "ov_ext_low", title: "Ext Low" },
  { id: "ov_ext_high", title: "Ext High" },
  { id: "ov_ext_max", title: "Ext Max" },

  { id: "overnight_breakout", title: "Overnight Breakout" },
  { id: "first_overnight_breakout", title: "First Breakout" },
];

const initialData = prepareData(data);

export const NQOvernight = () => {
  const location = useLocation();

  const [tableData, setTableData] = useState(initialData);
  const [modalData, setModalData] = useState();

  const [visibleConfig, setVisibleConfig] = useState({
    charts: true,
    table: false,
    filter: true,
  });

  const onFilterData = (data) => setTableData(data);

  return (
    <Page className={"p-4"}>
      <Modal onClose={() => setModalData(null)} onShow={!!modalData}>
        <div className={"mt-5 text-gray-200"}>
          <MarketProfileChart data={modalData} />
        </div>
      </Modal>

      {visibleConfig.table && (
        <Table
          columns={columns}
          data={tableData}
          onClickRow={(item) => {
            setModalData(item);
          }}
        />
      )}

      <Statistic data={tableData} />

      {visibleConfig.filter && (
        <Filter
          options={filterOptions}
          initialData={initialData}
          onChange={onFilterData}
        />
      )}

      {visibleConfig.charts && <StatisticsChartsOvernight data={tableData} />}
    </Page>
  );
};

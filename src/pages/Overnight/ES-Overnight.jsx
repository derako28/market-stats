import data from "../../Data-TW/ES-Overnight.json";

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

const filterOptions = [
  { id: "date", title: "Date" },

  { id: "day_range", title: "Day Range" },
  { id: "overnight_range", title: "Overnight Range" },

  { id: "trend_overnight", title: "Trend Overnight" },
  { id: "trend_rth", title: "Trend Rth" },

  { id: "ov_ext_low", title: "Ext Low" },
  { id: "ov_ext_high", title: "Ext High" },
  { id: "ov_ext_max", title: "Ext Max" },

  { id: "overnight_breakout", title: "Overnight Breakout" },
  { id: "first_overnight_breakout", title: "First Breakout" },
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

export const ESOvernight = () => {
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

import { Table } from "../../components/share/Table/table.jsx";

import data from "../../Data/data-dax-tv.json";
import BacktestData from "../BacktestsOld/data-backtests-2.json";

import { useState } from "react";
import { getDayOfWeek } from "./utils";
import { DAYS_OPTIONS, FILTER_TYPES } from "../../utils/constants.js";
import { Filter } from "../../components/share/Filter/filter.jsx";
import { Page } from "../../components/share/Page/page.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { BacktestTable } from "../BacktestsOld/backtest-table.jsx";

import moment from "moment/moment";
import { analyzeDayData, calculateTPOPerDay2 } from "./utils-tpo.js";

const columns = [
  { id: "day", title: "Date", type: FILTER_TYPES.DATEPICKER_RANGE },
  // {
  //   id: "open",
  //   title: "Open Relation",
  // },
  // {
  //   id: "opening_type",
  //   title: "Opening Type",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(OPENING_TYPES),
  // },
  // {
  //   id: "type_day",
  //   title: "Type Day",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(DAY_TYPES),
  // },
  // {
  //   id: "ib_breakout",
  //   title: "IB Breakout",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(IB_BREAKOUT),
  // },
  // {
  //   id: "direction",
  //   title: "Direction",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(DIRECTION),
  // },
  { id: "ibSize", title: "IB Size" },
  { id: "ibrHigh", title: "IB High" },
  { id: "ibrLow", title: "IB Low" },
  { id: "poc", title: "poc" },
  { id: "vah", title: "vah" },
  { id: "val", title: "val" },
  { id: "tpoOpen", title: "tpoOpen" },
  { id: "tpoClose", title: "tpoClose" },
  { id: "tpoHigh", title: "tpoHigh" },
  { id: "tpoLow", title: "tpoLow" },

  // { id: "ib_ext", title: "IB_Exp", filter: false },
  // { id: "ib_ext_ny", title: "IB Exp NY", filter: false },
];

const filterOptions = [
  { id: "day", title: "Day", type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
];

const initialData = analyzeDayData(
  calculateTPOPerDay2(data, 68, 5).slice(0, 5).reverse(),
);

export const StatsTableDaxTPO = () => {
  const [tableData, setTableData] = useState(initialData);
  const [modalData, setModalData] = useState();

  const dataFilter = (dataFilter) => {
    const startDate = moment(dataFilter.date?.startDate);
    const endDate = moment(dataFilter.date?.endDate);

    const newData = data.filter((item) => {
      return Object.keys(dataFilter).every((key) => {
        if (dataFilter[key] === "" || dataFilter[key] === undefined)
          return true;

        if (key === "day") {
          return getDayOfWeek(item.date) === dataFilter.day;
        }

        if (key === "date") {
          const currentDate = moment(item.date);

          return moment(currentDate).isBetween(startDate, endDate);
        }

        if (key === "ib_size") {
          return (
            +item[key] >= +dataFilter[key] - 5 &&
            +item[key] <= +dataFilter[key] + 5
          );
        }

        return item[key]
          ?.toString()
          .toLowerCase()
          ?.includes(dataFilter[key].toString().toLowerCase());
      });
    });

    setTableData(newData);
  };

  return (
    <Page>
      <Modal onClose={() => setModalData(null)} onShow={!!modalData}>
        {modalData?.screen && <img src={modalData.screen} />}

        <div className={"mt-5 text-gray-200"}>
          <BacktestTable
            data={BacktestData.filter((item) => {
              return item?.date === modalData?.date;
            })}
          />
        </div>
      </Modal>

      <Filter options={filterOptions} onChange={dataFilter} />

      <Table
        columns={columns}
        data={tableData}
        filterData={tableData}
        onClickRow={(item) => {
          setModalData(item);
        }}
      />
    </Page>
  );
};

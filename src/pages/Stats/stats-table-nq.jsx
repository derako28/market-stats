import { Table } from "../../components/table.jsx";

import data from "../../Data/algo-nq.json";

import { useState } from "react";
import {
  convertToSegmentHighLow,
  getDayOfWeek,
  getOptions,
  mergeTPOData,
  prepareDataABC,
  segmentData,
} from "./utils";
import {
  DAYS_OPTIONS,
  FILTER_TYPES,
  OPENS_OPTIONS,
  TEST_OPTIONS,
} from "./constants";
import { Filter } from "../../components/filter.jsx";
import { Page } from "../../components/share/Page/page.jsx";

import moment from "moment/moment";
import dataTv from "../../Data/data-es-tv.json";

const columns = [
  { id: "TPO_Date", title: "Date" },
  {
    id: "open_relation",
    title: "Open Relation",
  },
  {
    id: "close_relation",
    title: "Close Relation",
  },
  // { id: "type_day", title: "Day Type" },
  // { id: "opening_type", title: "Opening Type" },
  // { id: "ib_broken", title: "IB Broken" },
  { id: "ib_size", title: "IB Size" },
  // { id: "ib_ext", title: "IB_Exp" },
  { id: "TPO_Open", title: "TPO Open" },
  { id: "TPO_High", title: "TPO High" },
  { id: "TPO_Low", title: "TPO Low" },
  { id: "VAH", title: "VAH" },
  { id: "VAL", title: "VAL" },
  { id: "POC", title: "POC" },

  { id: "isTestVA", title: "Test VA" },
  { id: "isTestPOC", title: "Test POC" },
  // { id: "isTestIB", title: "Test IB" },

  // { id: "A_High", title: "A_High" },
  // { id: "A_Low", title: "A_Low" },
  // { id: "B_High", title: "B_High" },
  // { id: "B_Low", title: "B_Low" },
  // { id: "C_High", title: "C_High" },
  // { id: "C_Low", title: "C_Low" },
];

const filterOptions = [
  // { id: 'TPO_Date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
  {
    id: "open_relation",
    title: "Open Relation",
    type: FILTER_TYPES.SELECT,
    options: getOptions(OPENS_OPTIONS),
  },
  // { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
  // { id: 'type_day', title: 'Type Day', filter: false },
  { id: "ib_size", title: "IB Size" },
  { id: "ib_size_from", title: "IB Size From" },
  { id: "ib_size_to", title: "IB Size To" },
  { id: "ib_size_segmented", title: "IB Size Segmented" },
  // { id: "ib_ext", title: "IB_Exp" },

  // {
  //   id: "ib_broken",
  //   title: "IB Broken",
  //   type: FILTER_TYPES.SELECT,
  //   options: getOptions(IB_BROKEN_OPTIONS),
  // },

  // { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false  },

  {
    id: "isTestVA",
    title: "Test VA",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TEST_OPTIONS),
  },
  {
    id: "isTestPOC",
    title: "Test POC",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TEST_OPTIONS),
  },
  {
    id: "isTestIB",
    title: "Test IB",
    type: FILTER_TYPES.SELECT,
    options: getOptions(TEST_OPTIONS),
  },

  { id: "day", title: "Day", type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
];

const segmentDataByPeriod = convertToSegmentHighLow(dataTv);

// const readyData = mergeTPOData(data, segmentDataByPeriod);
const initialData = segmentData(prepareDataABC(data), 1).reverse();

export const StatsTableNQ = () => {
  const [tableData, setTableData] = useState(initialData);

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
      <Filter options={filterOptions} onChange={dataFilter} />
      <Table columns={columns} data={tableData} filterData={tableData} />
    </Page>
  );
};

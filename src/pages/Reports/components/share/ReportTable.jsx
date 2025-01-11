import { Table } from "../../../../components/share/Table/table.jsx";

import React from "react";

const columns = [
  { id: "date", title: "Date" },
  { id: "open_relation", title: "Open Relation" },
  { id: "firstSideFormed", title: "First Side Formed" },
  // { id: "first_candle", title: "First Candle" },
  { id: "opening_type", title: "Opening Type" },
  { id: "ibSize", title: "IB Size" },
  { id: "firstBreakout", title: "First IB Breakout" },
  { id: "ib_breakout", title: "IB Breakout" },
];

export const ReportTable = ({ data }) => {
  return (
    <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-12">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          {/*<h3 className="text-sm font-semibold">Table</h3>*/}
        </div>
      </div>
      <div
        style={{ maxHeight: 400, overflow: "auto" }}
        className="flex flex-col lg:flex-row gap-6"
      >
        <div className="flex-1 bg-gray-800  rounded-lg shadow-inner">
          <Table columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

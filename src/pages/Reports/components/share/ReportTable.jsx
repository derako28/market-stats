import { Table } from "../../../../components/share/Table/table.jsx";

import React from "react";

const columns = [
  { id: "date", title: "Date" },
  { id: "open_relation", title: "Open Relation" },
  { id: "opening_type", title: "Opening Type" },
  { id: "ibSize", title: "IB Size" },
  // { id: "firstBreakout", title: "First IB Breakout" },
  { id: "ib_breakout", title: "IB Breakout" },
];

export const ReportTable = ({ data }) => {
  return (
    <div className="mx-auto max-w-screen-xl rounded-xl shadow-lg space-y-6 mb-12">
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

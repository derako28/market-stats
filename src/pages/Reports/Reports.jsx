import React, { useEffect, useState } from "react";

import { Filter } from "../../components/share/FilterNew/filter.jsx";
import { REPORT_TYPES, TICKERS } from "../../utils/constants.js";
import { GreenRedDaysByWeekDay } from "./components/GreenRedDaysByWeekDay.jsx";
import { IBBreakout } from "./components/IBBreakout.jsx";
import { getData } from "./getData.js";
import { IBSizes } from "./components/IBSizes.jsx";
import { ReportTable } from "./components/share/ReportTable.jsx";
import { TouchZones } from "./components/TouchZones.jsx";
import { Modal } from "../../components/share/Modal/modal.jsx";
import { Button } from "../../components/share/Button/button.jsx";
import { PageSettings } from "./components/share/PageSettings.jsx";
import { getPercent, getSetting } from "./utils.js";
import { Page } from "../../components/share/Page/page.jsx";

export const Reports = () => {
  const [modalData, setModalData] = useState(false);
  const [ticker, setTicker] = useState(TICKERS.ES);
  const [initialData, setInitialData] = useState(null);
  const [tableData, setTableData] = useState(initialData);
  const [visibilitySetting, setVisibilitySetting] = useState({});

  const onFilterData = (dataFilter) => {
    if (dataFilter && ticker !== dataFilter?.ticker) {
      setInitialData(getData(dataFilter));

      setTicker(dataFilter.ticker);
    }
    setTableData(getData(dataFilter));
  };

  const onChangeSettings = (data) => {
    setVisibilitySetting(data);
  };

  useEffect(() => {
    setVisibilitySetting(getSetting());
    setInitialData(getData());
  }, []);

  return (
    <Page noHeader className={"px-4 py-2"}>
      <div className={"mb-12"}>
        <Button
          className={"absolute right-5 top-5"}
          onClick={() => setModalData(true)}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
          </svg>
        </Button>
        <div className="flex justify-center items-center gap-4 text-white px-4 md:px-8 lg:px-12 mx-auto max-w-screen-xl rounded-xl shadow-lg">
          {visibilitySetting && <Filter onChange={onFilterData} />}
        </div>
        <div className={"text-center"}>
          {visibilitySetting &&
            visibilitySetting[REPORT_TYPES.DAYS_COUNTER] && (
              <>
                Days: {tableData?.length} (
                {getPercent(tableData?.length, initialData?.length)}%)
              </>
            )}
        </div>
      </div>

      {visibilitySetting && visibilitySetting[REPORT_TYPES.GREEN_RED_DAYS] && (
        <GreenRedDaysByWeekDay data={tableData} />
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.IB_BREAKOUT] && (
        <IBBreakout data={tableData} />
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.TOUCH_ZONES] && (
        <TouchZones data={tableData} />
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.IB_SIZES] && (
        <IBSizes data={tableData} />
      )}
      {visibilitySetting && visibilitySetting[REPORT_TYPES.TABLE] && (
        <ReportTable data={tableData} />
      )}

      <Modal
        onClose={() => setModalData(false)}
        onShow={modalData || !visibilitySetting}
      >
        <div className={"mt-5 text-gray-200"}>
          <PageSettings onChange={onChangeSettings} />
        </div>
      </Modal>
    </Page>
  );
};

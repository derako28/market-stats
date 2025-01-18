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
import { PageSettings } from "./components/share/PageSettings.jsx";
import { getPercent, getSetting } from "./utils.js";
import { Page } from "../../components/share/Page/page.jsx";
import { ButtonSettings } from "./components/share/ButtonSettings.jsx";
import { TouchVAZones } from "./components/TouchVAZones.jsx";

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

  // console.log(JSON.stringify(tableData && tableData[0]));

  return (
    <Page noHeader className={"px-4 py-2"}>
      <div className={"mb-12"}>
        <ButtonSettings onClick={() => setModalData(true)} />

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

      {visibilitySetting && visibilitySetting[REPORT_TYPES.TOUCH_VA_ZONES] && (
        <TouchVAZones data={tableData} />
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

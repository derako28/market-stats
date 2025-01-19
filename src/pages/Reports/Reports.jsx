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
import { RetestIB } from "./components/RetestIB.jsx";

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
      <ButtonSettings onClick={() => setModalData(true)} />

      {visibilitySetting && <Filter onChange={onFilterData} />}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.DAYS_COUNTER] && (
        <div className={"text-center mb-8"}>
          Days: {tableData?.length} (
          {getPercent(tableData?.length, initialData?.length)}%)
        </div>
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.GREEN_RED_DAYS] && (
        <GreenRedDaysByWeekDay data={tableData} />
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.IB_BREAKOUT] && (
        <IBBreakout data={tableData} />
      )}

      {visibilitySetting && visibilitySetting[REPORT_TYPES.RETEST_IB] && (
        <RetestIB data={tableData} />
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

import data from "../../Data-TW/DAX-VWAP.json";
import { determineTrendByDay } from "./utils.js";
import { Page } from "../../components/share/Page/page.jsx";
import { ChartBar } from "../../components/share/Chart/chart-bar.jsx";
import { Statistic } from "../../components/share/Statistic/Statistic.jsx";

export const TRENDS_LABEL = {
  uptrend: "Uptrend",
  downtrend: "Downtrend",
  flat: "Flat",
};

const initialData = determineTrendByDay(data, "9:10", "10:00");

export const DaxVwap = () => {
  console.log(initialData);

  return (
    <Page>
      {/*<Statistic data={initialData} />;*/}
      <div className={"flex justify-center mt-20 mb-20"}>
        <ChartBar
          data={initialData}
          title={""}
          property={"trend"}
          labels={TRENDS_LABEL}
          width={600}
          height={600}
        />
      </div>
    </Page>
  );
};

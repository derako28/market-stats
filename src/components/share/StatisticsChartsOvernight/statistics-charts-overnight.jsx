import { ChartDonut } from "../Chart/chart-donut.jsx";
import { BREAKOUT_PERIODS_LABEL, TRENDS } from "../../../utils/constants.js";
import { ChartBar } from "../Chart/chart-bar.jsx";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartHorizontalConfig,
  getDataIBChart,
  getDataIExtensionChart,
} from "../../../pages/Stats/utils.js";
import {
  BREAKOUT_LABELS,
  FIRST_BREAKOUT_LABELS,
} from "../../../pages/Overnight/constatnts.js";
import {
  dataWithBreakoutInfo,
  getRangeSizeChart,
} from "../../../pages/Overnight/utils.js";

export const StatisticsChartsOvernight = ({ data }) => {
  return (
    <>
      <div className={"flex justify-center gap-16 mt-10 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartConfig(
              getDataIBChart(
                dataWithBreakoutInfo(data, "overnight_breakout"),
                BREAKOUT_LABELS,
              ),
              data.length,
              700,
              300,
            )
          }
          title={"Breakout"}
        />
        <ChartBar
          customHandler={() =>
            getBarChartConfig(
              getDataIBChart(
                dataWithBreakoutInfo(data, "first_overnight_breakout"),
                FIRST_BREAKOUT_LABELS,
              ),
              data.length,
              700,
              300,
            )
          }
          title={"First Breakout"}
        />
      </div>

      {/*IB Ext Bar Type*/}
      <div className={"flex justify-center gap-2 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ov_ext_low"),
              data.length,
              700,
              500,
            )
          }
          title={"Low Ext"}
        />
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ov_ext_high"),
              data.length,
              700,
              500,
            )
          }
          title={"High Ext"}
        />
      </div>
      <div>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ov_ext_max"),
              data.length,
              1400,
              500,
            )
          }
          title={"Max Ext"}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getRangeSizeChart(data, "overnight_range"),
              data.length,
              1400,
              500,
            )
          }
          title={"Overnight Range"}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getRangeSizeChart(data, "day_range"),
              data.length,
              1400,
              500,
            )
          }
          title={"Day Range"}
        />
      </div>

      {/*<div className={"flex gap-8 justify-center mt-20 mb-20"}>*/}
      {/*  <ChartDonut*/}
      {/*    data={data.map((item) => ({*/}
      {/*      ...item,*/}
      {/*      opening_type: item.opening_type.includes("OA")*/}
      {/*        ? "OA"*/}
      {/*        : item.opening_type,*/}
      {/*    }))}*/}
      {/*    title={"Opening Types"}*/}
      {/*    property={"opening_type"}*/}
      {/*    labels={OPENING_TYPES}*/}
      {/*    width={600}*/}
      {/*    height={600}*/}
      {/*  />*/}

      {/*  <ChartDonut*/}
      {/*    data={data}*/}
      {/*    title={"Opening Types With Alternative Opening"}*/}
      {/*    property={"opening_type"}*/}
      {/*    labels={OPENING_TYPES}*/}
      {/*    width={700}*/}
      {/*    height={600}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className={"flex justify-center gap-16 mt-20 mb-20"}>
        <ChartDonut
          data={data}
          title={"First Breakout Periods"}
          property={"first_breakout_period"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data.filter(
            (item) => item?.breakoutPeriods?.oppositeBreakout.period,
          )}
          title={"Opposite Breakout Periods"}
          property={"opposite_breakout_period"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-20"}>
        <ChartDonut
          data={data}
          title={"High In Periods"}
          property={"highInPeriod"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data}
          title={"Low Periods"}
          property={"lowInPeriod"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-20"}>
        <ChartDonut
          data={data}
          title={"Trend By Overnight"}
          property={"trend_overnight"}
          labels={TRENDS}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data}
          title={"Trend By Rth"}
          property={"trend_rth"}
          labels={TRENDS}
          width={600}
          height={600}
        />
      </div>
    </>
  );
};

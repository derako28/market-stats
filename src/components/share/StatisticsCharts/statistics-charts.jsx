import { ChartDonut } from "../Chart/chart-donut.jsx";
import {
  BREAKOUT_PERIODS_LABEL,
  DAYS_LABEL,
  IB_BREAKOUT_LABELS,
  IB_BREAKOUT_OPTIONS,
  OPENING_TYPES,
  TEST_OPTIONS,
} from "../../../utils/constants.js";
import { ChartBar } from "../Chart/chart-bar.jsx";
import {
  dataWithIbInfo,
  getBarChartConfig,
  getBarChartConfigFoWeeklyHighLow,
  getBarChartHorizontalConfig,
  getChartConfigForBreakoutPeriods,
  getChartConfigForWeeklyHighLow,
  getDataIBChart,
  getDataIBSizeChart,
  getDataIExtensionChart,
  getWeeklyHighLowStats,
} from "../../../pages/Stats/utils.js";

export const StatisticsCharts = ({ data }) => {
  return (
    <>
      {/*<div className={"flex justify-center mt-20 mb-20"}>*/}
      {/*  <ChartPie*/}
      {/*    data={data}*/}
      {/*    title={"Open Relation"}*/}
      {/*    property={"open_relation"}*/}
      {/*    labels={OPENS_LABEL}*/}
      {/*    width={600}*/}
      {/*    height={600}*/}
      {/*  />*/}

      {/*  <ChartPie*/}
      {/*    data={data}*/}
      {/*    title={"Close Relation"}*/}
      {/*    property={"close_relation_prev"}*/}
      {/*    labels={CLOSES_LABEL}*/}
      {/*    width={550}*/}
      {/*    height={600}*/}
      {/*  />*/}

      {/*  <ChartPie*/}
      {/*    data={data}*/}
      {/*    title={"Close Relation To Current Day"}*/}
      {/*    property={"close_relation"}*/}
      {/*    labels={CLOSES_TO_CURRENT_DAY_LABEL}*/}
      {/*    width={550}*/}
      {/*    height={600}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className={"flex justify-center gap-16 mt-10 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartConfig(
              getDataIBChart(
                dataWithIbInfo(data, "ib_breakout"),
                IB_BREAKOUT_LABELS,
              ),
              data.length,
              700,
              300,
            )
          }
          title={"IB Breakout"}
        />
        <ChartBar
          customHandler={() =>
            getBarChartConfig(
              getDataIBChart(
                dataWithIbInfo(data, "firstBreakout"),
                IB_BREAKOUT_OPTIONS,
              ),
              data.length,
              700,
              300,
            )
          }
          title={"IB First Breakout"}
        />
      </div>

      {/*Touch ZONE*/}

      <div className={"flex justify-center gap-4 mb-10"}>
        <ChartBar
          data={data}
          property={"isTouchIB"}
          title={"Touch IB"}
          labels={TEST_OPTIONS}
          width={400}
          height={500}
        />

        <ChartBar
          data={data}
          property={"isTouchPOC"}
          title={"Touch POC"}
          labels={TEST_OPTIONS}
          width={400}
          height={500}
        />

        <ChartBar
          data={data}
          property={"isTouchVA"}
          title={"Touch VA"}
          labels={TEST_OPTIONS}
          width={400}
          height={500}
        />

        <ChartBar
          data={data}
          property={"isTouchRange"}
          title={"Touch Range"}
          labels={TEST_OPTIONS}
          width={400}
          height={500}
        />
      </div>

      {/*<div className={"flex justify-center gap-4 mb-10"}>*/}
      {/*  <ChartBar*/}
      {/*    data={data.filter(*/}
      {/*      (item) =>*/}
      {/*        item.open_relation_to_poc === OPENS_RELATION_TO_TOC.LOWER_POC,*/}
      {/*    )}*/}
      {/*    property={"isTouchVAL"}*/}
      {/*    title={"Touch VAL (Open Under POC)"}*/}
      {/*    labels={TEST_OPTIONS}*/}
      {/*    width={400}*/}
      {/*    height={500}*/}
      {/*  />*/}

      {/*  <ChartBar*/}
      {/*    data={data.filter(*/}
      {/*      (item) =>*/}
      {/*        item.open_relation_to_poc === OPENS_RELATION_TO_TOC.ABOVE_POC,*/}
      {/*    )}*/}
      {/*    property={"isTouchVAL"}*/}
      {/*    title={"Touch VAL (Open Over POC)"}*/}
      {/*    labels={TEST_OPTIONS}*/}
      {/*    width={400}*/}
      {/*    height={500}*/}
      {/*  />*/}

      {/*  <ChartBar*/}
      {/*    data={data.filter(*/}
      {/*      (item) =>*/}
      {/*        item.open_relation_to_poc === OPENS_RELATION_TO_TOC.LOWER_POC,*/}
      {/*    )}*/}
      {/*    property={"isTouchVAH"}*/}
      {/*    title={"Touch VAH (Open Under Poc)"}*/}
      {/*    labels={TEST_OPTIONS}*/}
      {/*    width={400}*/}
      {/*    height={500}*/}
      {/*  />*/}

      {/*  <ChartBar*/}
      {/*    data={data.filter(*/}
      {/*      (item) =>*/}
      {/*        item.open_relation_to_poc === OPENS_RELATION_TO_TOC.ABOVE_POC,*/}
      {/*    )}*/}
      {/*    property={"isTouchVAH"}*/}
      {/*    title={"Touch VAH (Open Over Poc)"}*/}
      {/*    labels={TEST_OPTIONS}*/}
      {/*    width={400}*/}
      {/*    height={500}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*IB Ext Bar Type*/}
      <div className={"flex justify-center gap-2 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ibExt", "lowExt"),
              data.length,
              700,
              500,
            )
          }
          title={"IB Low Ext"}
        />
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ibExt", "highExt"),
              data.length,
              700,
              500,
            )
          }
          title={"IB High Ext"}
        />
      </div>
      <div>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIExtensionChart(data, "ibExt", "maxExt"),
              data.length,
              1400,
              500,
            )
          }
          title={"IB Max Ext"}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-10"}>
        <ChartBar
          customHandler={() =>
            getBarChartHorizontalConfig(
              getDataIBSizeChart(data, "ib_size_segmented"),
              data.length,
              1400,
              500,
            )
          }
          title={"IB Size Segmented"}
        />
      </div>

      {/*<div className={"flex justify-center gap-16 mt-20 mb-10"}>*/}
      {/*  <ChartBar*/}
      {/*    customHandler={() =>*/}
      {/*      getBarChartHorizontalConfig(*/}
      {/*        getDataIBSizeChart(data, "overnight_range"),*/}
      {/*        data.length,*/}
      {/*        1400,*/}
      {/*        500,*/}
      {/*      )*/}
      {/*    }*/}
      {/*    title={"Overnight Range"}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<div className={"flex justify-center gap-16 mt-20 mb-10"}>*/}
      {/*  <ChartBar*/}
      {/*    customHandler={() =>*/}
      {/*      getBarChartHorizontalConfig(*/}
      {/*        getDataIBSizeChart(data, "day_range"),*/}
      {/*        data.length,*/}
      {/*        1400,*/}
      {/*        500,*/}
      {/*      )*/}
      {/*    }*/}
      {/*    title={"Day Range"}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className={"flex gap-8 justify-center mt-20 mb-20"}>
        <ChartDonut
          data={data.map((item) => ({
            ...item,
            opening_type: item.opening_type.includes("OA")
              ? "OA"
              : item.opening_type,
          }))}
          title={"Opening Types"}
          property={"opening_type"}
          labels={OPENING_TYPES}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data}
          title={"Opening Types With Alternative Opening"}
          property={"opening_type"}
          labels={OPENING_TYPES}
          width={700}
          height={600}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-20"}>
        <ChartDonut
          data={data}
          customHandler={getChartConfigForBreakoutPeriods}
          title={"First Breakout Periods"}
          property={"firstBreakout"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data.filter(
            (item) => item?.breakoutPeriods?.oppositeBreakout.period,
          )}
          customHandler={getChartConfigForBreakoutPeriods}
          title={"Opposite Breakout Periods"}
          property={"oppositeBreakout"}
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
          title={"Low In Periods"}
          property={"lowInPeriod"}
          labels={BREAKOUT_PERIODS_LABEL}
          width={600}
          height={600}
        />
      </div>

      <div className={"flex justify-center gap-16 mt-20 mb-20"}>
        <ChartBar
          data={data}
          title={"Highest high of the week"}
          property={"high"}
          customHandler={() =>
            getBarChartConfigFoWeeklyHighLow(
              getWeeklyHighLowStats(data).highDays,
              getWeeklyHighLowStats(data).weeks,
              700,
              300,
            )
          }
          labels={DAYS_LABEL}
          width={600}
          height={600}
        />

        <ChartDonut
          data={data}
          title={"Lowest low of the week"}
          property={"low"}
          customHandler={() =>
            getBarChartConfigFoWeeklyHighLow(
              getWeeklyHighLowStats(data).lowDays,
              getWeeklyHighLowStats(data).weeks,
              700,
              300,
            )
          }
          labels={DAYS_LABEL}
          width={600}
          height={600}
        />
      </div>
    </>
  );
};

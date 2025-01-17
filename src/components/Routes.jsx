import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { getFeature } from "../utils/getFeature.js";
import { StatsTableNew } from "../pages/Stats/stats-table-new.jsx";
import { StatsChartsAG2024 } from "../pages/Stats/stats-charts-ag-24.jsx";
import { StatsTableDaxTPO } from "../pages/Stats/stats-table-dax-tpo.jsx";
import { StatsTableDax } from "../pages/Stats/stats-table-dax.jsx";
import { StatsChartsDax } from "../pages/Stats/stats-charts-dax.jsx";
import { StatsTableES } from "../pages/Stats/stats-table-es.jsx";
import { StatsTableNQ } from "../pages/Stats/stats-table-nq.jsx";
import { StatsChartsAGFiniteqES } from "../pages/Stats/stats-charts-finiteq-es.jsx";
import { StatsChartsAGFiniteqNQ } from "../pages/Stats/stats-charts-finiteq-nq.jsx";
import { BacktestsTapokUS500 } from "../pages/Backtests-Tapok-US500/Backtests-Tapok-US500.jsx";
import { Dax } from "../pages/Dax/Dax.jsx";
import { ES } from "../pages/ES/ES.jsx";
import { NQ } from "../pages/NQ/NQ.jsx";
import { YM } from "../pages/YM/YM.jsx";
import { DaxVwap } from "../pages/DAX+VWAP/dax-vwap.jsx";
import { Reports } from "../pages/Reports/Reports.jsx";
import { Backtests } from "../pages/Backtests/Backtests.jsx";
import { NQOvernight } from "../pages/Overnight/NQ-Overnight.jsx";
import { ESOvernight } from "../pages/Overnight/ES-Overnight.jsx";
import { useEffect } from "react";
import { DaxWeekly } from "../pages/Dax/Dax-Weekly.jsx";

export const AppRoutes = () => {
  const module = localStorage.getItem("module");
  useEffect(() => {
    if (module) {
      window.location.replace("/market-stats/#nq-overnight");
    }
  }, []);

  return (
    <>
      <Router>
        <div>
          <Routes>
            {getFeature("newStatistics") && (
              <>
                <Route path="/dax" element={<Dax />} />
                <Route path="/es" element={<ES />} />
                <Route path="/nq" element={<NQ />} />
                <Route path="/ym" element={<YM />} />
              </>
            )}

            {getFeature("weeklyStatistics") && (
              <>
                <Route path="/dax-weekly" element={<Daxweekly />} />
              </>
            )}

            {getFeature("Overnight") && (
              <>
                <Route path="/nq-overnight" element={<NQOvernight />} />
                <Route path="/es-overnight" element={<ESOvernight />} />
              </>
            )}

            <Route path="/reports" element={<Reports />} />

            {getFeature("DAX_VWAP") && (
              <>
                <Route path="/dax-vwap" element={<DaxVwap />} />
              </>
            )}

            {getFeature("dax") && (
              <>
                <Route path="/stats-table-new" element={<StatsTableNew />} />

                <Route
                  path="/stats-charts-24"
                  element={<StatsChartsAG2024 />}
                />
                <Route
                  path="/stats-table-tpo-dax"
                  element={<StatsTableDaxTPO />}
                />
              </>
            )}

            <Route path="/stats-table-dax" element={<StatsTableDax />} />

            <Route path="/stats-charts-dax" element={<StatsChartsDax />} />

            <Route path="/stats-table-es" element={<StatsTableES />} />
            <Route path="/stats-table-nq" element={<StatsTableNQ />} />
            <Route
              path="/stats-charts-es"
              element={<StatsChartsAGFiniteqES />}
            />
            <Route
              path="/stats-charts-nq"
              element={<StatsChartsAGFiniteqNQ />}
            />

            {getFeature("backtests") && (
              <>
                <Route path="/backtests" element={<Backtests />} />
                {/*<Route path="/backtests-sanya" element={<BacktestsSanya />} />*/}
                {/*<Route path="/backtests-tapok" element={<BacktestsTapok />} />*/}
                <Route
                  path="/backtests-tapok-US500"
                  element={<BacktestsTapokUS500 />}
                />
              </>
            )}
            <Route path="*" element={<Navigate to="/es" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

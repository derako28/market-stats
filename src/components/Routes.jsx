import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home.jsx";
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
import { Backtests } from "../pages/Backtests/Backtests.jsx";
import { BacktestsSanya } from "../pages/Backtests/Backtests-Sanya.jsx";
import { BacktestsTapok } from "../pages/Backtests-Tapok/Backtests-Tapok.jsx";
import { BacktestsTapokUS500 } from "../pages/Backtests-Tapok-US500/Backtests-Tapok-US500.jsx";
import { Dax } from "../pages/Dax/Dax.jsx";
import { ES } from "../pages/ES/ES.jsx";
import { NQ } from "../pages/NQ/NQ.jsx";
import { YM } from "../pages/YM/YM.jsx";

export const AppRoutes = () => {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route exact path="/market-stats/" element={<Home />} />

            {getFeature("dax") && (
              <>
                <Route path="/market-stats/dax" element={<Dax />} />
                <Route path="/market-stats/es" element={<ES />} />
                <Route path="/market-stats/nq" element={<NQ />} />
                <Route path="/market-stats/ym" element={<YM />} />
              </>
            )}

            {getFeature("dax") && (
              <>
                <Route
                  path="/market-stats/stats-table-new"
                  element={<StatsTableNew />}
                />

                <Route
                  path="/market-stats/stats-charts-24"
                  element={<StatsChartsAG2024 />}
                />
                <Route
                  path="/market-stats/stats-table-tpo-dax"
                  element={<StatsTableDaxTPO />}
                />
              </>
            )}

            <Route
              path="/market-stats/stats-table-dax"
              element={<StatsTableDax />}
            />

            <Route
              path="/market-stats/stats-charts-dax"
              element={<StatsChartsDax />}
            />

            <Route
              path="/market-stats/stats-table-es"
              element={<StatsTableES />}
            />
            <Route
              path="/market-stats/stats-table-nq"
              element={<StatsTableNQ />}
            />
            <Route
              path="/market-stats/stats-charts-es"
              element={<StatsChartsAGFiniteqES />}
            />
            <Route
              path="/market-stats/stats-charts-nq"
              element={<StatsChartsAGFiniteqNQ />}
            />
            <Route path="/market-stats/backtests" element={<Backtests />} />

            {getFeature("backtests") && (
              <>
                <Route
                  path="/market-stats/backtests-sanya"
                  element={<BacktestsSanya />}
                />
                <Route
                  path="/market-stats/backtests-tapok"
                  element={<BacktestsTapok />}
                />
                <Route
                  path="/market-stats/backtests-tapok-US500"
                  element={<BacktestsTapokUS500 />}
                />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </>
  );
};

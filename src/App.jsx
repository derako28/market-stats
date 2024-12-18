import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { StatsTableDax } from "./pages/Stats/stats-table-dax.jsx";
import { StatsTableNew } from "./pages/Stats/stats-table-new.jsx";
import { StatsChartsDax } from "./pages/Stats/stats-charts-dax.jsx";
import { StatsChartsAG2024 } from "./pages/Stats/stats-charts-ag-24.jsx";
import { StatsChartsAGFiniteqES } from "./pages/Stats/stats-charts-finiteq-es.jsx";
import { StatsChartsAGFiniteqNQ } from "./pages/Stats/stats-charts-finiteq-nq.jsx";
import { Backtests } from "./pages/Backtests/Backtests.jsx";
import { BacktestsSanya } from "./pages/Backtests/Backtests-Sanya.jsx";
import { BacktestsTapok } from "./pages/Backtests-Tapok/Backtests-Tapok.jsx";
import { BacktestsTapokUS500 } from "./pages/Backtests-Tapok-US500/Backtests-Tapok-US500.jsx";
import { getEnv } from "./utils/getEnv.js";
import { getFeature } from "./utils/getFeature.js";
import { StatsTableES } from "./pages/Stats/stats-table-es.jsx";
import { StatsTableNQ } from "./pages/Stats/stats-table-nq.jsx";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/market-stats/" element={<Home />} />

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
  );
}

export default App;

import { NavLink } from "react-router-dom";
import { getEnv } from "../../../utils/getEnv.js";
import { getFeature } from "../../../utils/getFeature.js";

export const Header = () => {
  return (
    <div className={"flex gap-4 text-gray-300 p-4 mb-2"}>
      {getFeature("newStatistics") && (
        <>
          <NavLink to={"/market-stats/dax"}>DAX</NavLink>
          <NavLink to={"/market-stats/es"}>ES</NavLink>
          <NavLink to={"/market-stats/nq"}>NQ</NavLink>
          <NavLink to={"/market-stats/ym"}>YM</NavLink>
        </>
      )}
      {getFeature("dax") && (
        <>
          <NavLink to={"/market-stats/stats-table-new"}>Table New</NavLink>

          <NavLink to={"/market-stats/stats-table-tpo-dax"}>
            Table DAX TPO
          </NavLink>
        </>
      )}

      {getFeature("oldStatistics") && (
        <>
          <NavLink to={"/market-stats/stats-table-dax"}>Table DAX</NavLink>
          <NavLink to={"/market-stats/stats-charts-dax"}>Charts DAX</NavLink>

          <NavLink to={"/market-stats/stats-table-es"}>Table ES</NavLink>
          <NavLink to={"/market-stats/stats-table-nq"}>Table NQ</NavLink>
          <NavLink to={"/market-stats/stats-charts-es"}>Charts ES</NavLink>
          <NavLink to={"/market-stats/stats-charts-nq"}>Charts NQ</NavLink>
        </>
      )}

      {getFeature("backtests") && (
        <>
          <NavLink to={"/market-stats/backtests"}>Backtests</NavLink>
          <NavLink to={"/market-stats/backtests-sanya"}>
            Backtests Sanya
          </NavLink>
          <NavLink to={"/market-stats/backtests-tapok"}>
            Backtests Tapok
          </NavLink>
          <NavLink to={"/market-stats/backtests-tapok-US500"}>
            Backtests Tapok US500
          </NavLink>
        </>
      )}
    </div>
  );
};

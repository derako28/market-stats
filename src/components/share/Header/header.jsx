import { NavLink } from "react-router-dom";
import { getEnv } from "../../../utils/getEnv.js";
import { getFeature } from "../../../utils/getFeature.js";

export const Header = () => {
  return (
    <div className={"flex gap-8 text-gray-300 p-4 mb-8"}>
      {getFeature("dax") && (
        <>
          <NavLink to={"/market-stats/stats-table-new"}>Table New</NavLink>

          <NavLink to={"/market-stats/stats-charts-2024"}>Charts 2024</NavLink>
        </>
      )}

      <NavLink to={"/market-stats/stats-table-dax"}>Table DAX</NavLink>
      <NavLink to={"/market-stats/stats-charts-dax"}>Charts DAX</NavLink>

      <NavLink to={"/market-stats/stats-table-es"}>Table ES</NavLink>
      <NavLink to={"/market-stats/stats-table-nq"}>Table NQ</NavLink>
      <NavLink to={"/market-stats/stats-charts-es"}>Charts ES</NavLink>
      <NavLink to={"/market-stats/stats-charts-nq"}>Charts NQ</NavLink>

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

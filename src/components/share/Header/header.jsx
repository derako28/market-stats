import { NavLink } from "react-router-dom";
import { getEnv } from "../../../utils/getEnv.js";
import { getFeature } from "../../../utils/getFeature.js";

export const Header = () => {
  return (
    <div className={"flex gap-4 text-gray-300 p-4 mb-2"}>
      {getFeature("newStatistics") && (
        <>
          <NavLink to={"/dax"}>DAX</NavLink>
          <NavLink to={"/es"}>ES</NavLink>
          <NavLink to={"/nq"}>NQ</NavLink>
          <NavLink to={"/ym"}>YM</NavLink>
        </>
      )}

      {getFeature("Overnight") && (
        <>
          <NavLink to={"/nq-overnight"}>NQ Overnight</NavLink>
          <NavLink to={"/es-overnight"}>ES Overnight</NavLink>
        </>
      )}

      {getFeature("DAX_VWAP") && (
        <>
          <NavLink to={"/dax-vwap"}>DAX VWAP</NavLink>
        </>
      )}

      {getFeature("dax") && (
        <>
          <NavLink to={"/stats-table-new"}>Table New</NavLink>

          <NavLink to={"/stats-table-tpo-dax"}>Table DAX TPO</NavLink>
        </>
      )}

      {getFeature("oldStatistics") && (
        <>
          <NavLink to={"/stats-table-dax"}>Table DAX</NavLink>
          <NavLink to={"/stats-charts-dax"}>Charts DAX</NavLink>

          <NavLink to={"/stats-table-es"}>Table ES</NavLink>
          <NavLink to={"/stats-table-nq"}>Table NQ</NavLink>
          <NavLink to={"/stats-charts-es"}>Charts ES</NavLink>
          <NavLink to={"/stats-charts-nq"}>Charts NQ</NavLink>
        </>
      )}

      {getFeature("backtests") && (
        <>
          <NavLink to={"/backtests"}>Backtests</NavLink>
          {/*<NavLink to={"/backtests-sanya"}>Backtests Sanya</NavLink>*/}
          {/*<NavLink to={"/backtests-tapok"}>Backtests Tapok</NavLink>*/}
          <NavLink to={"/backtests-tapok-US500"}>Backtests Tapok US500</NavLink>
        </>
      )}

      {getFeature("weeklyStatistics") && (
        <>
          <NavLink to={"/dax-weekly"}>DAX Weakly</NavLink>
        </>
      )}
    </div>
  );
};

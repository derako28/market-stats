import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <div className={"flex gap-8 text-gray-300 p-4 mb-8"}>
      {/*<NavLink to={"/market-stats/stats-table"}>Table</NavLink>*/}
      {/*<NavLink to={"/market-stats/stats-table-new"}>Table New</NavLink>*/}
      {/*<NavLink to={"/market-stats/stats-charts"}>Charts 2023</NavLink>*/}
      {/*<NavLink to={"/market-stats/stats-charts-2024"}>Charts 2024</NavLink>*/}
      <NavLink to={"/market-stats/stats-charts-es"}>Charts ES</NavLink>
      <NavLink to={"/market-stats/stats-charts-nq"}>Charts NQ</NavLink>
      {/*<NavLink to={"/market-stats/backtests"}>Backtests</NavLink>*/}
      {/*<NavLink to={"/market-stats/backtests-sanya"}>Backtests Sanya</NavLink>*/}
      {/*<NavLink to={"/market-stats/backtests-tapok"}>Backtests Tapok</NavLink>*/}
      {/*<NavLink to={"/market-stats/backtests-tapok-US500"}>*/}
      {/*  Backtests Tapok US500*/}
      {/*</NavLink>*/}
    </div>
  );
};

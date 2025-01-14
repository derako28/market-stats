import { getStatistic } from "../utils.js";

export const Statistic = ({ data }) => {
  const statistic = getStatistic(data);

  return (
    <>
      <div className={"flex gap-8"}>
        <div>Positions: {data.length}</div>
        <div>Win Rate: {statistic.winRate}%</div>
        <div>Profit: {statistic.profit}RR</div>
        <div>Max Lose Streak: {statistic.maxLose}</div>
        <div>Max Drawdown: {statistic.maxDrawdown}</div>
      </div>
    </>
  );
};

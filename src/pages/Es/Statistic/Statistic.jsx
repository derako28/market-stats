import css from "./statistic.module.scss";
export const Statistic = ({ data }) => {
  return (
    <div className={"px-4 flex my-8"}>
      {<div className={css.root}>Days: {data.length}</div>}
    </div>
  );
};

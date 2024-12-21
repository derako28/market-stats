export const Statistic = ({ data }) => {
  return (
    <div className={"px-4 flex"}>
      {<div className={"bg-gray-600"}>{data.length}</div>}
    </div>
  );
};

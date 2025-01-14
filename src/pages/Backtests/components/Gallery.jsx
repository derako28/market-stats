export const Gallery = ({ data }) => {
  return (
    <>
      <div>
        {data.map((item) => (
          <>
            <img src={item.screen} alt="" />
          </>
        ))}
      </div>
    </>
  );
};

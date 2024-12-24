import css from "./market-profile.module.scss";
import cn from "classnames";

const PriceLevel = ({ price, segments, poc, vah, val }) => (
  <div className="price-level">
    <span className="tpo-count">
      <div className={"flex"}>
        {segments.map((seg) => (
          <div
            className={cn(
              css.block,
              price === poc && css.poc,
              (price <= val || price >= vah) && css.outsideVa,
            )}
            key={seg.letter}
          >
            {seg.letter}
          </div>
        ))}
      </div>
    </span>
  </div>
);

export const MarketProfileChart = ({ data }) => {
  const { date, poc, vah, val, profile } = data;

  return (
    <div className="market-profile-chart">
      <div key={date} className={"flex justify-around flex-auto gap-8"}>
        <div className="profile flex-auto">
          {profile.map(({ price, segments }) => (
            <PriceLevel
              key={price}
              price={price}
              segments={segments}
              poc={poc}
              vah={vah}
              val={val}
            />
          ))}
        </div>
        <div className="summary flex-auto">
          <div>
            <strong>Date:</strong> {date}
          </div>
          <div>
            <strong>POC:</strong> {poc}
          </div>
          <div>
            <strong>VAH:</strong> {vah}
          </div>
          <div>
            <strong>VAL:</strong> {val}
          </div>
        </div>
      </div>
    </div>
  );
};

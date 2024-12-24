import css from "./market-profile.module.scss";
import cn from "classnames";
import { buildMarketProfile, groupDataByDate } from "../utils.js";

// Функция для группировки данных по дням

// Компонент для отображения уровня цены
const PriceLevel = ({ price, segments, poc, vah, val }) => {
  const backgroundColor =
    price === poc
      ? "orange"
      : price <= vah && price >= val
        ? "lightblue"
        : "lightgray";

  return (
    <div className="price-level">
      {/*<div className="price-label">{price.toFixed(2)}</div>*/}
      {/*<div*/}
      {/*  className="tpo-bar"*/}
      {/*  style={{ width: `${segments.length * 10}px`, backgroundColor }}*/}
      {/*/>*/}
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
      </span>{" "}
      {/* Отображаем буквы */}
    </div>
  );
};

export const MarketProfileChartList = ({
  data,
  valueAreaPercent = 68,
  tpr = 5,
}) => {
  const groupedData = groupDataByDate(data); // Группируем данные по датам

  console.log("#groupedData: ", groupedData);

  return (
    <div className="market-profile-chart flex flex-wrap gap-14">
      {/*<h3>Market Profile Chart</h3> */}
      {Object.keys(groupedData).map((date) => {
        const { poc, vah, val, profile } = buildMarketProfile(
          groupedData[date],
          valueAreaPercent,
          tpr,
        );
        return (
          <div key={date} className={""}>
            <h4>{date}</h4>
            <div className="summary">
              <strong>POC:</strong> {poc} <br />
              <strong>VAH:</strong> {vah} <br />
              <strong>VAL:</strong> {val}
            </div>
            <div className="profile">
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
          </div>
        );
      })}
    </div>
  );
};

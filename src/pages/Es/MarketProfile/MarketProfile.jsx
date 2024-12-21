const groupDataByDate = (data) => {
  const groupedData = {};

  data.forEach(({ time, high, low }) => {
    const date = new Date(time).toLocaleDateString(); // Получаем только дату (без времени)
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push({ high, low });
  });

  return groupedData;
};

const calculateTPOProfile = (data, priceStep) => {
  const profile = new Map();

  data.forEach(({ high, low }) => {
    let price = Math.floor(low / priceStep) * priceStep;
    while (price <= high) {
      profile.set(price, (profile.get(price) || 0) + 1);
      price += priceStep;
    }
  });

  return Array.from(profile.entries())
    .map(([price, tpo]) => ({ price: parseFloat(price), tpo }))
    .sort((a, b) => b.price - a.price);
};

const calculateValueArea = (profileArray, valueAreaPercent) => {
  const totalTPOs = profileArray.reduce((sum, { tpo }) => sum + tpo, 0);
  const valueAreaThreshold = (valueAreaPercent / 100) * totalTPOs;

  let valueAreaTPOs = 0;
  let poc = null;
  let vah = null;
  let val = null;

  profileArray.forEach(({ tpo }, index) => {
    if (poc === null || tpo > profileArray[poc].tpo) {
      poc = index;
    }

    if (valueAreaTPOs < valueAreaThreshold) {
      valueAreaTPOs += tpo;
      if (vah === null) vah = index;
      val = index;
    }
  });

  return {
    poc: profileArray[poc]?.price,
    vah: profileArray[vah]?.price,
    val: profileArray[val]?.price,
  };
};

const buildMarketProfile = (data, valueAreaPercent = 68, tpr = 5) => {
  const priceStep = tpr * 0.25;
  const profileArray = calculateTPOProfile(data, priceStep);
  const { poc, vah, val } = calculateValueArea(profileArray, valueAreaPercent);

  return { poc, vah, val, profile: profileArray };
};

const generateAlphabetArray = (n) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = [];

  for (let i = 0; i < n; i++) {
    result.push(alphabet[i]);
  }

  return result;
};

const PriceLevel = ({ price, tpo, poc, vah, val }) => {
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
      {/*  style={{ width: `${tpo * 10}px`, backgroundColor }}*/}
      {/*/>*/}
      {generateAlphabetArray(tpo).map((item) => (
        <span>{item}</span>
      ))}
      {/*<span className="tpo-count">{tpo}</span>*/}
    </div>
  );
};

export const MarketProfileChart = ({
  data,
  valueAreaPercent = 68,
  tpr = 5,
}) => {
  const groupedData = groupDataByDate(data); // Группируем данные по датам

  return (
    <div className="market-profile-chart">
      <h3>Market Profile Chart</h3>
      {Object.keys(groupedData).map((date) => {
        const { poc, vah, val, profile } = buildMarketProfile(
          groupedData[date],
          valueAreaPercent,
          tpr,
        );
        return (
          <div key={date}>
            <div className={"my-10"}>
              <h4>{date}</h4>
            </div>
            {/*<div className="summary">*/}
            {/*  <strong>POC:</strong> {poc} <br />*/}
            {/*  <strong>VAH:</strong> {vah} <br />*/}
            {/*  <strong>VAL:</strong> {val}*/}
            {/*</div>*/}
            <div className="profile">
              {profile.map(({ price, tpo }) => (
                <PriceLevel
                  key={price}
                  price={price}
                  tpo={tpo}
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

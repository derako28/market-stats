import dataES from "../../Data-TW/ES.json";
import dataNQ from "../../Data-TW/NQ.json";
import dataYM from "../../Data-TW/YM.json";
import {
  compileMarketProfileByDays,
  prepareData,
  segmentData,
  setOpeningType,
} from "../../utils/prepareData.js";
import { onFilterData } from "./utils.js";

export const getData = (dataFilter) => {
  const ticker = dataFilter?.ticker;
  let data = dataES;

  switch (ticker) {
    case "NQ": {
      data = dataNQ;
      break;
    }
    case "ES": {
      data = dataES;
      break;
    }

    case "YM": {
      data = dataYM;
      break;
    }

    default:
      data = dataES;
  }

  const dataNew = segmentData(
    setOpeningType(
      prepareData(compileMarketProfileByDays(data, 68, 5, 0.25)),
    ).reverse(),
  );

  return onFilterData(dataNew, dataFilter);
};

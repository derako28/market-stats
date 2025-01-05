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
      data = segmentData(
        setOpeningType(
          prepareData(compileMarketProfileByDays(dataNQ, 68, 5, 4)),
        ).reverse(),
      );
      break;
    }
    case "ES": {
      data = segmentData(
        setOpeningType(
          prepareData(compileMarketProfileByDays(dataES, 68, 5, 0.25)),
        ).reverse(),
      );
      break;
    }

    case "YM": {
      data = segmentData(
        setOpeningType(
          prepareData(compileMarketProfileByDays(dataYM, 68, 20)),
        ).reverse(),
      );
      break;
    }

    default:
      data = segmentData(
        setOpeningType(
          prepareData(compileMarketProfileByDays(v, 68, 5, 0.25)),
        ).reverse(),
      );
  }

  return onFilterData(data, dataFilter);
};

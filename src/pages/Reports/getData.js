import dataES from "../../Data-TW/ES.json";
import dataNQ from "../../Data-TW/NQ.json";
import dataYM from "../../Data-TW/YM.json";
import dataDAX from "../../Data-TW/FDAX.json";

import {
  compileMarketProfileByDays,
  prepareData,
  setOpeningType,
} from "../../utils/prepareData.js";
import { filterByThreshold, onFilterData } from "./utils.js";

export const getData = (dataFilter) => {
  const ticker = dataFilter?.ticker;
  let data = dataES;

  switch (ticker) {
    case "ES": {
      data = setOpeningType(
        prepareData(compileMarketProfileByDays(dataES, 68, 5, 0.25)).reverse(),
      );
      break;
    }

    case "NQ": {
      data = setOpeningType(
        prepareData(compileMarketProfileByDays(dataNQ, 68, 5, 4)).reverse(),
      );
      break;
    }

    case "YM": {
      data = setOpeningType(
        prepareData(compileMarketProfileByDays(dataYM, 68, 20)).reverse(),
      );
      break;
    }

    case "DAX": {
      data = setOpeningType(
        prepareData(compileMarketProfileByDays(dataDAX, 68, 5, 1)).reverse(),
      );
      break;
    }

    default:
      data = setOpeningType(
        prepareData(compileMarketProfileByDays(dataES, 68, 5, 0.25)).reverse(),
      );
  }

  return filterByThreshold(onFilterData(data, dataFilter));
};

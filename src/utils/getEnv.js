export const getEnv = () => {
  switch (window.location.origin) {
    case "http://localhost:3000":
      return {
        env: "dev",
        features: {
          dax: true,
          backtests: false,
          nq: false,
          es: false,
          oldStatistics: false,
          newStatistics: true,
          DAX_VWAP: true,
        },
      };

    default:
      return {
        env: "deploy",
        features: {
          dax: false,
          backtests: false,
          es: false,
          nq: false,
          oldStatistics: false,
          newStatistics: true,
          DAX_VWAP: false,
        },
      };
  }
};

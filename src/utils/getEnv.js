export const getEnv = () => {
  switch (window.location.origin) {
    case "http://localhost:3000":
      return {
        env: "dev",
        features: {
          TWData: true,
          dax: true,
          backtests: true,
          nq: true,
          es: true,
          newStatistics: true,
          oldStatistics: true,
        },
      };

    default:
      return {
        env: "deploy",
        features: {
          TWData: false,
          dax: false,
          backtests: false,
          es: false,
          nq: false,
          newStatistics: true,
          oldStatistics: false,
        },
      };
  }
};

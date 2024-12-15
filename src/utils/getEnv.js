export const getEnv = () => {
  switch (window.location.origin) {
    case "https://derako28.github.io/market-stats/":
      return {
        env: "deploy",
        features: {
          dax: false,
          backtests: false,
          nq: true,
          es: true,
        },
      };

    default:
      return {
        env: "dev",
        features: {
          dax: true,
          backtests: true,
          es: true,
          nq: true,
        },
      };
  }
};

export const getEnv = () => {
  switch (window.location.origin) {
    case "http://localhost:3000":
      return {
        env: "dev",
        features: {
          dax: true,
          backtests: true,
          nq: true,
          es: true,
        },
      };

    default:
      return {
        env: "deploy",
        features: {
          dax: false,
          backtests: false,
          es: true,
          nq: true,
        },
      };
  }
};

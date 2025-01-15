export const getEnv = () => {
  const url = window.location.href;
  const module = localStorage.getItem("module");

  if (
    (url.includes("module") && url.includes("overnight")) ||
    module === "overnight"
  ) {
    localStorage.setItem("module", "overnight");

    return {
      env: "overnight",
      features: {
        Overnight: true,
      },
    };
  }

  switch (window.location.origin) {
    case "http://localhost:3000":
      return {
        env: "dev",
        features: {
          dax: false,
          backtests: false,
          nq: false,
          es: false,
          oldStatistics: false,
          newStatistics: true,
          DAX_VWAP: false,
          Reports: true,
          Overnight: true,
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
          Reports: false,
          Overnight: false,
        },
      };
  }
};

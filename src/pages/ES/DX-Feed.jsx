import {
  DXLinkWebSocketClient,
  DXLinkFeed,
  FeedDataFormat,
} from "@dxfeed/dxlink-api";

export const DXFeed = () => {
  const client = new DXLinkWebSocketClient();
  client.connect("wss://demo.dxfeed.com/dxlink-ws");

  const feed = new DXLinkFeed(client, "AUTO");
  feed.configure({
    acceptAggregationPeriod: 30,
    acceptDataFormat: FeedDataFormat.FULL,
    acceptEventFields: {
      Quote: ["eventSymbol", "askPrice", "bidPrice", "open", "close"],
      Candle: ["eventSymbol", "open", "close", "high", "low", "volume"],
    },
  });

  const sub1 = {
    type: "Quote",
    symbol: "AAPL",
  };

  feed.addSubscriptions(sub1);

  feed.addEventListener((events) => {
    // do something with events
  });

  return <>DXFeed</>;
};

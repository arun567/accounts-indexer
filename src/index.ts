import * as Sentry from "@sentry/node";
import cluster from "node:cluster";
import process from "node:process";
import Batcher from "./batcher";
import dbConnect from "./db";
import { sleep } from "./utils";

require("./sentry");

async function start() {
  await dbConnect();

  while (true) {
    // Make sure current height is up to date
    const batcher = new Batcher("Accounts Indexer");
    try {
      await batcher.start();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
    await sleep(10000);
    // await sleep(1800000);
  }
}

interface ChainInfo {
  chainId: string;
  startHeight: number;
}

const CHAIN_INFO: ChainInfo[] = [
  // { chainId: "juno-1", startHeight: 0 },
  { chainId: "axelar-dojo-1", startHeight: 0 },
  // { chainId: "stargaze-1", startHeight: 0 },
  // { chainId: "secret-4", startHeight: 0 },
  // { chainId: "osmosis-1", startHeight: 0 },
  // { chainId: "injective-1", startHeight: 0 },
  // { chainId: "kaiyo-1", startHeight: 0 },
  // { chainId: "galileo-3", startHeight: 0 },
  // { chainId: "atlantic-2", startHeight: 0 },
];

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  CHAIN_INFO.forEach(({ chainId, startHeight }) => {
    cluster.fork({ CHAIN_ID: chainId, START_HEIGHT: startHeight });
  });

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid}-${process.env.CHAIN_ID} started`);
  start();
}

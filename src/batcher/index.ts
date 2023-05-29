import { 
  callGetAPI,
  getReportConfig,
  updateReportConfig
} from "../services";
import { scanningTxs, captureAccounts } from "../processors";
import { updateReportsData } from "../services/ReportsData";
import { formatDate } from "../utils";
import { QueryParamsAccs, QueryParamsTxs } from "../types";

/**
 * A class used to fetch accounts and txs in batches and process them using a processing handler
 */
export default class Batcher {
  paginationLimitAccs: number = 1000;
  paginationLimitTxs: number = 100;
  currHeight: number = parseInt(process.env.START_HEIGHT ?? "0");
  currAccsCount: number = 0;
  label: string;

  constructor(
    label: string
  ) {
    this.label = label;
  }

  /**
   * Get all accounts on a chain - This fetching is based on pagination
   */
  async getAccs(fetchCount: boolean, lcdBaseUrl: string, offset: number) {
    const qs: QueryParamsAccs = {
      "pagination.offset": fetchCount ? 0 : offset,
      "pagination.limit": fetchCount ? 1 : this.paginationLimitAccs,
      "pagination.count_total": fetchCount ? "true" : "false",
      "pagination.reverse": "false",
    };
    console.log(`accounts fetching pagination: `, qs);
    const url = "cosmos/auth/v1beta1/accounts";
    return await callGetAPI(lcdBaseUrl, url, qs);
  }

  /**
   * Get all txs on a chain based on event of txs less than the latest height - This fetching is based on pagination
   */
  async getTxs(lcdBaseUrl: string, height: number, offset: number) {
    const qs: QueryParamsTxs = {
      events: `tx.height<=${height}`,
      "pagination.offset": offset,
      "pagination.limit": this.paginationLimitTxs,
      "pagination.reverse": "true",
      "order_by": "ORDER_BY_DESC",
    };
    // console.log(`getTxs qs: `, qs)
    const url = "cosmos/tx/v1beta1/txs";
    return await callGetAPI(lcdBaseUrl, url, qs);
  }

  /**
   * Get the latest block on the chain
   */
  async getLatestBlock(lcdBaseUrl: string) {
    const qs = {};
    const url = "cosmos/base/tendermint/v1beta1/blocks/latest";
    return await callGetAPI(lcdBaseUrl, url, qs);
  }

  /**
   * Start fetching accounts and transactions up to the total count and process them using the defined processor
   * @returns
   */
  async start() {
    const chainId: string = process.env.CHAIN_ID ?? "uni-6";
    const chainConfig = await getReportConfig(chainId);
    const lcdBaseUrl = chainConfig?.lcd!;
    console.log(`[${chainId}] lcdBaseUrl: ${lcdBaseUrl}`);

    const latestBlock = await this.getLatestBlock(lcdBaseUrl);
    const latestBlockHeight = parseInt(latestBlock.block.header.height);
    console.log(`${chainId} Latest Block Height :`, latestBlockHeight);
    this.currHeight = chainConfig?.lastUpdatedHeight!;

    if (this.currHeight >= latestBlockHeight) {
      return;
    }

    const latestAccs = await this.getAccs(true, lcdBaseUrl, 0);
    const latestAccountsCount = latestAccs.pagination.total;
    this.currAccsCount = chainConfig?.latestAccountsCount!;

    console.log(
      `[${chainId} - ${this.label
      }] Fetching accounts from ${this.currAccsCount} to ${latestAccountsCount}`
    );
    
    //Capturing accounts page by page
    const remainingAccsCount = latestAccountsCount - this.currAccsCount;
    let currentAccsPage = 0;
    const totalAccsPages = Math.ceil(remainingAccsCount / this.paginationLimitAccs);
    while (totalAccsPages > 0 && currentAccsPage <= totalAccsPages) {
      const accsOffset = (currentAccsPage * this.paginationLimitAccs);
      const batch = await this.getAccs(false, lcdBaseUrl, accsOffset);
      await captureAccounts(batch, chainId);
      currentAccsPage++;
    }
    updateReportConfig(chainId, { 
      latestAccountsCount,
      lastUpdatedHeight: latestBlockHeight,
      countUpdatedTimestamp: new Date().toISOString()
    });
    console.log(`[${chainId} - Completed capturing accounts`);

    const currDate = new Date().toISOString();
    let currUTCDate = new Date(currDate.slice(0, 10));

    //Updating totalUsersCount in reportsdata collection for the current date
    updateReportsData(chainId, formatDate(currUTCDate), {
      totalUsersCount: latestAccountsCount,
      lastUpdatedHeight: latestBlockHeight,
      countUpdatedTimestamp: (new Date()).toISOString()
    });

    console.log(`[${chainId}] - Start scanning Txs for date: ${currUTCDate.toJSON().slice(0, 10)}`);
    let continueScanningTxs: boolean = true;
    let txsOffset: number = 0;
    while (continueScanningTxs) {
      const txsBatch = await this.getTxs(lcdBaseUrl, latestBlockHeight, txsOffset);
      continueScanningTxs = await scanningTxs(chainId, txsBatch, currUTCDate, this.currHeight);
      txsOffset += this.paginationLimitTxs;
    }
    console.log(`[${chainId}] - Completed scanning Txs for date: ${currUTCDate.toJSON().slice(0, 10)} and currHeight: ${this.currHeight}`);
  }
}

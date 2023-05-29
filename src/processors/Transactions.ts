import {
  getAccountByAddress,
  newAcc,
  updateAccount,
} from "../services";
import { updateReportsData } from "../services/ReportsData";
import { formatDate } from "../utils";

/**
 * A function for scanning the transactions and update daily active users count for the current date
 * @param batch
 */
export async function scanningTxs(chainId: string, batch: any, currDate: Date, currentHeight: number): Promise<boolean> {
  const txsResp = batch?.tx_responses ?? [];
  let continueScanning = true;
  for (let i = 0; i < txsResp.length; i++) {
    const txHeight = txsResp[i].height;
    if (currentHeight >= txHeight) {
      continueScanning = false;
      break;
    }
    const txHash = txsResp[i].txhash;
    const txTimestamp = txsResp[i].timestamp;
    const txDate = new Date(Date.parse(txTimestamp));
    if (currDate > txDate) {
      continueScanning = false;
      break;
    }
    const events = txsResp[i]?.logs[0]?.events ?? [];
    let accAddress: string = '';
    for (let i = 0; i < events.length; i++) {
      if (events[i].type == 'message') {
        for (let k = 0; k < events[i].attributes.length; k++) {
          if (events[i].attributes[k].key == 'sender') accAddress = events[i].attributes[k].value
        }
      }
    }
    if (accAddress == '') {
      continue;
    }
    try {
      const accData = await getAccountByAddress(accAddress, chainId);
      let updateReport = false;
      if (!accData) {
        newAcc({
          address: accAddress,
          chainId,
          latestTxHash: txHash,
          latestTxTimestamp: txTimestamp,
          latestTxHeight: txHeight,
        });
        updateReport = true;
      } else {
        if (accData?.lastUpdatedTxHeight == 0 || accData?.lastUpdatedTxHeight! < txHeight) {
          updateAccount(accAddress, chainId, {
            lastUpdatedTxHash: txHash,
            lastUpdatedTxTimestamp: txTimestamp,
            lastUpdatedTxHeight: txHeight,
          });
          updateReport = true;
        }
      }
      if (updateReport) {
        //report data update
        updateReportsData(chainId, formatDate(currDate), {
          $inc: { activeUsersCount: 1 },
          countUpdatedTimestamp: (new Date()).toISOString()
        });
      }
    } catch (error: any) {
      const { message } = error as Error;
      console.error(message);
    }
  }
  return continueScanning;
}


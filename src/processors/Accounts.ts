import { saveAccounts } from "../services";
import { AccountsResponse, AccInfo, Account } from "../types";

/**
 * A function for the Accounts capturing, sifts through accounts before adding them to the DB
 * @param batch
 */
export async function captureAccounts(batch: AccountsResponse, chainId: string) {
  let accounts: Array<AccInfo>= [];
  const accsResp = batch?.accounts ?? [];
  for (let i = 0; i < accsResp.length; i++) {
    const baseAccount1 = accsResp[i];
    let { address } = baseAccount1;

    if (!address) { 
      const baseAccount2 = accsResp[i].base_account ?? undefined;
      if(baseAccount2) address = baseAccount2.address;
    };
    if (!address) { 
      const baseAccount3 = accsResp[i].base_vesting_account.base_account ?? undefined;
      if(baseAccount3) address = baseAccount3.address;
    };

    if (!address) {
      console.log(`Not a valid Account - ${accsResp[i]}`);
    } else {
      accounts.push(
        {
          address: address,
          chainId: chainId,
          lastUpdatedTxHash: "",
          lastUpdatedTxHeight: 0,
          lastUpdatedTxTimestamp: "",
        }
      );
    }
  }
  if (accounts.length > 0) {
    saveAccounts(accounts);
  }
  return;
}

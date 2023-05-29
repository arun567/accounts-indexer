export interface AccInfo {
  address: string;
  chainId: string;
  lastUpdatedTxHash: string;
  lastUpdatedTxHeight: number;
  lastUpdatedTxTimestamp: string;
}

export type CaptureAccsFunc = (batch: AccountsResponse, chainId: string) => Promise<void>;

export interface AccountsResponse {
  accounts: Account[];
  pagination: AccountsPagination;
}

export interface Account extends BaseAccount, ModuleAccount, VestingAccount,  InjectiveAccount {
  '@type': string;
}

export interface VestingAccount {
  base_vesting_account: BaseVestingAccount
}

export interface InjectiveAccount {
  base_account: BaseAccount
}

export interface BaseAccount {
  address: string;
  pub_key: JSON | null;
  account_number: string;
  sequence: string;
}

export interface BaseVestingAccount {
  base_account: BaseAccount
}

export interface ModuleAccount {
  base_account: BaseAccount
}

export interface AccountsPagination {
  next_key: string;
  total: string;
}

export interface QueryParamsAccs { 
  "pagination.offset": number,
  "pagination.limit": number,
  "pagination.count_total": string,
  "pagination.reverse": string,
};

export interface QueryParamsTxs { 
"events": string,
"pagination.offset": number,
"pagination.limit": number,
"pagination.reverse": string,
"order_by": string,
};
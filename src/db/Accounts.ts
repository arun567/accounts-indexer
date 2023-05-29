import mongoose, { Schema } from "mongoose";

const Accounts = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  chainId: {
    type: String,
    required: true,
  },
  lastUpdatedTxHash: {
    type: String,
  },
  lastUpdatedTxTimestamp: {
    type: String,
  },
  lastUpdatedTxHeight: {
    type: Number,
  },
  totalAmountTxs: {
    type: Number,
  },
  // lastUpdatedBankTxTimestamp: {
  //   type: String,
  // },
  // totalAmountBankTxs: {
  //   type: Number,
  // },
  // lastUpdatedGovTxTimestamp: {
  //   type: String,
  // },
  // totalAmountGovTxs: {
  //   type: Number,
  // },
  // lastUpdatedWasmTxTimestamp: {
  //   type: String,
  // },
  // totalAmountWasmTxs: {
  //   type: Number,
  // },
});

Accounts.index({ address: 1, chainId: 1 }, { unique: true });
Accounts.index({ chainId: 1 });

export const accountsModel = mongoose.model("Accounts", Accounts);

export default accountsModel;

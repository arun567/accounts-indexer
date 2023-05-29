import mongoose, { Schema } from "mongoose";

const ReportConfigs = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  chainName: {
    type: String,
    required: true,
  },
  chainId: {
    type: String,
    required: true,
    unique: true,
  },
  lcd: {
    type: String,
    required: true,
  },
  chainType: {
    type: String,
    required: true,
  },
  latestAccountsCount: {
    type: Number,
  },
  countUpdatedTimestamp: {
    type: String,
  },
  lastUpdatedHeight: {
    type: Number,
  },
});

export const reportConfigsModel = mongoose.model("ReportConfigs", ReportConfigs);

export default reportConfigsModel;

import mongoose, { Schema } from "mongoose";

const ReportsData = new Schema({
  chainId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  activeUsersCount: {
    type: Number,
  },
  totalUsersCount: {
    type: Number,
  },
  countUpdatedTimestamp: {
    type: String,
  },
  lastUpdatedHeight: {
    type: Number,
  },
});

ReportsData.index({ chainId: 1, date: 1 }, { unique: true });
ReportsData.index({ chainId: 1 });

var collectionName = 'reportsdata'
export const reportsDataModel = mongoose.model("ReportsData", ReportsData, collectionName);

export default reportsDataModel;

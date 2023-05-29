import { reportsDataModel } from "../db";

export const getReportsData = async (chainId: string) => await reportsDataModel.findOne({ chainId });

export const updateReportsData = async (chainId: string, date: string, data: any) => await reportsDataModel.findOneAndUpdate({ chainId, date }, data, {upsert: true, new: true});

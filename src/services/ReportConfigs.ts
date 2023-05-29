import { reportConfigsModel } from "../db";

export const getReportConfig = async (chainId: string) => await reportConfigsModel.findOne({ chainId });

export const updateReportConfig = async (chainId: string, data: any) => await reportConfigsModel.findOneAndUpdate({ chainId }, data);

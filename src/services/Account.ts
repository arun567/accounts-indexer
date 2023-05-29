import { accountsModel } from "../db";

export const getAccountsByChainId = async (chainId: string) => await accountsModel.find({ chainId });

export const getAccountByAddress = async (address: string, chainId: string) => await accountsModel.findOne({ address, chainId });

export const newAcc = async (data: any) => await accountsModel.collection.insertOne(data);

export const saveAccounts = async (accs: any) => await accountsModel.insertMany(accs, { ordered: false }).catch(err=>{
  if (err.code != 11000) {
    const { message } = err as Error;
    console.error(message);
  }
});

export const updateAccount = async (address: string, chainId: string, data: any) => await accountsModel.findOneAndUpdate({ address, chainId }, data);

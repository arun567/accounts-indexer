import mongoose from "mongoose";
import clc from "cli-color";
export * from "./Accounts";
export * from "./ReportConfigs";
export * from "./ReportsData";

const DB_URI = "mongodb://andromedauser:Xcube%40567@localhost:27017/local-andromeda-indexer?authMechanism=DEFAULT&authSource=local-andromeda-indexer";

async function connect() {
  console.info(clc.yellow(`Connecting to Database: ${DB_URI}`));
  await mongoose.connect(DB_URI);
  console.info(clc.green("Connected to database"));

  require("./Accounts");
  require("./ReportConfigs");
  require("./ReportsData");
}

export default connect;

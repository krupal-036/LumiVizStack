import mongoose from "mongoose";
import "dotenv/config";

const connectionCache = {};

const createDbConnection = (dbName) => {
  if (!dbName) throw new Error("Database name is missing in environment variables");

  if (connectionCache[dbName]) {
    return connectionCache[dbName];
  }

  const uri = `${process.env.MONGO_URI}/${dbName}`;
  
  const connection = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 5000, 
    bufferCommands: false, 
  });

  connection.on("connected", () => console.log(`Connected to: ${dbName}`));
  connection.on("error", (err) => console.error(`${dbName} DB Error:`, err.message));

  connectionCache[dbName] = connection;
  return connection;
};

export const usersConnection = createDbConnection(process.env.DB_USERS);
export const adminConnection = createDbConnection(process.env.DB_ADMIN);
export const vizContextConnection = createDbConnection(process.env.DB_VIZ_CONTEXT);
export const vizHistoryConnection = createDbConnection(process.env.DB_VIZ_HISTORY);

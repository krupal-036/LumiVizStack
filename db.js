import mongoose from "mongoose";
import "dotenv/config";

const createDbConnection = (dbName) => {
  try {
    const uri = `${process.env.MONGO_URI}/${dbName}`;
    const connection = mongoose.createConnection(uri);

    connection.on("connected", () =>
      console.log(`Connected to Database: ${dbName}`),
    );

    connection.on("error", (err) =>
      console.error(`${dbName} DB Error:`, err.message),
    );

    return connection;
  } catch (error) {
    console.error(
      `Could not initialize connection for ${dbName}:`,
      error.message,
    );
    process.exit(1);
  }
};

const usersConnection = createDbConnection(process.env.DB_USERS);
const adminConnection = createDbConnection(process.env.DB_ADMIN);
const vizContextConnection = createDbConnection(process.env.DB_VIZ_CONTEXT);
const vizHistoryConnection = createDbConnection(process.env.DB_VIZ_HISTORY);

export {
  usersConnection,
  adminConnection,
  vizContextConnection,
  vizHistoryConnection,
};

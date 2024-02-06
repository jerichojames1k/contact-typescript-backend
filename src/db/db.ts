//import logger from "@shared/Logger";
import * as dotenv from 'dotenv';
// get the client
const mysql = require("mysql2/promise");
const bluebird = require("bluebird");
// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
  Promise: bluebird, // Optional: Use bluebird for promises
  connectionLimit: 10, // Adjust the limit based on your requirements
});
dotenv.config();
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    throw new Error(`Error getting database connection: ${error.message}`);
  }
}
// Function to release a connection back to the pool
export function releaseConnection(connection: { release: () => void }) {
  connection.release();
}



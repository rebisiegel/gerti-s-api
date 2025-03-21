import mysql from "mysql2/promise.js";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "gertis",
  port: 3306,
});

export default pool;

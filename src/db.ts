import mysql from "mysql2/promise";

export default mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "habitier",
});

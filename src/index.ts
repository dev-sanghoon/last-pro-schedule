import express from "express";
import dotenv from "dotenv";
import users from "./users/controllers";
import mysql from "mysql2/promise";

dotenv.config();

export const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "habitier",
});

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Habitier");
});

app.use("/users", users);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`server on ${process.env.PORT}`);
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import monitor from "express-status-monitor";
import pino from "pino-http";
import users from "./users/controllers";
import "./db";

const app = express();

app.use(monitor());
app.use(
  pino({
    level: "error",
    transport: {
      target: "pino/file",
      options: {
        destination: `${__dirname}/log`,
        mkdir: true,
      },
    },
  })
);
app.use(express.json());
app.use(cookieParser());

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

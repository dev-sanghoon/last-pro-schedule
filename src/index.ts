import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("done");
});

app.listen(process.env.PORT, () => {
  console.log(`server on ${process.env.PORT}`);
});

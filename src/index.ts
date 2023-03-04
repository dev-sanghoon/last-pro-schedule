import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Habitier");
});

app.post("/users", (req, res) => {
  res.send("register");
});

app.delete("/users", (req, res) => {
  res.send("unregister");
});

app.post("/users/login", (req, res) => {
  res.send("login");
});

app.post("/users/logout", (req, res) => {
  res.send("logout");
});

app.post("/users/check", (req, res) => {
  res.send("search registered & ID & password");
});

app.listen(process.env.PORT, () => {
  console.log(`server on ${process.env.PORT}`);
});

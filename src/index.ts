import express from "express";
import dotenv from "dotenv";
import users from "./users/controllers";

dotenv.config();

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

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as users from "./users/models";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ success: false, message: "Unexpected" });
      return;
    }
    if (!req.cookies.access_token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const verified = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET
    );
    if (typeof verified === "string" || typeof verified.email !== "string") {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const queried = await users.doExist(verified.email);
    if (!queried) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error on handling token" });
  }
}

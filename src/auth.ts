import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

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
    await jwt.verify(req.cookies.access_token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error on handling token" });
  }
}

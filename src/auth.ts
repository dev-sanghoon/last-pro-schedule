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
    await jwt.verify(req.cookies.access_token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error on handling token" });
  }
}

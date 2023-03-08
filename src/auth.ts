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
    const payload = await jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET
    );
    if (typeof payload !== "string" && typeof payload.email === "string") {
      req.currentUser = payload.email;
      next();
      return;
    }
    res.status(500).json({ success: false, message: "Unexpected" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error on handling token" });
  }
}

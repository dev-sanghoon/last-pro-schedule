import { Request, Response, NextFunction } from "express";
import users from "./models";

export function register(req: Request, res: Response, next: NextFunction) {
  try {
    const check = users.findIndex(({ email }) => email === req.body.email);
    if (check >= 0) {
      return res
        .status(400)
        .json({ success: false, message: "email already exists" });
    }
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    users.push(data);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function viewProfile(req: Request, res: Response, next: NextFunction) {}

export function unregister(req: Request, res: Response) {}

export function login(req: Request, res: Response) {}

export function logout(req: Request, res: Response) {}

export function findInfo(req: Request, res: Response) {}

import { Request, Response } from "express";
import users from "./models";

export function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    users.push({ email, password });
    res.status(200).send({
      success: true,
      message: `${email} successfully registered`,
    });
  } catch (err) {
    res.status(400).send(err);
  }
}

export function viewProfile(req: Request, res: Response) {}

export function unregister(req: Request, res: Response) {}

export function login(req: Request, res: Response) {}

export function logout(req: Request, res: Response) {}

export function findInfo(req: Request, res: Response) {}

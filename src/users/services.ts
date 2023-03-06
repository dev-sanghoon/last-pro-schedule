import { Request, Response } from "express";
import * as users from "./models";

export async function register(req: Request, res: Response) {
  try {
    const exist = await users.doExist(req.body.email);
    if (exist) {
      res.status(400).json({ success: false, message: "email already exists" });
      return;
    }
    const { email, password } = req.body;
    const name = req.body.name || req.body.email.split("@").shift();
    await users.createOne(email, password, name);
    res.status(200).json({ success: true, data: { email, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

// use temporarily on devs
export async function viewAllUsers(req: Request, res: Response) {
  try {
    const data = await users.findAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function viewProfile(req: Request, res: Response) {
  try {
    const queried = await users.findOne(req.params.email);
    if (!queried.length) {
      res.status(400).json({ success: false, message: "email does not exist" });
      return;
    }
    res.status(200).json({ success: true, data: queried.pop() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function unregister(req: Request, res: Response) {
  try {
    const check = await users.doExist(req.params.email);
    if (!check) {
      res.status(400).json({ success: false, message: "email does not exist" });
      return;
    }
    await users.deleteOne(req.params.email);
    res.status(200).json({ success: true, data: { email: req.params.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function login(req: Request, res: Response) {}

export function logout(req: Request, res: Response) {}

export function findInfo(req: Request, res: Response) {}

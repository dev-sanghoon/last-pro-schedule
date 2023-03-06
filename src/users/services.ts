import { Request, Response } from "express";
import {
  readUserByEmail,
  checkExistence,
  createUser,
  deleteUserByEmail,
  readAllUsers,
} from "./models";

export async function register(req: Request, res: Response) {
  try {
    const check = await checkExistence(req.body.email);
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: "email already exists" });
    }
    const { email, password } = req.body;
    const name = req.body.name || req.body.email.split("@").shift();
    await createUser(email, password, name);
    res.status(200).json({ success: true, data: { email, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

// use temporarily on devs
export async function viewAllUsers(req: Request, res: Response) {
  try {
    const data = await readAllUsers();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function viewProfile(req: Request, res: Response) {
  try {
    const queried = await readUserByEmail(req.params.id);
    if (!queried.length) {
      return res
        .status(400)
        .json({ success: false, message: "email does not exist" });
    }
    res.status(200).json({ success: true, data: queried.pop() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function unregister(req: Request, res: Response) {
  try {
    const check = await checkExistence(req.params.id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "email does not exist" });
    }
    await deleteUserByEmail(req.params.id);
    res.status(200).json({ success: true, data: { email: req.params.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function login(req: Request, res: Response) {}

export function logout(req: Request, res: Response) {}

export function findInfo(req: Request, res: Response) {}

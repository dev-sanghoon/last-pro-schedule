import jsonwebtoken from "jsonwebtoken";
import { Request, Response } from "express";
import mailer from "nodemailer";
import * as users from "./models";
import db from "../db";

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

export async function login(req: Request, res: Response) {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ success: false, message: "Unexpected" });
      return;
    }
    const queried = await users.verifyPassword(req.body.email);
    if (queried.length === 0) {
      res.status(400).json({ success: false, message: "Email not found" });
      return;
    }
    const [target] = queried;
    if (target.password === req.body.password) {
      const payload = { email: req.body.email };
      const createdToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
      res.append(
        "Set-Cookie",
        `access_token=${createdToken}; Path=/; Max-Age=3600; HttpOnly`
      );
      res.status(200).json({ success: true, data: payload });
      return;
    }
    res
      .status(500)
      .json({ success: false, message: "Might be wrong password" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function logout(req: Request, res: Response) {
  try {
    res
      .append("Set-Cookie", `access_token=''; Path=/; Max-Age=0; HttpOnly`)
      .status(200)
      .json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function findInfo(req: Request, res: Response) {}

export async function verifyEmail(req: Request, res: Response) {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      req.params.email !== process.env.DEV_MAIL
    ) {
      res.status(400).json({ success: false, message: "Wrong email receiver" });
      return;
    }

    const transport = mailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    const verificationCode = Math.random().toString(36).slice(2);
    const statement = [
      `INSERT INTO PendUsers (email, code)`,
      `VALUES("${req.params.email}", "${verificationCode}")`,
      `ON DUPLICATE KEY UPDATE code="${verificationCode}"`,
    ].join(" ");
    await db.query(statement);

    const { response, accepted, rejected } = await transport.sendMail({
      from: `"Habitier" <${process.env.MAILER_EMAIL}>`,
      to: req.params.email,
      subject: "Authorization Code from Habitier!",
      html: `<b>${verificationCode}</b>`,
    });
    res
      .status(200)
      .json({ success: true, data: { response, accepted, rejected } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

import jsonwebtoken from "jsonwebtoken";
import { Request, Response } from "express";
import mailer from "nodemailer";
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
    req.log.error(err);
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
    req.log.error(err);
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
    res
      .append("Set-Cookie", `access_token=; Path=/; Max-Age=0; HttpOnly`)
      .status(200)
      .json({ success: true, data: { email: req.params.email } });
  } catch (err) {
    req.log.error(err);
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
    req.log.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export function logout(req: Request, res: Response) {
  try {
    res
      .append("Set-Cookie", `access_token=; Path=/; Max-Age=0; HttpOnly`)
      .status(200)
      .json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function requestCode(req: Request, res: Response) {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      req.body.email !== process.env.DEV_MAIL
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
    users.saveTempCode(req.body.email, verificationCode);

    const { response, accepted, rejected } = await transport.sendMail({
      from: `"Habitier" <${process.env.MAILER_EMAIL}>`,
      to: req.body.email,
      subject: "Authorization Code from Habitier!",
      html: `<b>${verificationCode}</b>`,
    });
    res
      .status(200)
      .json({ success: true, data: { response, accepted, rejected } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

export async function verifyCode(req: Request, res: Response) {
  try {
    const exist = await users.findTempCode(req.body.email, req.body.code);
    if (!exist) {
      res
        .status(400)
        .json({ success: false, message: "matching email and code not found" });
      return;
    }
    await users.removeTempCode(req.body.email);
    res.status(200).json({ success: true, data: { email: req.body.email } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ success: false, message: "Unexpected" });
  }
}

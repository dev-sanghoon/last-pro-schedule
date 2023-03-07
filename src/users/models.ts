import { RowDataPacket, FieldPacket } from "mysql2";
import pool from "../db";

interface User extends RowDataPacket {
  email: string;
  name: string;
}

interface AuthInfo extends RowDataPacket {
  password: string;
}

interface Code extends RowDataPacket {
  email: string;
  code: string;
}

export const findAll = async (): Promise<User[]> => {
  const [result]: [User[], FieldPacket[]] = await pool.query(
    "SELECT email, name FROM Users"
  );
  if (Array.isArray(result) && result.length) {
    return result;
  }
  return [];
};

export const findOne = async (email: string): Promise<User[]> => {
  const [result]: [User[], FieldPacket[]] = await pool.query(
    `SELECT email, name FROM Users WHERE email = "${email}"`
  );
  if (Array.isArray(result) && result.length) {
    return result;
  }
  return [];
};

export const verifyPassword = async (email: string): Promise<AuthInfo[]> => {
  const [result]: [AuthInfo[], FieldPacket[]] = await pool.query(
    `SELECT password FROM Users WHERE email = "${email}"`
  );
  if (Array.isArray(result) && result.length) {
    return result;
  }
  return [];
};

export const doExist = async (email: string): Promise<boolean> => {
  const [result]: [User[], FieldPacket[]] = await pool.query(
    `SELECT 1 FROM Users WHERE email = "${email}" LIMIT 1`
  );
  if (Array.isArray(result)) {
    return !!result.length;
  }
  throw new Error("Unexpected");
};

export const createOne = async (
  email: string,
  password: string,
  name: string
) => {
  await pool.query(
    `INSERT INTO Users (email, password, name) VALUES ("${email}", "${password}", "${name}")`
  );
};

export const deleteOne = async (email: string) => {
  await pool.query(`DELETE FROM Users WHERE email = "${email}"`);
};

export const findTempCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  const statement = `SELECT 1 FROM PendUsers WHERE email = "${email}" AND code = "${code}"`;
  const [result]: [Code[], FieldPacket[]] = await pool.query(statement);
  if (Array.isArray(result)) {
    return !!result.length;
  }
  throw new Error("Unexpected");
};

export const removeTempCode = async (email: string) => {
  await pool.query(`DELETE FROM PendUsers WHERE email = "${email}"`);
};

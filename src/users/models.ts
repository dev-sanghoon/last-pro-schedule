import { pool } from "..";

export const readAllUsers = async () => {
  const [result] = await pool.query("SELECT email, name FROM Users");
  if (Array.isArray(result) && result.length) {
    return result;
  }
  return [];
};

export const readUserByEmail = async (email: string) => {
  const [result] = await pool.query(
    `SELECT email, name FROM Users WHERE email = "${email}"`
  );
  if (Array.isArray(result) && result.length) {
    return result;
  }
  return [];
};

export const checkExistence = async (email: string) => {
  const [result] = await pool.query(
    `SELECT 1 FROM Users WHERE email = "${email}" LIMIT 1`
  );
  if (Array.isArray(result)) {
    return !!result.length;
  }
  throw new Error("Unexpected");
};

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const [result] = await pool.query(
    `INSERT INTO Users (email, password, name) VALUES ("${email}", "${password}", "${name}")`
  );
  console.log(result);
};

export const deleteUserByEmail = async (email: string) => {
  const [result] = await pool.query(
    `DELETE FROM Users WHERE email = "${email}"`
  );
  console.log(result);
};

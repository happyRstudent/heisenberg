import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export function generateShareToken() {
  return randomBytes(20).toString("hex");
}

export async function maybeHashPassword(password?: string) {
  if (!password || !password.trim()) {
    return null;
  }
  return bcrypt.hash(password.trim(), 10);
}

export async function comparePassword(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

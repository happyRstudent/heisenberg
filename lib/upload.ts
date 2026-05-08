import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function saveImageFile(file: File) {
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const safeExt = (ext || "jpg").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${safeExt}`;
  const absPath = path.join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(absPath, Buffer.from(bytes));

  return `/uploads/${filename}`;
}

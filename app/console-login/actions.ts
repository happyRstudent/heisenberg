"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONSOLE_AUTH_COOKIE, isConsolePasswordValid } from "@/lib/auth";

export async function loginConsoleAction(formData: FormData) {
  const password = formData.get("password")?.toString() || "";

  if (!isConsolePasswordValid(password)) {
    redirect("/console-login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(CONSOLE_AUTH_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}

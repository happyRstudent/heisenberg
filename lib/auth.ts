export const CONSOLE_AUTH_COOKIE = "heisenberg_console_auth";

export function getConsolePassword() {
  return process.env.CONSOLE_PASSWORD || "123206";
}

export function isConsolePasswordValid(input: string) {
  return input === getConsolePassword();
}

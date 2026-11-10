import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Better Auth's HTTP endpoints (session checks and anything the browser calls directly).
export function GET(request: Request) {
  return toNextJsHandler(getAuth()).GET(request);
}

export function POST(request: Request) {
  return toNextJsHandler(getAuth()).POST(request);
}

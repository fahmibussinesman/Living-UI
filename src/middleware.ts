import { NextResponse, type NextRequest } from "next/server";

const VISITOR_COOKIE = "lu_visitor";

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  if (!request.cookies.get(VISITOR_COOKIE)?.value) {
    const id = `vis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    res.cookies.set(VISITOR_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

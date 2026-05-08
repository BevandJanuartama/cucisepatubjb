import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Menghapus cookie dengan mengatur expires ke masa lalu
  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}

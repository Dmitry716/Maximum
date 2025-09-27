import { login } from "@/api/requests";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();

    const response = await login({ password, email });

    if (!response?.accessToken) {
      return NextResponse.json(
        { error: response.error || "Username yoki parol noto'g'ri." },
        { status: 401 }
      );
    }

    const { user, accessToken, expiresIn, refreshToken, } = response;

    const nextResponse = NextResponse.json({ message: "Login muvaffaqiyatli", ok: true });

    nextResponse.cookies.set("access_token", accessToken, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: expiresIn,
    });

    nextResponse.cookies.set("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: expiresIn,
    });

    nextResponse.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return nextResponse;
  } catch (error) {
    console.error("Login xatosi:", error);
    return NextResponse.json(
      { error: "Server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}

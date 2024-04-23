import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ mensage: "Hello World!" });
}

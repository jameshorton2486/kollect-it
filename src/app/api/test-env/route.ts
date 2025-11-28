import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
  });
}

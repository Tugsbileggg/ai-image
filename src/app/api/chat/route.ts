import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Түүхийг Gemini-ийн формат руу хөрвүүлнэ
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "AI хариулт авахад алдаа гарлаа" },
      { status: 500 },
    );
  }
}

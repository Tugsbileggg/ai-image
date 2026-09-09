import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Hereglegch zuwhun hoolnii neriig oruulahad tuhain hoolond oroh ortsuudiig gargaj ir

Food description:
${prompt}

Return the answer as markdown bullet points.`,
    });

    return NextResponse.json({ text: response.text ?? "" });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Орц тодорхойлоход алдаа гарлаа" },
      { status: 500 },
    );
  }
}

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { mimeType, data } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data,
          },
        },
        {
          text: `Analyze this food image.

Return the result in Markdown:

# Food name

## Ingredients
- Ingredients 1
- Ingredients 2

### Estimated nutrition
- Calories
- Protein
- Carbs
- Fat
`,
        },
      ],
    });

    return NextResponse.json({ text: response.text ?? "" });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Зургийг шинжлэхэд алдаа гарлаа" },
      { status: 500 },
    );
  }
}

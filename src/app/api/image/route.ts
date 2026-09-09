import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

const client = new InferenceClient(process.env.HF_TOKEN);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const blob = await client.textToImage(
      {
        provider: "fal-ai",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: prompt,
      },
      {
        outputType: "blob",
      },
    );

    const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
    const dataUrl = `data:${blob.type};base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (error) {
    console.error("Image generate error:", error);
    return NextResponse.json(
      { error: "Зураг үүсгэхэд алдаа гарлаа" },
      { status: 500 },
    );
  }
}

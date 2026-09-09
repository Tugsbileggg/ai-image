import Image from "next/image";
import { TabsContent } from "./ui/tabs";
import { useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export const Analysis = () => {
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!image) return;

    setLoading(true);
    setResponse("");

    try {
      const base64 = await fileToBase64(image);

      const interaction = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: image.type,
              data: base64,
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

      setResponse(interaction.text ?? "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setImage(undefined);
    setPreviewImage("");
    setResponse("");
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <TabsContent className="flex flex-col gap-6" value="analysis">
      <span className="flex justify-between">
        <span className="flex gap-2 h-7">
          <Image
            src="/article-icon.png"
            alt="article"
            height={24}
            width={24}
            className="h-6 w-6"
          />
          <p className="text-[20px] font-semibold leading-[28px] tracking-[0px] text-[#09090B]">
            Image analysis
          </p>
        </span>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-[40px] items-center justify-center gap-2 rounded-[6px] border border-[#E4E4E7] bg-white px-4 py-2 opacity-50 cursor-pointer"
        >
          <Image alt="reload" src="/reload.png" width={14} height={14} />
        </button>
      </span>

      <div className="flex flex-col items-end gap-2">
        <p className="w-full justify-start text-sm font-normal leading-5 tracking-normal text-zinc-500">
          Describe the food, and AI will detect the ingredients.
        </p>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full cursor-pointer rounded-md border border-[#E4E4E7] px-3 py-2"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="preview"
              className="h-[160px] w-full rounded-md object-cover"
            />
          ) : (
            <span className="text-sm text-[#71717A]">Choose File JPG, PNG</span>
          )}
        </div>

        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="h-10 rounded-md bg-[#18181B] px-4 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Image
            src="/article-icon2.png"
            alt="icon2"
            width={24}
            height={24}
            className="h-6 w-6"
          />

          <p className="text-[20px] font-semibold leading-[28px] tracking-[0px] text-[#09090B]">
            Here is the summary
          </p>
        </div>

        <div className="text-sm font-normal leading-6 tracking-normal border border-solid rounded-md">
          <span className="flex flex-col w-124 justify-center p-4">
            {loading && <p>Working ...</p>}

            {!loading && !response && (
              <p className="text-zinc-500">
                First, enter your image to recognize an ingredients.
              </p>
            )}

            {!loading && response && <Markdown>{response}</Markdown>}
            {previewImage && <img className="rounded-md" src={previewImage} />}
          </span>
        </div>
      </div>
    </TabsContent>
  );
};

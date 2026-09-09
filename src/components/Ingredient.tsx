import Image from "next/image";
import { TabsContent } from "./ui/tabs";
import Markdown from "react-markdown";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

export const Ingredient = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateIngredient = async () => {
    if (!prompt) return;

    try {
      setLoading(true);

      const res = await fetch("/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const result = await res.json();

      setResponse(result.text ?? "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = () => {
    setPrompt("");
    setResponse("");
    setLoading(false);
  };

  return (
    <TabsContent className="flex flex-col gap-6" value="Ingredient">
      <span className="flex justify-between">
        <span className="flex h-7 gap-2">
          <Image
            src="/article-icon.png"
            alt="article"
            height={24}
            width={24}
            className="h-6 w-6"
          />
          <p className="text-[20px] font-semibold leading-[28px]">
            Ingredient recognition
          </p>
        </span>

        <button
          onClick={handleRefresh}
          className="flex h-10 items-center justify-center rounded-md border border-[#E4E4E7] bg-white px-4"
        >
          <Image alt="reload" src="/reload.png" width={14} height={14} />
        </button>
      </span>

      <div className="flex flex-col items-end gap-2">
        <p className="w-full text-sm text-zinc-500">
          Describe the food, and AI will detect the ingredients.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Орц тодорхойлох..."
          className="h-[130px] w-full resize-none rounded-md border border-[#E4E4E7] p-3 outline-none"
        />

        <button
          onClick={generateIngredient}
          disabled={loading}
          className="h-10 rounded-md bg-[#18181B] px-4 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <span className="flex gap-2">
        <ImageIcon width={24} height={24} className="h-6 w-6" />

        <p className="text-[20px] font-semibold leading-[28px]">
          Identified Ingredients
        </p>
      </span>

      <div className="rounded-md border border-[#E4E4E7] p-4">
        {loading && <p className="text-sm text-zinc-500">Working...</p>}

        {!loading && !response && (
          <p className="text-sm text-zinc-500">
            First, enter your food description to recognize ingredients.
          </p>
        )}

        {!loading && response && (
          <div className="prose prose-sm max-w-none">
            <Markdown>{response}</Markdown>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

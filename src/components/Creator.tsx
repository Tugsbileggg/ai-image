"use client";

import Image from "next/image";
import { TabsContent } from "./ui/tabs";
import { useRef, useState } from "react";

export const Creator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  const handleRefresh = () => {
    requestIdRef.current += 1;

    setPrompt("");
    setImageUrl("");
    setError("");
    setLoading(false);
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      setLoading(true);
      setImageUrl("");
      setError("");

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (requestId !== requestIdRef.current) return;

      if (!res.ok) {
        setError(data.error ?? "Алдаа гарлаа");
        return;
      }

      setImageUrl(data.dataUrl);
    } catch (error) {
      console.log("Image generate error:", error);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <TabsContent className="flex flex-col gap-6" value="creator">
      <span className="flex justify-between">
        <span className="flex h-7 gap-2">
          <Image
            src="/article-icon.png"
            alt="article"
            width={24}
            height={24}
            className="h-6 w-6"
          />

          <p className="text-[20px] font-semibold">Food image creator</p>
        </span>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-10 items-center justify-center rounded-md border border-[#E4E4E7] px-4 hover:bg-zinc-100"
        >
          <Image src="/reload.png" alt="reload" width={14} height={14} />
        </button>
      </span>

      <div className="flex flex-col items-end gap-2">
        <p className="w-full text-sm text-zinc-500">
          Enter the name of a food to generate its image.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Хоолны тайлбар"
          className="h-[130px] w-full resize-none rounded-md border border-[#E4E4E7] p-3 outline-none"
        />

        <button
          type="button"
          onClick={generateImage}
          disabled={loading}
          className="h-10 rounded-md bg-[#18181B] px-4 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <span className="flex gap-2">
        <Image
          src="/article-icon2.png"
          alt="icon2"
          width={24}
          height={24}
          className="h-6 w-6"
        />

        <p className="text-[20px] font-semibold">Result</p>
      </span>

      <div className="rounded-md border border-[#E4E4E7] p-4">
        {loading && (
          <p className="text-sm text-zinc-500">Generating image...</p>
        )}

        {!loading && error && <p className="text-sm text-red-600">⚠️ {error}</p>}

        {!loading && !imageUrl && !error && (
          <p className="text-sm text-zinc-500">
            First, enter a food name to generate an image.
          </p>
        )}

        {!loading && imageUrl && (
          <img
            src={imageUrl}
            alt="Generated image"
            className="w-full rounded-lg"
          />
        )}
      </div>
    </TabsContent>
  );
};

"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, Send, X } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MessageType = {
  message: string;
  role: "USER" | "AI";
};

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const Messagecontent = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    const userMessage: MessageType = {
      message: input,
      role: "USER",
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsTyping(true);

    const ai = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give me a short answer to this: ${input}`,
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "AI",
        message: ai.text!,
      },
    ]);

    setIsTyping(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Open chat"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18181B] text-white shadow-md"
      >
        <MessageCircle size={17} />
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="flex h-[472px] w-[380px] flex-col overflow-hidden rounded-lg border border-[#E4E4E7] bg-white p-0 shadow-xl"
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#E4E4E7] px-4">
          <p className="text-[16px] font-semibold leading-6 text-[#18181B]">
            Chat assistant
          </p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E4E7] text-[#71717A]"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
          {messages.map((chat, index) => (
            <Bubble
              key={index}
              align={chat.role === "AI" ? "start" : "end"}
              variant={chat.role === "AI" ? "default" : "muted"}
            >
              <BubbleContent
                className={
                  chat.role === "AI"
                    ? "max-w-[265px] whitespace-pre-wrap rounded-[20px] rounded-bl-[6px] bg-[#27272A] px-4 py-3 text-[14px] font-normal leading-[20px] tracking-[0] text-white"
                    : "max-w-[265px] whitespace-pre-wrap rounded-[20px] rounded-br-[6px] bg-[#F4F4F5] px-4 py-3 text-[14px] font-normal leading-[20px] tracking-[0] text-[#18181B]"
                }
              >
                {chat.message}
              </BubbleContent>
            </Bubble>
          ))}

          {isTyping && (
            <Bubble align="start" variant="default">
              <BubbleContent className="flex max-w-[170px] items-center gap-2 rounded-[20px] rounded-bl-[6px] bg-[#27272A] px-4 py-3 text-[14px] font-normal leading-[20px] text-white">
                <span>AI is typing</span>

                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                </span>
              </BubbleContent>
            </Bubble>
          )}
        </div>

        <div className="flex h-[60px] shrink-0 items-center gap-2 border-t border-[#E4E4E7] px-3">
          <textarea
            value={input}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder="Type your message..."
            className="h-10 flex-1 resize-none rounded-md border border-[#E4E4E7] px-3 py-2 text-[14px] font-normal leading-[20px] text-[#18181B] outline-none placeholder:text-[#71717A]"
          />

          <button
            type="button"
            onClick={sendMessage}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#27272A] text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

"use client";

import { Analysis } from "@/components/Analysis";
import { Creator } from "@/components/Creator";
import { Ingredient } from "@/components/Ingredient";
import { Messagecontent } from "@/components/MessageContent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center">
      <header className="flex h-14 w-full items-center px-12 py-4">
        <h2 className="text-[16px] font-semibold leading-6 text-black">
          AI tools
        </h2>
      </header>
      <section className="flex w-full justify-center">
        <Tabs defaultValue="analysis" className="w-[580px]">
          <TabsList>
            <TabsTrigger value="analysis">Image analysis</TabsTrigger>

            <TabsTrigger value="Ingredient">Ingredient recognition</TabsTrigger>

            <TabsTrigger value="creator">Image creator</TabsTrigger>
          </TabsList>

          <Analysis />
          <Ingredient />
          <Creator />
        </Tabs>
      </section>

      <div className="fixed bottom-6 right-6 z-50 bg-black text-white rounded-md ">
        <Messagecontent />
      </div>
    </main>
  );
}

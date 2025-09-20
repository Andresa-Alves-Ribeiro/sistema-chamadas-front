"use client";

import TurmasCard from "./components/turmasCard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-6xl mx-auto p-8 pb-20 sm:p-20">
        <TurmasCard />
      </main>
    </div>
  );
}

import { Suspense } from "react";
import HomePage from "./components/Home";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Carregando...</p>
      </div>
    </div>}>
      <HomePage />
    </Suspense>
  );
}

import { Suspense } from "react";
import { getAllTours } from "@/lib/tours-data";
import BuscarClient from "./BuscarClient";

export default async function BuscarPage() {
  const tours = await getAllTours();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <BuscarClient tours={tours} />
    </Suspense>
  );
}

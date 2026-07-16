import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTourBySlug } from "@/lib/tours-data";
import ReservaClient from "./ReservaClient";

export default async function ReservaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <ReservaClient tour={tour} />
    </Suspense>
  );
}

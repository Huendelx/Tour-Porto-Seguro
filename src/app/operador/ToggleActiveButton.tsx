"use client";

import { useTransition } from "react";
import { toggleTourActive } from "./actions";

export default function ToggleActiveButton({ tourId, isActive }: { tourId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleTourActive(tourId, !isActive))}
      disabled={isPending}
      className="text-[13px] font-medium text-gray-500 hover:text-[#111] transition-colors flex-shrink-0 disabled:opacity-40"
    >
      {isActive ? "Pausar" : "Publicar"}
    </button>
  );
}

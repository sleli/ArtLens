"use client";

import { useState } from "react";
import { ArtworkCard, type Artwork } from "@/components/artwork-card";

interface ArtworkFeedProps {
  artworks: Artwork[];
}

export function ArtworkFeed({ artworks }: ArtworkFeedProps) {
  const [index, setIndex] = useState(0);

  if (artworks.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 text-white">
        <p className="text-lg">Nessuna opera disponibile</p>
      </div>
    );
  }

  const current = artworks[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % artworks.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return (
    <div className="relative h-screen w-full">
      <ArtworkCard artwork={current} />
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30"
        aria-label="Opera precedente"
      >
        ←
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30"
        aria-label="Prossima opera"
      >
        →
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {artworks.length}
      </div>
    </div>
  );
}

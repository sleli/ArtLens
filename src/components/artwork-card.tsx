"use client";

import { useState } from "react";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  style?: string | null;
  period?: string | null;
  description?: string | null;
  createdAt: Date;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-900">
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center bg-neutral-800">
          <span className="text-neutral-400">Immagine non disponibile</span>
        </div>
      ) : (
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10">
        <h2 className="text-2xl font-bold text-white">{artwork.title}</h2>
        <p className="mt-1 text-lg text-neutral-200">{artwork.artist}</p>
        <p className="mt-1 text-sm text-neutral-300">{artwork.year}</p>
      </div>
    </div>
  );
}

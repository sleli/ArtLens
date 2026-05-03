"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { InteractionType } from "@prisma/client";
import { ArtworkCard, type Artwork } from "@/components/artwork-card";
import { determineInteraction } from "@/lib/swipe";

interface ArtworkFeedProps {
  artworks: Artwork[];
}

type AnimDirection = "like" | "dislike" | null;

export function ArtworkFeed({ artworks }: ArtworkFeedProps) {
  const [index, setIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [animDirection, setAnimDirection] = useState<AnimDirection>(null);
  const [entering, setEntering] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Preload immagini adiacenti
  useEffect(() => {
    if (artworks.length === 0) return;

    const preloadIndices = [
      (index + 1) % artworks.length,
      (index - 1 + artworks.length) % artworks.length,
    ];

    preloadIndices.forEach((i) => {
      if (i === index) return;
      const img = new Image();
      img.src = artworks[i].imageUrl;
    });
  }, [index, artworks]);

  const handleInteraction = useCallback(
    async (type: InteractionType) => {
      if (processing || artworks.length === 0 || animDirection !== null) return;
      setProcessing(true);

      const artwork = artworks[index];

      // Chiamata API in background (non blocca la navigazione)
      fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: artwork.id, type }),
      }).catch(() => {
        // Errore silenzioso — l'interazione è best-effort
      });

      // Avvia animazione uscita
      setAnimDirection(type === InteractionType.LIKE ? "like" : "dislike");
    },
    [artworks, index, processing, animDirection]
  );

  // Gestione fine animazione uscita → avanza indice + animazione entrata
  const handleTransitionEnd = useCallback(() => {
    if (!animDirection) return;

    setAnimDirection(null);
    setIndex((prev) => (prev + 1) % artworks.length);
    setEntering(true);

    // Rimuovi classe entrata dopo l'animazione
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntering(false);
        setProcessing(false);
      });
    });
  }, [animDirection, artworks.length]);

  // Touch handlers per swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;

      const interaction = determineInteraction(deltaX);
      if (interaction) {
        handleInteraction(interaction);
      }
    },
    [handleInteraction]
  );

  if (artworks.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 text-white">
        <p className="text-lg">Nessuna opera disponibile</p>
      </div>
    );
  }

  const current = artworks[index];

  // Classi CSS per animazione
  const slideOutClass =
    animDirection === "like"
      ? "translate-x-full opacity-0"
      : animDirection === "dislike"
        ? "-translate-x-full opacity-0"
        : "";

  const enterClass = entering ? "animate-card-enter" : "";

  return (
    <div
      className="relative h-screen w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={cardRef}
        onTransitionEnd={handleTransitionEnd}
        className={`transition-all duration-500 ease-in-out ${slideOutClass} ${enterClass}`}
      >
        <ArtworkCard artwork={current} />
      </div>

      {/* Pulsanti like/dislike */}
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-8">
        <button
          onClick={() => handleInteraction(InteractionType.DISLIKE)}
          disabled={processing}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/80 text-2xl text-white shadow-lg backdrop-blur-sm transition hover:bg-red-500 disabled:opacity-40"
          aria-label="Dislike"
        >
          ✕
        </button>
        <button
          onClick={() => handleInteraction(InteractionType.LIKE)}
          disabled={processing}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/80 text-2xl text-white shadow-lg backdrop-blur-sm transition hover:bg-green-500 disabled:opacity-40"
          aria-label="Like"
        >
          ♥
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {artworks.length}
      </div>
    </div>
  );
}

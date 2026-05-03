import { InteractionType } from "@prisma/client";

/**
 * Determina il tipo di interazione in base allo spostamento orizzontale del touch.
 * @param deltaX - spostamento orizzontale (positivo = destra, negativo = sinistra)
 * @param threshold - soglia minima in pixel (default 50)
 * @returns InteractionType se la soglia è superata, altrimenti null
 */
export function determineInteraction(
  deltaX: number,
  threshold = 50
): InteractionType | null {
  if (deltaX > threshold) return InteractionType.LIKE;
  if (deltaX < -threshold) return InteractionType.DISLIKE;
  return null;
}

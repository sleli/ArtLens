import { describe, it, expect } from "vitest";
import { InteractionType } from "@prisma/client";
import { determineInteraction } from "./swipe";

describe("determineInteraction", () => {
  const threshold = 50;

  it("restituisce LIKE quando deltaX supera la soglia positiva", () => {
    expect(determineInteraction(60, threshold)).toBe(InteractionType.LIKE);
    expect(determineInteraction(100, threshold)).toBe(InteractionType.LIKE);
    expect(determineInteraction(51, threshold)).toBe(InteractionType.LIKE);
  });

  it("restituisce DISLIKE quando deltaX è sotto la soglia negativa", () => {
    expect(determineInteraction(-60, threshold)).toBe(InteractionType.DISLIKE);
    expect(determineInteraction(-100, threshold)).toBe(InteractionType.DISLIKE);
    expect(determineInteraction(-51, threshold)).toBe(InteractionType.DISLIKE);
  });

  it("restituisce null quando deltaX è entro la soglia", () => {
    expect(determineInteraction(0, threshold)).toBeNull();
    expect(determineInteraction(25, threshold)).toBeNull();
    expect(determineInteraction(-25, threshold)).toBeNull();
    expect(determineInteraction(49, threshold)).toBeNull();
    expect(determineInteraction(-49, threshold)).toBeNull();
  });

  it("restituisce null esattamente sulla soglia (caso limite)", () => {
    expect(determineInteraction(50, threshold)).toBeNull();
    expect(determineInteraction(-50, threshold)).toBeNull();
  });

  it("usa soglia default 50 se non specificata", () => {
    expect(determineInteraction(51)).toBe(InteractionType.LIKE);
    expect(determineInteraction(-51)).toBe(InteractionType.DISLIKE);
    expect(determineInteraction(30)).toBeNull();
  });
});

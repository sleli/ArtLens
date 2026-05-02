import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { artworksSeed } from "../src/lib/data/artworks";
import { main } from "./seed";

const prisma = new PrismaClient();

describe("Seed idempotency and data validation", () => {
  it("dataset contains exactly 100 artworks with all required fields", () => {
    expect(artworksSeed.length).toBe(100);

    for (const artwork of artworksSeed) {
      expect(artwork.title).toBeTruthy();
      expect(artwork.artist).toBeTruthy();
      expect(typeof artwork.year).toBe("number");
      expect(artwork.imageUrl).toBeTruthy();
    }
  });

  it("running seed twice does not duplicate artworks", async () => {
    const countBefore = await prisma.artwork.count();
    await main();
    const countAfter = await prisma.artwork.count();
    expect(countAfter).toBe(countBefore);
  }, 15000);
});

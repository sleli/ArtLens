import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/artworks (integration)", () => {
  it("returns at least 100 artworks with all fields populated after seed", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThanOrEqual(100);

    for (const artwork of json) {
      expect(artwork).toHaveProperty("title");
      expect(artwork).toHaveProperty("artist");
      expect(artwork).toHaveProperty("year");
      expect(artwork).toHaveProperty("imageUrl");
      expect(artwork).toHaveProperty("style");
      expect(artwork).toHaveProperty("period");
      expect(artwork).toHaveProperty("description");
      expect(artwork.title).toBeTruthy();
      expect(artwork.artist).toBeTruthy();
      expect(artwork.year).toBeTruthy();
      expect(artwork.imageUrl).toBeTruthy();
    }
  });
});

import { describe, it, expect, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    artwork: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockFindMany = prisma.artwork.findMany as ReturnType<typeof vi.fn>;

describe("GET /api/artworks", () => {
  it("returns 200 with array of artworks ordered by createdAt", async () => {
    const artworks = [
      {
        id: "1",
        title: "Mona Lisa",
        artist: "Leonardo da Vinci",
        year: 1503,
        imageUrl: "https://example.com/mona.jpg",
        style: "Rinascimento",
        period: "XVI secolo",
        description: "Ritratto",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        title: "La Notte Stellata",
        artist: "Vincent van Gogh",
        year: 1889,
        imageUrl: "https://example.com/starry.jpg",
        style: "Post-Impressionismo",
        period: "XIX secolo",
        description: "Paesaggio",
        createdAt: new Date("2024-01-02"),
      },
    ];
    mockFindMany.mockResolvedValue(artworks);

    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(
      artworks.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))
    );
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { createdAt: "asc" } });
  });

  it("returns 500 when database query fails", async () => {
    mockFindMany.mockRejectedValue(new Error("DB error"));

    const response = await GET();
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json).toEqual({ error: "Failed to fetch artworks" });
  });
});

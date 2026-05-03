import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { InteractionType } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    artwork: { findUnique: vi.fn() },
    interaction: { upsert: vi.fn() },
  },
}));

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const mockFindUniqueUser = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockFindUniqueArtwork = prisma.artwork.findUnique as ReturnType<
  typeof vi.fn
>;
const mockUpsert = prisma.interaction.upsert as ReturnType<typeof vi.fn>;
const mockCreateClient = createClient as ReturnType<typeof vi.fn>;

function makeRequest(body?: unknown): Request {
  return new Request("http://localhost/api/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

describe("POST /api/interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea una nuova interaction con utente autenticato (200)", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sup-1" } } }) },
    });
    mockFindUniqueUser.mockResolvedValue({ id: "user-1", supabaseId: "sup-1" });
    mockFindUniqueArtwork.mockResolvedValue({ id: "art-1" });
    mockUpsert.mockResolvedValue({
      id: "int-1",
      userId: "user-1",
      artworkId: "art-1",
      type: "LIKE",
      createdAt: new Date(),
    });

    const response = await POST(makeRequest({ artworkId: "art-1", type: "LIKE" }));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.type).toBe("LIKE");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_artworkId: { userId: "user-1", artworkId: "art-1" } },
        create: expect.objectContaining({ type: "LIKE" }),
        update: { type: "LIKE" },
      })
    );
  });

  it("upsert quando l'interaction esiste già (cambio LIKE → DISLIKE)", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sup-1" } } }) },
    });
    mockFindUniqueUser.mockResolvedValue({ id: "user-1", supabaseId: "sup-1" });
    mockFindUniqueArtwork.mockResolvedValue({ id: "art-1" });
    mockUpsert.mockResolvedValue({
      id: "int-1",
      userId: "user-1",
      artworkId: "art-1",
      type: "DISLIKE",
      createdAt: new Date(),
    });

    const response = await POST(makeRequest({ artworkId: "art-1", type: "DISLIKE" }));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.type).toBe("DISLIKE");
  });

  it("restituisce 401 senza utente autenticato", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    });

    const response = await POST(makeRequest({ artworkId: "art-1", type: "LIKE" }));
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("restituisce 404 con artworkId inesistente", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sup-1" } } }) },
    });
    mockFindUniqueUser.mockResolvedValue({ id: "user-1", supabaseId: "sup-1" });
    mockFindUniqueArtwork.mockResolvedValue(null);

    const response = await POST(makeRequest({ artworkId: "non-existent", type: "LIKE" }));
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json.error).toBe("Artwork not found");
  });

  it("restituisce 400 con body malformato (type invalido)", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sup-1" } } }) },
    });

    const response = await POST(makeRequest({ artworkId: "art-1", type: "INVALID" }));
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toContain("Missing or invalid");
  });

  it("restituisce 400 con body malformato (artworkId mancante)", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sup-1" } } }) },
    });

    const response = await POST(makeRequest({ type: "LIKE" }));
    expect(response.status).toBe(400);
  });
});

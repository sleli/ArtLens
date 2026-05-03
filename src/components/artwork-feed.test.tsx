import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ArtworkFeed } from "./artwork-feed";

// Mock fetch per la chiamata API
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const artworks = [
  {
    id: "1",
    title: "Mona Lisa",
    artist: "Leonardo",
    year: 1503,
    imageUrl: "https://example.com/mona.jpg",
    style: null,
    period: null,
    description: null,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "La Notte Stellata",
    artist: "Van Gogh",
    year: 1889,
    imageUrl: "https://example.com/starry.jpg",
    style: null,
    period: null,
    description: null,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "Guernica",
    artist: "Picasso",
    year: 1937,
    imageUrl: "https://example.com/guernica.jpg",
    style: null,
    period: null,
    description: null,
    createdAt: new Date("2024-01-03"),
  },
];

describe("ArtworkFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("renders empty state when no artworks", () => {
    render(<ArtworkFeed artworks={[]} />);
    expect(screen.getByText("Nessuna opera disponibile")).toBeInTheDocument();
  });

  it("renders first artwork initially", () => {
    render(<ArtworkFeed artworks={artworks} />);
    expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("advances to next artwork on Like button click", async () => {
    render(<ArtworkFeed artworks={artworks} />);

    const likeButton = screen.getByLabelText("Like");
    fireEvent.click(likeButton);

    // Simula fine transizione CSS
    const cardWrapper = likeButton
      .closest(".relative")
      ?.querySelector(".transition-all");
    if (cardWrapper) {
      fireEvent.transitionEnd(cardWrapper);
    }

    await waitFor(() => {
      expect(screen.getByText("La Notte Stellata")).toBeInTheDocument();
    });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("advances to next artwork on Dislike button click", async () => {
    render(<ArtworkFeed artworks={artworks} />);

    const dislikeButton = screen.getByLabelText("Dislike");
    fireEvent.click(dislikeButton);

    const cardWrapper = dislikeButton
      .closest(".relative")
      ?.querySelector(".transition-all");
    if (cardWrapper) {
      fireEvent.transitionEnd(cardWrapper);
    }

    await waitFor(() => {
      expect(screen.getByText("La Notte Stellata")).toBeInTheDocument();
    });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("wraps around from last to first after 3 likes", async () => {
    render(<ArtworkFeed artworks={artworks} />);

    for (let i = 0; i < 3; i++) {
      const likeButton = screen.getByLabelText("Like");
      fireEvent.click(likeButton);

      const cardWrapper = likeButton
        .closest(".relative")
        ?.querySelector(".transition-all");
      if (cardWrapper) {
        fireEvent.transitionEnd(cardWrapper);
      }

      // Attendi che il componente si aggiorni
      await waitFor(() => {
        expect(screen.getByLabelText("Like")).not.toBeDisabled();
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
    });
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("calls POST /api/interactions on Like", async () => {
    render(<ArtworkFeed artworks={artworks} />);

    const likeButton = screen.getByLabelText("Like");
    fireEvent.click(likeButton);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/interactions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: "1", type: "LIKE" }),
      })
    );
  });

  it("calls POST /api/interactions on Dislike", async () => {
    render(<ArtworkFeed artworks={artworks} />);

    const dislikeButton = screen.getByLabelText("Dislike");
    fireEvent.click(dislikeButton);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/interactions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: "1", type: "DISLIKE" }),
      })
    );
  });
});

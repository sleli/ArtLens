import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArtworkFeed } from "./artwork-feed";

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
  it("renders empty state when no artworks", () => {
    render(<ArtworkFeed artworks={[]} />);
    expect(screen.getByText("Nessuna opera disponibile")).toBeInTheDocument();
  });

  it("renders first artwork initially", () => {
    render(<ArtworkFeed artworks={artworks} />);
    expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("advances to next artwork on next button click", () => {
    render(<ArtworkFeed artworks={artworks} />);
    fireEvent.click(screen.getByLabelText("Prossima opera"));
    expect(screen.getByText("La Notte Stellata")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("wraps around from last to first", () => {
    render(<ArtworkFeed artworks={artworks} />);
    fireEvent.click(screen.getByLabelText("Prossima opera"));
    fireEvent.click(screen.getByLabelText("Prossima opera"));
    fireEvent.click(screen.getByLabelText("Prossima opera"));
    expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("goes to previous artwork on prev button click", () => {
    render(<ArtworkFeed artworks={artworks} />);
    fireEvent.click(screen.getByLabelText("Prossima opera"));
    fireEvent.click(screen.getByLabelText("Opera precedente"));
    expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("wraps around from first to last when going prev", () => {
    render(<ArtworkFeed artworks={artworks} />);
    fireEvent.click(screen.getByLabelText("Opera precedente"));
    expect(screen.getByText("Guernica")).toBeInTheDocument();
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });
});

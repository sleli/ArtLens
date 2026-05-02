import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
    // Serve le immagini remote così come sono, senza ottimizzazione lato server.
    // Necessario perché sorgenti come Wikimedia restituiscono file molto pesanti
    // che superano il limite dell'image optimizer di Next.js (413 Payload Too Large).
    unoptimized: true,
  },
};

export default nextConfig;

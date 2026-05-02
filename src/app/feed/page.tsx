import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { ArtworkFeed } from "@/components/artwork-feed";

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (artworks.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 text-white">
        <p className="text-lg">Nessuna opera disponibile</p>
      </div>
    );
  }

  return <ArtworkFeed artworks={artworks} />;
}

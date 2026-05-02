import { PrismaClient } from "@prisma/client";
import { artworksSeed } from "../src/lib/data/artworks";

const prisma = new PrismaClient();

export async function main() {
  let inserted = 0;
  for (const artwork of artworksSeed) {
    const existing = await prisma.artwork.findFirst({
      where: { title: artwork.title, artist: artwork.artist },
    });
    if (!existing) {
      await prisma.artwork.create({ data: artwork });
      inserted++;
    }
  }
  console.log(
    `Seed completato: ${inserted} opere inserite su ${artworksSeed.length} totali.`
  );
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { InteractionType } from "@prisma/client";

export async function POST(request: Request) {
  // 1. Autenticazione
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validazione body
  let body: { artworkId?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { artworkId, type } = body;

  if (
    !artworkId ||
    typeof artworkId !== "string" ||
    !type ||
    !Object.values(InteractionType).includes(type as InteractionType)
  ) {
    return NextResponse.json(
      { error: "Missing or invalid artworkId or type (LIKE|DISLIKE)" },
      { status: 400 }
    );
  }

  // 3. Trova l'utente Prisma tramite supabaseId
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  // 4. Verifica che l'artwork esista
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
  });

  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }

  // 5. Upsert dell'interazione
  try {
    const interaction = await prisma.interaction.upsert({
      where: {
        userId_artworkId: {
          userId: dbUser.id,
          artworkId,
        },
      },
      update: { type: type as InteractionType },
      create: {
        userId: dbUser.id,
        artworkId,
        type: type as InteractionType,
      },
    });

    return NextResponse.json(interaction);
  } catch {
    return NextResponse.json(
      { error: "Failed to save interaction" },
      { status: 500 }
    );
  }
}

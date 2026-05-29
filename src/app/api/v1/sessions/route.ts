import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await prisma.session.create({
      data: {
        status: "PENDING",
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: { code: "SESSION_CREATE_FAILED", message: "Failed to create session." } },
      { status: 500 }
    );
  }
}

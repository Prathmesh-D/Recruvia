import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        jd: { select: { title: true } },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found." } },
        { status: 404 }
      );
    }

    const candidates = await prisma.candidateResult.findMany({
      where: { sessionId, status: "SCORED" },
      orderBy: [
        { rank: "asc" },
        { totalScore: "desc" }
      ],
    });

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        jobTitle: session.jd?.title || "Unknown Position",
        totalCandidates: candidates.length,
      },
      candidates,
    });
  } catch (error) {
    console.error("Results fetch error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to fetch results." } },
      { status: 500 }
    );
  }
}

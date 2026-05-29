import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const format = request.nextUrl.searchParams.get("format") || "csv";

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        jd: { select: { title: true } },
      },
    });

    if (!session) {
      return new NextResponse("Session not found", { status: 404 });
    }

    const candidates = await prisma.candidateResult.findMany({
      where: { sessionId, status: "SCORED" },
      orderBy: { totalScore: "desc" },
    });

    if (format === "csv") {
      const records = candidates.map((c) => ({
        Rank: c.rank,
        Name: c.name || c.originalName,
        Email: c.email || "",
        Phone: c.phone || "",
        "Total Score": c.totalScore,
        "Skill Score": c.skillScore,
        "Experience Score": c.experienceScore,
        "Education Score": c.educationScore,
        "Keyword Score": c.keywordScore,
        "Matched Skills": c.matchedSkills.join("; "),
        "Missing Skills": c.missingSkills.join("; "),
        Rationale: c.scoringRationale,
      }));

      const csvString = stringify(records, { header: true });

      return new NextResponse(csvString, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="recruvia-export-${sessionId.slice(
            0,
            8
          )}.csv"`,
        },
      });
    }

    return new NextResponse("Format not supported", { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Failed to export results", { status: 500 });
  }
}

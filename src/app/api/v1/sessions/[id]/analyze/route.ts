import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockScoreResume, geminiScoreResume, calculateTotalScore } from "@/lib/scoring";
import { delay } from "@/lib/utils";
import pLimit from "p-limit";

// Allow up to 5 minutes for synchronous scoring of all candidates
export const maxDuration = 300;
export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    // Verify session and JD
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        jd: true,
        candidates: { where: { status: "PENDING" } },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found." } },
        { status: 404 }
      );
    }

    if (!session.jd) {
      return NextResponse.json(
        { error: { code: "JD_REQUIRED", message: "Job Description is required before analysis." } },
        { status: 422 }
      );
    }

    if (session.candidates.length === 0) {
      // Check if they have candidates that are just already processed
      const totalCandidates = await prisma.candidateResult.count({
        where: { sessionId }
      });

      if (totalCandidates > 0) {
        return NextResponse.json(
          { status: "already_processed", message: "Candidates are already processing or completed." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: { code: "NO_CANDIDATES", message: "No candidates found." } },
        { status: 422 }
      );
    }

    // Update session status
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "PROCESSING" },
    });

    // Process candidates SYNCHRONOUSLY so results are ready before we respond.
    // On Vercel free tier, serverless functions have a 10s timeout but we raise
    // that via maxDuration. For local dev this is always fine.
    await processCandidatesInBackground(sessionId, session.candidates, session.jd.rawText);

    return NextResponse.json(
      { status: "complete", total: session.candidates.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to start analysis." } },
      { status: 500 }
    );
  }
}

async function processCandidatesInBackground(
  sessionId: string,
  candidates: { id: string; originalName: string; rawResumeText: string | null }[],
  jdText: string
) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const useRealAI = apiKey && apiKey !== "dummy-key" && apiKey.length > 5;
  
  // Throttle with p-limit to handle rate-limits smoothly (1 at a time if Gemini API is used, 3 if local mock)
  const limit = pLimit(useRealAI ? 1 : 3);

  const processPromises = candidates.map((candidate) => limit(async () => {
    try {
      await prisma.candidateResult.update({
        where: { id: candidate.id },
        data: { status: "PROCESSING" },
      });

      const resumeText = candidate.rawResumeText || "";
      
      const result = useRealAI
        ? await geminiScoreResume(resumeText, jdText, candidate.originalName)
        : await mockScoreResume(resumeText, jdText, candidate.originalName);

      const totalScore = calculateTotalScore({
        skillScore: result.skillScore,
        experienceScore: result.experienceScore,
        educationScore: result.educationScore,
        keywordScore: result.keywordScore,
      });

      await prisma.candidateResult.update({
        where: { id: candidate.id },
        data: {
          name: result.candidateName,
          email: result.email,
          phone: result.phone,
          skillScore: result.skillScore,
          experienceScore: result.experienceScore,
          educationScore: result.educationScore,
          keywordScore: result.keywordScore,
          totalScore,
          matchedSkills: result.matchedSkills,
          missingSkills: result.missingSkills,
          scoringRationale: result.scoringRationale,
          status: "SCORED",
        },
      });

      // Gemini Free Tier allows 15 Requests Per Minute (RPM).
      // We throttle the requests to prevent 429 errors.
      if (useRealAI) {
        await delay(4000);
      }

    } catch (error: any) {
      console.error(`Failed to score candidate ${candidate.id}:`, error);
      await prisma.candidateResult.update({
        where: { id: candidate.id },
        data: {
          status: "ERROR",
          errorMsg: error.message || "Failed to score resume",
        },
      });
    }
  }));

  // Execute processing concurrently with limits
  await Promise.all(processPromises);

  // Assign ranks
  const scored = await prisma.candidateResult.findMany({
    where: { sessionId, status: "SCORED" },
    orderBy: [
      { totalScore: "desc" },
      { originalName: "asc" }
    ],
  });

  // Batch rank updates in a single transaction to prevent N+1 bottleneck
  const updatePromises = scored.map((c, i) => 
    prisma.candidateResult.update({
      where: { id: c.id },
      data: { rank: i + 1 },
    })
  );
  await prisma.$transaction(updatePromises);

  // Update session
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: "COMPLETE" },
  });
}

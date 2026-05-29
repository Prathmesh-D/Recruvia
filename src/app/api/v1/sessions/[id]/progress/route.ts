import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js config to ensure SSE works on Vercel without buffering
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;

  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const session = await prisma.session.findUnique({
          where: { id: sessionId },
          include: { candidates: true },
        });

        if (!session) {
          sendEvent({ error: "Session not found" });
          controller.close();
          return;
        }

        // If session is already complete (e.g. page refresh), fire immediately
        if (session.status === "COMPLETE" || session.status === "ERROR") {
          const allCandidates = await prisma.candidateResult.findMany({
            where: { sessionId },
            select: { id: true, name: true, originalName: true, status: true, totalScore: true, errorMsg: true },
          });
          for (const c of allCandidates) {
            sendEvent({
              type: "progress",
              fileId: c.id,
              name: c.name || c.originalName,
              score: c.totalScore,
              status: c.status === "SCORED" ? "scored" : "error",
              reason: c.errorMsg,
            });
          }
          sendEvent({ type: "complete", total: allCandidates.length });
          controller.close();
          return;
        }

        let total = session.candidates.length;
        const sentIds = new Set<string>();

        // Poll DB every second for score updates
        intervalId = setInterval(async () => {
          const currentCandidates = await prisma.candidateResult.findMany({
            where: { sessionId },
            select: { id: true, name: true, originalName: true, status: true, totalScore: true, errorMsg: true },
          });

          let processed = 0;
          let succeeded = 0;
          let failed = 0;

          for (const c of currentCandidates) {
            if (c.status === "SCORED" || c.status === "ERROR") {
              processed++;
              if (c.status === "SCORED") succeeded++;
              if (c.status === "ERROR") failed++;
            }
          }

          // Send delta events for newly completed candidates
          for (const c of currentCandidates) {
            if ((c.status === "SCORED" || c.status === "ERROR") && !sentIds.has(c.id)) {
              sendEvent({
                type: "progress",
                fileId: c.id,
                name: c.name || c.originalName,
                score: c.totalScore,
                status: c.status === "SCORED" ? "scored" : "error",
                reason: c.errorMsg,
              });
              sentIds.add(c.id);
            }
          }

          const currentSession = await prisma.session.findUnique({
            where: { id: sessionId },
            select: { status: true },
          });

          if (currentSession?.status === "COMPLETE" || currentSession?.status === "ERROR") {
            sendEvent({ type: "complete", total, succeeded, failed });
            clearInterval(intervalId);
            controller.close();
          }
        }, 1000);

      } catch (e) {
        clearInterval(intervalId);
        controller.close();
      }
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

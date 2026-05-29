import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockParseJD } from "@/lib/scoring";
import { jdParser } from "@/lib/jdParser";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    
    const BodySchema = z.object({
      text: z.string().min(100, "JD text must be at least 100 characters."),
      title: z.string().optional(),
      previewOnly: z.boolean().optional()
    });

    const parseResult = BodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: parseResult.error.issues[0].message } },
        { status: 400 }
      );
    }
    
    const { text, title, previewOnly } = parseResult.data;

    // Use real Gemini if key exists, else fallback to mock
    let parsedData;
    const useRealAPI = !!process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== "dummy-key";
    
    if (useRealAPI) {
      try {
        parsedData = await jdParser.parse(text);
      } catch (err) {
        console.warn("Gemini JD parsing failed (likely rate limit), falling back to mock parser.");
        parsedData = await mockParseJD(text);
      }
    } else {
      parsedData = await mockParseJD(text);
    }

    if (previewOnly) {
      return NextResponse.json({
        parsedTitle: parsedData.title,
        requiredSkills: parsedData.requiredSkills,
        preferredSkills: parsedData.preferredSkills,
        experienceYears: parsedData.experienceYears,
        educationLevel: parsedData.educationLevel,
      });
    }

    // Save to DB
    const finalTitle = title || parsedData.title;

    const jd = await prisma.jobDescription.upsert({
      where: { sessionId },
      update: {
        rawText: text,
        title: finalTitle,
        requiredSkills: parsedData.requiredSkills,
        preferredSkills: parsedData.preferredSkills,
        experienceYears: parsedData.experienceYears,
        educationLevel: parsedData.educationLevel,
      },
      create: {
        sessionId,
        rawText: text,
        title: finalTitle,
        requiredSkills: parsedData.requiredSkills,
        preferredSkills: parsedData.preferredSkills,
        experienceYears: parsedData.experienceYears,
        educationLevel: parsedData.educationLevel,
      },
    });

    return NextResponse.json({ jdId: jd.id, ...parsedData, title: finalTitle }, { status: 200 });
  } catch (error) {
    console.error("JD save error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to process Job Description." } },
      { status: 500 }
    );
  }
}

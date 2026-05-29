import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    
    // Ensure session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    // Basic support for TXT files
    if (file.name.toLowerCase().endsWith(".txt") || file.type === "text/plain") {
      extractedText = buffer.toString("utf-8");
    } else {
      // Dynamically import pdf-parse so it doesn't crash the route at compile time
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = (pdfParseModule as any).default || pdfParseModule;
      
      const data = await pdfParse(buffer);
      extractedText = data.text;
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("JD PDF Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to parse Job Description file" },
      { status: 500 }
    );
  }
}

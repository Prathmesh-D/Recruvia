import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileStorage } from "@/lib/fileStorage";
import { extractText } from "@/lib/fileParser";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found." } },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "No files provided." } },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Validate magic bytes to prevent MIME spoofing
        const { fileTypeFromBuffer } = await import('file-type');
        const fileTypeResult = await fileTypeFromBuffer(buffer);
        
        if (!fileTypeResult || !['pdf', 'docx', 'doc'].includes(fileTypeResult.ext)) {
          throw new Error(`Invalid or unsupported file type. Expected PDF or DOCX, got ${fileTypeResult?.ext || 'unknown'}`);
        }

        const fileId = uuidv4();
        const ext = fileTypeResult.ext; // Safely use the verified extension

        // Extract text — this is what drives AI scoring
        const rawText = await extractText(buffer, file.type);

        // Save file to Supabase — if this fails, we still create the DB record
        // because rawResumeText is what's needed for scoring
        let fileKey = `${sessionId}/${fileId}.${ext}`;
        try {
          fileKey = await fileStorage.save(sessionId, fileId, ext, buffer);
        } catch (storageErr: any) {
          console.warn(`File storage failed for ${file.name}, continuing with text extraction only:`, storageErr.message);
        }

        // Create DB record
        const candidate = await prisma.candidateResult.create({
          data: {
            id: fileId,
            sessionId,
            originalName: file.name,
            fileSizeBytes: file.size,
            mimeType: file.type,
            fileKey,
            rawResumeText: rawText,
            status: "PENDING",
          },
        });

        results.push({
          fileId: candidate.id,
          filename: file.name,
          status: "success",
        });
      } catch (error: any) {
        console.error(`Failed to process ${file.name}:`, error);
        results.push({
          filename: file.name,
          status: "error",
          error: error.message || "Parse failed",
        });
      }
    }

    return NextResponse.json({ uploaded: results }, { status: 200 });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: { code: "UPLOAD_FAILED", message: "Failed to upload resumes." } },
      { status: 500 }
    );
  }
}

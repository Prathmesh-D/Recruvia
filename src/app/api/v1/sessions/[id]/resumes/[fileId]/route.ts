import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileStorage } from "@/lib/fileStorage";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: sessionId, fileId } = await params;

    const candidate = await prisma.candidateResult.findUnique({
      where: { id: fileId },
    });

    if (!candidate || candidate.sessionId !== sessionId) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "File not found." } },
        { status: 404 }
      );
    }

    // Delete local file
    await fileStorage.delete(candidate.fileKey);

    // Delete DB record
    await prisma.candidateResult.delete({
      where: { id: fileId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: "Failed to delete file." } },
      { status: 500 }
    );
  }
}

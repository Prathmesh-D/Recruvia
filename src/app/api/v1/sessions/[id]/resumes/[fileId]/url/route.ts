import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: sessionId, fileId } = await params;

    const candidate = await prisma.candidateResult.findUnique({
      where: {
        id: fileId,
        sessionId,
      },
    });

    if (!candidate || !candidate.fileKey) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Generate a secure signed URL that expires in 1 hour
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(candidate.fileKey, 3600);

    if (error || !data) {
      console.error("Failed to generate signed URL:", error);
      return NextResponse.json(
        { error: "Failed to generate secure URL for file" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error("Error generating file URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

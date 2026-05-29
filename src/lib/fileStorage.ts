import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// We use the Service Role key so our backend can bypass RLS and freely manage the bucket
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "resumes";

/**
 * Supabase Storage abstraction for production deployments.
 * Files are stored at: {sessionId}/{fileId}.{ext}
 */
export const fileStorage = {
  /**
   * Save a file buffer to Supabase storage
   */
  async save(
    sessionId: string,
    fileId: string,
    ext: string,
    buffer: Buffer
  ): Promise<string> {
    const fileKey = `${sessionId}/${fileId}.${ext}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileKey, buffer, {
        upsert: true,
        contentType: ext === "pdf" ? "application/pdf" : "application/octet-stream",
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw new Error("Failed to upload file to Supabase.");
    }

    return fileKey;
  },

  /**
   * Read a file from Supabase storage (returns Buffer)
   */
  async read(fileKey: string): Promise<Buffer> {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(fileKey);

    if (error || !data) {
      throw new Error(`Failed to read file from Supabase: ${fileKey}`);
    }

    // Convert Blob/File to Buffer
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  },

  /**
   * Delete a file from Supabase storage
   */
  async delete(fileKey: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileKey]);

    if (error) {
      console.error("Supabase Delete Error:", error);
    }
  },

  /**
   * Check if a file exists in Supabase
   */
  async exists(fileKey: string): Promise<boolean> {
    // A simple way to check existence is to request a signed URL and see if it fails,
    // or list the directory. For efficiency, we will just list the files in the session folder.
    const sessionId = fileKey.split("/")[0];
    const fileName = fileKey.split("/")[1];
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(sessionId, {
        limit: 100,
        search: fileName,
      });

    if (error || !data) return false;
    return data.some(file => file.name === fileName);
  },
};

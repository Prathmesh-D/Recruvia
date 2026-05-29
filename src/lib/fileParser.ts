import PDFParser from "pdf2json";
import mammoth from "mammoth";

/**
 * Extract raw text from a resume file buffer.
 * Supports PDF and DOC/DOCX.
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractFromPDF(buffer);
  }

  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractFromDOCX(buffer);
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser(null, true);

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parse error:", errData.parserError || errData);
        reject(new Error("Failed to extract text from PDF."));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();
        
        // pdf2json includes a lot of newlines and carriage returns, so we clean it up
        const cleanText = text
          .replace(/\r\n/g, " ")
          .replace(/\n/g, " ")
          .replace(/\s\s+/g, " ")
          .trim();

        if (cleanText.length < 20) {
          console.warn("PDF text extraction returned very little text — may be a scanned document.");
        }

        resolve(cleanText);
      });

      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("PDF setup error:", error);
      reject(new Error("Failed to initialize PDF parser."));
    }
  });
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || "";
  } catch (error) {
    console.error("DOCX parse error:", error);
    throw new Error("Failed to extract text from document.");
  }
}

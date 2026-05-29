import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "dummy-key";
export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Gemini model configured for resume scoring.
 * System instruction enforces strict technical-only skill extraction.
 */
export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: [
    "You are a resume scoring engine. You output structured JSON only.",
    "",
    "RULES:",
    "1. matchedSkills and missingSkills must ONLY contain technology names — programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, testing tools, protocols.",
    "2. VALID skill examples: React, TypeScript, PostgreSQL, Docker, AWS, Jest, GraphQL, Redis, Tailwind CSS, Next.js, Prisma, Kubernetes, Python, Git.",
    '3. NEVER put these in skill arrays: adjectives (senior, strong, excellent), soft skills (communication, leadership, teamwork), generic words (building, powered, productivity, startup, generation, growing, company, understanding, knowledge, culture, environment, scalable, modern, complex).',
    "4. Only mark a skill as matched if the EXACT technology name (or obvious alias like Postgres/PostgreSQL) appears in the resume.",
    "5. Use the full scoring range 0-100. A poor match should score 20-40, not 70.",
  ].join("\n"),
  generationConfig: {
    temperature: 0.0,
    responseMimeType: "application/json",
  },
});

/**
 * Retry wrapper with exponential backoff for rate limits.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.response?.status;
      // Retry on rate limit (429) or server errors (5xx)
      if (status === 429 || (status && status >= 500)) {
        const delayMs = Math.pow(2, attempt + 1) * 1000;
        console.log(`Gemini API ${status} error, attempt ${attempt + 1}/${maxRetries}. Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      // For all other errors (400, 403, etc), don't retry
      throw error;
    }
  }
  throw lastError;
}

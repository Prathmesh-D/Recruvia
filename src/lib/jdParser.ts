import { model, withRetry } from "./gemini";
import type { ParsedJD } from "@/types";
import { z } from "zod";

const JDSchema = z.object({
  title: z.string(),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  experienceYears: z.number().nullable(),
  educationLevel: z.string().nullable(),
});

import { mockParseJD } from "./scoring";

export const jdParser = {
  async parse(text: string): Promise<ParsedJD> {
    // Bypassing Gemini API for UI testing as requested
    return mockParseJD(text);
  },
};

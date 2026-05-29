// ─── Recruvia Type Definitions ───

export enum SessionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
}

export enum CandidateStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SCORED = "SCORED",
  ERROR = "ERROR",
}

export interface Session {
  id: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  id: string;
  sessionId: string;
  rawText: string;
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  educationLevel: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateResult {
  id: string;
  sessionId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  fileKey: string;
  originalName: string;
  fileSizeBytes: number;
  mimeType: string;
  rawResumeText: string | null;
  totalScore: number | null;
  skillScore: number | null;
  experienceScore: number | null;
  educationScore: number | null;
  keywordScore: number | null;
  rank: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  scoringRationale: string | null;
  status: CandidateStatus;
  errorMsg: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ───

export interface CreateSessionResponse {
  sessionId: string;
}

export interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  status: "success" | "error";
  error?: string;
}

export interface UploadResponse {
  uploaded: UploadedFile[];
}

export interface JDParseResponse {
  jdId: string;
  parsedTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  educationLevel: string | null;
}

export interface AnalyzeResponse {
  status: "processing";
  total: number;
}

export interface ProgressEvent {
  type: "progress" | "complete";
  fileId?: string;
  name?: string;
  score?: number;
  status?: "scored" | "error";
  reason?: string;
  total?: number;
  succeeded?: number;
  failed?: number;
}

export interface ResultsResponse {
  session: {
    id: string;
    status: SessionStatus;
    jobTitle: string;
    totalCandidates: number;
  };
  candidates: CandidateResult[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}

// ─── Scoring Types ───

export interface ScoringResult {
  candidateName: string;
  email: string | null;
  phone: string | null;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  keywordScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  scoringRationale: string;
}

export interface ParsedJD {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  educationLevel: string | null;
}

// ─── UI State Types ───

export interface FileUploadState {
  id: string;
  file: File;
  filename: string;
  size: number;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  fileId?: string; // Server-assigned ID
}

export type WizardStep = 1 | 2 | 3;

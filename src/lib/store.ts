import { create } from "zustand";
import type { FileUploadState, WizardStep, CandidateResult, ProgressEvent } from "@/types";

interface AppState {
  // Session
  sessionId: string | null;
  setSessionId: (id: string) => void;

  // Wizard Step
  wizardStep: WizardStep;
  setWizardStep: (step: WizardStep) => void;

  // File Uploads
  uploadedFiles: FileUploadState[];
  addFile: (file: FileUploadState) => void;
  updateFile: (id: string, updates: Partial<FileUploadState>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;

  // Job Description
  jdTitle: string;
  jdText: string;
  jdParsedSkills: string[];
  jdPreferredSkills: string[];
  setJdTitle: (title: string) => void;
  setJdText: (text: string) => void;
  setJdParsedSkills: (skills: string[]) => void;
  setJdPreferredSkills: (skills: string[]) => void;

  // Analysis Progress
  analysisTotal: number;
  analysisCompleted: number;
  analysisFailed: number;
  progressEvents: ProgressEvent[];
  setAnalysisTotal: (total: number) => void;
  addProgressEvent: (event: ProgressEvent) => void;
  resetAnalysis: () => void;

  // Results
  candidates: CandidateResult[];
  setCandidates: (candidates: CandidateResult[]) => void;
  selectedCandidateId: string | null;
  setSelectedCandidateId: (id: string | null) => void;

  // Reset
  resetAll: () => void;

  // Global Loading
  globalLoading: boolean;
  loadingMessage: string;
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
}

const initialState = {
  sessionId: null,
  wizardStep: 1 as WizardStep,
  uploadedFiles: [],
  jdTitle: "",
  jdText: "",
  jdParsedSkills: [],
  jdPreferredSkills: [],
  analysisTotal: 0,
  analysisCompleted: 0,
  analysisFailed: 0,
  progressEvents: [],
  candidates: [],
  selectedCandidateId: null,
  globalLoading: false,
  loadingMessage: "Loading...",
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setSessionId: (id) => set({ sessionId: id }),
  setWizardStep: (step) => set({ wizardStep: step }),

  addFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  updateFile: (id, updates) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ uploadedFiles: [] }),

  setJdTitle: (title) => set({ jdTitle: title }),
  setJdText: (text) => set({ jdText: text }),
  setJdParsedSkills: (skills) => set({ jdParsedSkills: skills }),
  setJdPreferredSkills: (skills) => set({ jdPreferredSkills: skills }),

  setAnalysisTotal: (total) => set({ analysisTotal: total }),
  addProgressEvent: (event) =>
    set((state) => {
      const newEvents = [...state.progressEvents, event];
      const completed =
        event.type === "progress" && event.status === "scored"
          ? state.analysisCompleted + 1
          : state.analysisCompleted;
      const failed =
        event.type === "progress" && event.status === "error"
          ? state.analysisFailed + 1
          : state.analysisFailed;
      return {
        progressEvents: newEvents,
        analysisCompleted: completed,
        analysisFailed: failed,
      };
    }),
  resetAnalysis: () =>
    set({
      analysisTotal: 0,
      analysisCompleted: 0,
      analysisFailed: 0,
      progressEvents: [],
    }),

  setCandidates: (candidates) => set({ candidates }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

  resetAll: () => set(initialState),
  setGlobalLoading: (isLoading, message = "Loading...") => 
    set({ globalLoading: isLoading, loadingMessage: message }),
}));

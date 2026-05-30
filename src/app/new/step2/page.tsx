"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { StepStepper } from "@/components/StepStepper";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SkillChip } from "@/components/SkillChip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

function JDContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdQuery = searchParams.get("session");

  const {
    sessionId,
    setSessionId,
    setWizardStep,
    uploadedFiles,
    jdTitle,
    setJdTitle,
    jdText,
    setJdText,
    setGlobalLoading,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ title?: string; text?: string }>({});

  useEffect(() => {
    if (sessionIdQuery && sessionIdQuery !== sessionId) {
      setSessionId(sessionIdQuery);
    }
    setWizardStep(2);
    
    if (uploadedFiles.filter(f => f.status === "success").length === 0) {
       router.replace(`/new?session=${sessionIdQuery || sessionId}`);
    }
  }, [sessionIdQuery, sessionId, setSessionId, setWizardStep, uploadedFiles, router]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setIsUploading(true);
    setGlobalLoading(true, "EXTRACTING DOCUMENT TEXT...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/v1/sessions/${sessionId}/jd/upload`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      setJdText(data.text);
      if (!jdTitle) {
        setJdTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      setActiveTab("paste");
      toast.success("Job Description extracted successfully!");
    } catch (e) {
      toast.error("Failed to extract text from file. Please paste it manually.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setGlobalLoading(false), 500);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    const newError: { title?: string; text?: string } = {};
    if (!jdTitle.trim()) newError.title = "Job Title is required.";
    if (jdText.length < 10) newError.text = "Add at least 10 characters.";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    setError({});
    setIsSubmitting(true);
    setGlobalLoading(true, "EXTRACTING KEYWORDS & SCORING CANDIDATES...");

    try {
      const jdRes = await fetch(`/api/v1/sessions/${sessionId}/jd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jdText, title: jdTitle }),
      });
      if (!jdRes.ok) throw new Error("Failed to save JD");

      // Fire analyze — server processes synchronously, but we don't block the UI.
      // The carousel session page picks up progress via SSE stream and navigates to results when done.
      fetch(`/api/v1/sessions/${sessionId}/analyze`, { method: "POST" })
        .catch((e) => console.error("Analyze request failed:", e));

      // Navigate immediately to the live carousel loading screen
      router.push(`/session/${sessionId}`);
    } catch (e) {
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
      setGlobalLoading(false);
    } finally {
      // Note: we don't clear global loading here if successful, 
      // because we want it to stay up while routing to /session/[id].
      // The destination page will clear it when it mounts or we can set a timeout.
      if (Object.keys(newError).length === 0) {
         setTimeout(() => setGlobalLoading(false), 800);
      }
    }
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-10 py-6 lg:py-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
        
        {/* Left Side: Typography & Visuals */}
        <div className="flex flex-col items-start md:sticky md:top-24 h-max">
          <div className="text-primary font-mono text-xl font-bold mb-4">
            [ STEP 02 ]
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-0">
            Job <br/> Details
          </h1>
          
          <div className="hidden md:flex flex-col mt-0 w-full">
             {/* Floating JD Card Graphic matching Home Screen */}
             <div className="w-full aspect-square relative flex items-center justify-center mt-4">
                <div className="absolute inset-0 bg-dot-grid pointer-events-none rounded-xl" />
                
                {/* Back shadow card */}
                <div className="absolute w-[80%] h-[80%] bg-surface-warm border-2 border-neutral-900 rounded-xl shadow-[4px_4px_0px_#1A1412] transform rotate-[-6deg] animate-float-delayed opacity-80" />
                
                {/* Front active JD card */}
                <div className="absolute w-[85%] h-[85%] bg-primary border-2 border-neutral-900 rounded-xl shadow-[8px_8px_0px_#1A1412] transform rotate-[3deg] animate-float flex flex-col p-6">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-white rounded-lg border-2 border-neutral-900 flex items-center justify-center font-heading font-black text-xl text-primary shadow-[2px_2px_0px_#1A1412]">
                       JD
                     </div>
                     <div>
                       <div className="h-4 w-24 bg-white rounded mb-2" />
                       <div className="h-3 w-16 bg-primary-light/50 rounded" />
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="h-2 w-full bg-primary-light/30 rounded-full" />
                     <div className="h-2 w-5/6 bg-primary-light/30 rounded-full" />
                     <div className="h-2 w-full bg-primary-light/30 rounded-full" />
                     <div className="h-2 w-4/5 bg-primary-light/30 rounded-full" />
                   </div>

                   <div className="mt-auto flex gap-2">
                     <div className="h-6 w-16 bg-white rounded-full border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412]" />
                     <div className="h-6 w-20 bg-success rounded-full border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412]" />
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="flex flex-col">
          {/* Tabs */}
          <div className="flex gap-6 border-b-2 border-neutral-900 mb-8">
            <button
              onClick={() => setActiveTab("paste")}
              className={cn(
                "pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4",
                activeTab === "paste"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              Paste / Type
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4",
                activeTab === "upload"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              Upload File
            </button>
          </div>

          <div className="px-1 -mx-1 pb-2">
            <AnimatePresence mode="wait">
              {activeTab === "paste" ? (
                <motion.div 
                  key="paste"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <label className="block text-[13px] font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Job Title <span className="text-primary">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Senior Backend Engineer"
                      value={jdTitle}
                      onChange={(e) => {
                        setJdTitle(e.target.value);
                        if (error.title) setError({ ...error, title: undefined });
                      }}
                      error={error.title}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Job Description <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      placeholder="Paste the full job description here — include required skills, experience level, and education requirements for best results."
                      value={jdText}
                      onChange={(e) => {
                        setJdText(e.target.value);
                        if (error.text) setError({ ...error, text: undefined });
                      }}
                      error={error.text}
                      charCount={jdText.length}
                      maxChars={10000}
                    />
                    
                    <AnimatePresence>
                      {jdText.length > 0 && jdText.length < 100 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -5, height: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="bg-[#FEF9C3] border-2 border-neutral-900 rounded-lg p-3 shadow-[2px_2px_0px_#1A1412] flex gap-2 items-start">
                            <span className="text-xl leading-none mt-0.5">💡</span>
                            <div>
                              <p className="text-[12px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Tip: Short Job Description</p>
                              <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                                You can proceed, but for the most accurate AI scoring, consider pasting a fully detailed Job Description (at least 100 characters).
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col gap-4"
                >
                  <div 
                    {...getRootProps()}
                    className={cn(
                      "h-64 bg-surface-white border-2 border-dashed rounded-xl shadow-[4px_4px_0px_#1A1412] flex flex-col items-center justify-center transition-colors cursor-pointer",
                      isDragActive ? "border-primary bg-primary/5" : "border-neutral-900 hover:bg-surface-warm"
                    )}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                        <p className="text-sm font-bold text-neutral-900">Extracting text...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <span className="text-xl">📄</span>
                        </div>
                        <p className="text-sm font-bold text-neutral-900 mb-1">
                          {isDragActive ? "Drop JD file here" : "Click or drag JD file to upload"}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium">Supports PDF, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                  
                  <div className="bg-primary-light/30 border-2 border-neutral-900 rounded-xl p-5 shadow-[4px_4px_0px_#1A1412] flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <span className="text-primary text-xl leading-none mt-0.5">💡</span>
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider mb-1">Pro Tip</h4>
                        <p className="text-[13px] text-neutral-700 font-medium leading-relaxed">
                          Upload your Job Description in <strong>.TXT format</strong> for the fastest and most accurate text extraction.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sticky bottom-6 mt-12 bg-surface-white/95 backdrop-blur-sm p-4 rounded-xl border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] flex items-center justify-between z-40">
            <Button
              variant="ghost"
              onClick={() => router.push(`/new?session=${sessionId}`)}
              disabled={isSubmitting || isUploading}
            >
              ← Back
            </Button>
            <Button
              size="lg"
              className="px-8 text-base"
              onClick={handleAnalyze}
              disabled={jdText.length < 10 || !jdTitle.trim()}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Starting Analysis..." : "Analyze Candidates →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step2Page() {
  return (
    <div className="flex-1 flex flex-col bg-surface">
      <StepStepper currentStep={2} />
      <Suspense
        fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}
      >
        <JDContent />
      </Suspense>
    </div>
  );
}

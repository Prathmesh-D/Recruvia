"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { StepStepper } from "@/components/StepStepper";
import { ResumeDropzone } from "@/components/ResumeDropzone";
import { FileRow } from "@/components/FileRow";
import { Trash2, FileText, CheckCircle, AlertCircle, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { v4 as uuidv4 } from "uuid";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdQuery = searchParams.get("session");

  const {
    sessionId,
    setSessionId,
    wizardStep,
    setWizardStep,
    uploadedFiles,
    addFile,
    updateFile,
    removeFile,
  } = useAppStore();

  const [isInitializing, setIsInitializing] = useState(true);

  // Sync session ID from URL or redirect if missing
  useEffect(() => {
    const createNewSession = () => {
      fetch("/api/v1/sessions", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setSessionId(data.sessionId);
          router.replace(`/new?session=${data.sessionId}`);
          setIsInitializing(false);
        })
        .catch(() => {
          toast.error("Failed to initialize session.");
          router.push("/");
        });
    };

    if (sessionIdQuery) {
      // Verify session actually exists in DB to prevent 404s
      fetch(`/api/v1/sessions/${sessionIdQuery}`)
        .then((res) => {
          if (!res.ok) throw new Error("Invalid session");
          if (sessionIdQuery !== sessionId) {
            setSessionId(sessionIdQuery);
          }
          setIsInitializing(false);
        })
        .catch(() => {
          toast.error("Session expired. Starting a fresh session.");
          createNewSession();
        });
    } else if (!sessionId) {
      // Create session on the fly if user skipped landing page
      createNewSession();
    } else {
      router.replace(`/new?session=${sessionId}`);
      setIsInitializing(false);
    }

    setWizardStep(1);
  }, [sessionIdQuery, sessionId, setSessionId, router, setWizardStep]);

  const handleFilesSelected = async (files: { file: File; error?: string }[]) => {
    for (const { file, error } of files) {
      const id = uuidv4();

      addFile({
        id,
        file,
        filename: file.name,
        size: file.size,
        progress: error ? 0 : 10,
        status: error ? "error" : "uploading",
        error,
      });

      if (!error && sessionId) {
        // Upload file
        const formData = new FormData();
        formData.append("files", file);

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            updateFile(id, {
              progress: Math.min(
                90,
                (useAppStore.getState().uploadedFiles.find((f) => f.id === id)?.progress || 0) + 15
              ),
            });
          }, 100);

          const res = await fetch(`/api/v1/sessions/${sessionId}/resumes`, {
            method: "POST",
            body: formData,
          });

          clearInterval(progressInterval);

          if (!res.ok) throw new Error("Upload failed");

          const data = await res.json();
          const result = data.uploaded[0];

          if (result.status === "error") {
            updateFile(id, { status: "error", error: result.error, progress: 0 });
          } else {
            updateFile(id, {
              status: "success",
              progress: 100,
              fileId: result.fileId,
            });
          }
        } catch (err) {
          updateFile(id, {
            status: "error",
            error: "Network error during upload.",
            progress: 0,
          });
        }
      }
    }
  };

  const handleRemoveFile = async (id: string) => {
    const file = uploadedFiles.find((f) => f.id === id);
    removeFile(id);

    if (file?.fileId && sessionId) {
      try {
        await fetch(`/api/v1/sessions/${sessionId}/resumes/${file.fileId}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to delete from server:", e);
      }
    }
  };

  if (isInitializing) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  const successCount = uploadedFiles.filter((f) => f.status === "success").length;
  const isUploading = uploadedFiles.some((f) => f.status === "uploading");

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-10 py-6 lg:py-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 lg:gap-12">
        
        {/* Left Side: Typography & Info */}
        <div className="flex flex-col items-start md:sticky md:top-24 h-max">
          <div className="text-primary font-mono text-xl font-bold mb-4">
            [ STEP 01 ]
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Upload <br/> Resumes
          </h1>
          <div className="bg-surface-white border-2 border-neutral-900 p-5 rounded-xl shadow-[4px_4px_0px_#1A1412] w-full">
            <h3 className="font-bold text-neutral-900 mb-2">Requirements</h3>
            <ul className="text-sm text-neutral-700 space-y-2 font-medium">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> PDF, DOC, DOCX format</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Max 5 MB per file</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Up to 50 files per session</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Interactive Elements */}
        <div className="flex flex-col">
          <ResumeDropzone onFilesSelected={handleFilesSelected} />

          {uploadedFiles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider border-b-2 border-neutral-900 pb-2">
                Uploaded Files ({uploadedFiles.length})
              </h2>
              <div className="flex flex-col gap-3">
                {uploadedFiles.map((file) => (
                  <FileRow key={file.id} file={file} onRemove={handleRemoveFile} />
                ))}
              </div>
            </div>
          )}

          <div className="sticky bottom-6 mt-12 bg-surface-white/95 backdrop-blur-sm p-4 rounded-xl border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] flex items-center justify-between z-40">
            <p className="text-[14px] text-neutral-700 font-bold">
              {successCount} file{successCount !== 1 && "s"} ready for analysis
            </p>
            <Button
              size="lg"
              className="px-8 text-base"
              disabled={successCount === 0 || isUploading}
              onClick={() => router.push(`/new/step2?session=${sessionId}`)}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline-block" />
                  Uploading...
                </>
              ) : (
                "Continue to JD →"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewSessionPage() {
  return (
    <div className="flex-1 flex flex-col bg-surface">
      <StepStepper currentStep={1} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <UploadContent />
      </Suspense>
    </div>
  );
}

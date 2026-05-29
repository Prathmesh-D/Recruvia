"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ScoreBadge } from "@/components/ScoreBadge";

export default function AnalysisProgressPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  
  const {
    setSessionId,
    setWizardStep,
    analysisTotal,
    setAnalysisTotal,
    analysisCompleted,
    analysisFailed,
    progressEvents,
    addProgressEvent,
    resetAnalysis,
  } = useAppStore();

  const [isComplete, setIsComplete] = useState(false);
  const [candidates, setCandidates] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setSessionId(sessionId);
    setWizardStep(3);
    resetAnalysis();

    // Fetch initial candidate list
    fetch(`/api/v1/sessions/${sessionId}/progress/init`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCandidates(data.candidates);
        setAnalysisTotal(data.candidates.length);
      })
      .catch(() => {});

    const eventSource = new EventSource(`/api/v1/sessions/${sessionId}/progress`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          toast.error(data.error);
          eventSource.close();
          return;
        }

        if (data.type === "progress") {
          addProgressEvent(data);
        } else if (data.type === "complete") {
          setIsComplete(true);
          eventSource.close();
        }
      } catch (err) {
        console.error("Failed to parse SSE:", err);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE Error:", e);
      toast.error("Connection lost. Reconnecting...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId, setSessionId, setWizardStep, resetAnalysis, addProgressEvent, setAnalysisTotal]);

  useEffect(() => {
    if (isComplete) {
      toast.success("Analysis complete! Loading results...");
      const timer = setTimeout(() => {
        router.push(`/session/${sessionId}/results`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, router, sessionId]);

  const totalProcessed = analysisCompleted + analysisFailed;
  const progressPercent = analysisTotal > 0 ? (totalProcessed / analysisTotal) * 100 : 0;
  const remaining = analysisTotal - totalProcessed;
  const estimatedSeconds = remaining * 2;

  // Build the list of rows to display
  const rowMap = new Map();
  candidates.forEach(c => rowMap.set(c.id, { id: c.id, name: c.name, status: "queued" }));
  
  progressEvents.forEach(e => {
    if (e.fileId) {
      rowMap.set(e.fileId, {
        id: e.fileId,
        name: e.name || "Unknown Candidate",
        status: e.status,
        score: e.score,
        errorReason: e.reason,
      });
    }
  });

  if (!isComplete) {
    let foundAnalyzing = false;
    const entries = Array.from(rowMap.entries());
    for (let i = 0; i < entries.length; i++) {
      const [id, data] = entries[i];
      if (data.status === "queued" && !foundAnalyzing) {
        rowMap.set(id, { ...data, status: "analyzing" });
        foundAnalyzing = true;
      }
    }
  }

  // Carousel Logic
  const orderedCandidates = Array.from(rowMap.values());
  let analyzingIdx = orderedCandidates.findIndex(r => r.status === "analyzing");

  const visibleCards: any[] = [];
  
  if (isComplete && orderedCandidates.length > 0) {
    // Show the very last processed candidate in the center, and the one before it at the top
    const lastIdx = orderedCandidates.length - 1;
    if (lastIdx > 0) {
      visibleCards.push({ ...orderedCandidates[lastIdx - 1], position: 'top' });
    }
    visibleCards.push({ ...orderedCandidates[lastIdx], position: 'middle' });
  } else if (analyzingIdx !== -1) {
    // 1. Top card (most recently completed)
    if (analyzingIdx > 0) {
      visibleCards.push({ ...orderedCandidates[analyzingIdx - 1], position: 'top' });
    }
    // 2. Center card (currently analyzing)
    visibleCards.push({ ...orderedCandidates[analyzingIdx], position: 'middle' });
    // 3. Bottom card (next in queue)
    if (analyzingIdx < orderedCandidates.length - 1) {
      visibleCards.push({ ...orderedCandidates[analyzingIdx + 1], position: 'bottom' });
    }
  }

  const queuedHidden = Math.max(0, orderedCandidates.length - (analyzingIdx + 2));

  const [isCentered, setIsCentered] = useState(true);
  useEffect(() => {
    // Hold the centered logo for a brief moment before gracefully transitioning to the split layout
    const timer = setTimeout(() => setIsCentered(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-primary overflow-hidden">
      <AnimatePresence mode="wait">
        {isCentered ? (
          <motion.div 
            key="centered"
            className="flex-1 w-full h-full flex flex-col items-center justify-center relative"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
            <motion.div
              layoutId="hero-logo"
              transition={{ type: "tween", ease: "easeInOut", duration: 1.2 }}
              className="bg-neutral-900 border-4 border-neutral-900 px-8 py-4 flex items-center justify-center shadow-[8px_8px_0px_#EFE6DE]"
              style={{ color: "#EFE6DE" }}
            >
              <span 
                className="text-4xl md:text-6xl font-bold tracking-wider whitespace-nowrap" 
                style={{ fontFamily: "var(--font-logo-custom), sans-serif" }}
              >
                Recruvia.
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="split"
            className="flex-1 w-full h-full flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-hidden"
          >
            {/* Left Side: The Massive Anchor Logo */}
            <div className="w-full md:w-1/2 shrink-0 md:shrink flex flex-col items-center justify-center p-6 md:p-10 bg-primary relative py-8 md:py-0">
              <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
              
              <div className="z-10 flex flex-col items-center">
                {/* Same layoutId to trigger the glide */}
                <motion.div
                  layoutId="hero-logo"
                  transition={{ type: "tween", ease: "easeInOut", duration: 1.2 }}
                  className="bg-neutral-900 border-4 border-neutral-900 px-6 py-3 md:px-8 md:py-4 flex items-center justify-center shadow-[6px_6px_0px_#EFE6DE] md:shadow-[8px_8px_0px_#EFE6DE] mb-6 md:mb-12"
                  style={{ color: "#EFE6DE" }}
                >
                  <span 
                    className="text-3xl md:text-6xl font-bold tracking-wider whitespace-nowrap" 
                    style={{ fontFamily: "var(--font-logo-custom), sans-serif" }}
                  >
                    Recruvia.
                  </span>
                </motion.div>

            {/* Progress Tracker below Logo */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-[320px] flex flex-col items-center"
            >
              <div className="flex justify-between items-end w-full px-1 mb-3">
                <span className="text-[13px] font-bold uppercase tracking-wider text-neutral-900">
                  {isComplete ? "ANALYSIS COMPLETE" : "PROCESSING DATA..."}
                </span>
                <span className="text-[13px] font-bold text-neutral-900 bg-surface-white px-2 py-0.5 border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] rounded">
                  {progressPercent.toFixed(0)}%
                </span>
              </div>
              <div className="h-6 w-full bg-surface-white border-2 border-neutral-900 overflow-hidden shadow-[4px_4px_0px_#1A1412]">
                <div
                  className="h-full bg-neutral-900 transition-all duration-700 ease-out border-r-2 border-neutral-900 relative"
                  style={{ width: `${Math.max(2, progressPercent)}%` }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)" }} />
                </div>
              </div>
              <p className="mt-4 font-mono text-[11px] text-neutral-900 font-bold uppercase tracking-widest text-center">
                {totalProcessed} of {analysisTotal || "?"} Profiles Scored
                {!isComplete && remaining > 0 && ` • ~${estimatedSeconds}s remaining`}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: The Live Feed (Delayed Fade In) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 bg-primary relative pb-8 md:pb-0"
        >
          {queuedHidden > 0 && (
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
              <span className="text-xs md:text-sm font-bold text-neutral-900 bg-surface-white px-2 py-1 md:px-3 md:py-1.5 border-2 border-neutral-900 shadow-[3px_3px_0px_#EFE6DE] md:shadow-[4px_4px_0px_#EFE6DE]">
                +{queuedHidden} QUEUED
              </span>
            </div>
          )}
          
          {/* Carousel Feed Area */}
          <div className="flex-1 p-4 md:p-10 flex flex-col justify-center items-center gap-3.5 md:gap-8 overflow-hidden relative">
            <AnimatePresence mode="popLayout">
              {visibleCards.map((row) => (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(4px)" }}
                  animate={{ 
                    opacity: row.position === 'middle' ? 1 : 0.5, 
                    y: 0, 
                    scale: row.position === 'middle' ? 1 : 0.8,
                    filter: row.position === 'middle' ? "blur(0px)" : "blur(4px)"
                  }}
                  exit={{ opacity: 0, y: -50, scale: 0.7, filter: "blur(8px)" }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="bg-surface-white border-2 border-neutral-900 p-4 md:p-8 rounded-xl shadow-[6px_6px_0px_#1A1412] md:shadow-[12px_12px_0px_#1A1412] flex flex-row justify-between items-center gap-4 w-full max-w-[550px]"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base sm:text-lg md:text-2xl text-neutral-900 truncate max-w-[160px] sm:max-w-[250px] md:max-w-[300px]">{row.name}</span>
                    <span className="text-[10px] sm:text-xs md:text-[14px] font-mono text-neutral-500 mt-1 md:mt-2 uppercase leading-none">
                      {row.status === "queued" && "Queued"}
                      {row.status === "analyzing" && "Analyzing..."}
                      {row.status === "scored" && "Scored"}
                      {row.status === "error" && "Failed"}
                    </span>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-end w-[60px] md:w-[100px]">
                    {row.status === "analyzing" && (
                      <Loader2 className="w-5 h-5 md:w-8 md:h-8 text-primary animate-spin" />
                    )}
                    {row.status === "error" && (
                      <span className="text-[10px] md:text-[14px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-primary/20">
                        FAILED
                      </span>
                    )}
                    {row.status === "scored" && (
                      <ScoreBadge score={row.score || 0} className="scale-75 md:scale-100 origin-right" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {visibleCards.length === 0 && !isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm font-mono text-neutral-900 font-bold uppercase tracking-widest animate-pulse">Waiting for stream...</p>
              </div>
            )}
          </div>
        </motion.div>
        
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

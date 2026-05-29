"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ScoreBadge } from "@/components/ScoreBadge";
import { CandidateDrawer } from "@/components/CandidateDrawer";
import { Button } from "@/components/ui/Button";
import { getRankEmoji, cn } from "@/lib/utils";
import type { CandidateResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ResultsDashboard({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();

  const { sessionId: storeSessionId, setSessionId, setCandidates, candidates } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);

  useEffect(() => {
    if (storeSessionId !== sessionId) {
      setSessionId(sessionId);
    }

    fetch(`/api/v1/sessions/${sessionId}/results`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCandidates(data.candidates);
        setJobTitle(data.session.jobTitle);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [sessionId, storeSessionId, setSessionId, setCandidates]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading results...</div>;
  }

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}/export?format=csv`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recruvia-export-${sessionId.slice(0, 8)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      alert("Export failed. (Make sure export API is implemented)");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-primary/5 border-b border-primary/10 pointer-events-none" />

      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 pt-10 pb-10 relative z-10 min-h-0">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-fade-in-up">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-warm border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] rounded-sm">
                <div className="w-2.5 h-2.5 bg-success rounded-sm border border-neutral-900 animate-pulse" />
                <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest mt-[1px]">Analysis Complete</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sessionId);
                  toast.success("Session ID copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary border border-neutral-900 shadow-[2px_2px_0px_#1A1412] text-white hover:bg-primary-dark transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A1412]"
                title="Click to copy Session ID"
              >
                <span className="text-xs font-mono font-medium">ID: {sessionId.slice(0, 8)}...</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Copy</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Results for {jobTitle}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Ranked {candidates.length} candidates based on your Job Description.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 mt-4 md:mt-0">
            <Button variant="secondary" onClick={() => router.push("/")} className="w-full sm:w-auto">
              Start New Session
            </Button>
            <Button variant="inverse" onClick={handleExport} className="w-full sm:w-auto">
              <span className="mr-2">↓</span> Export CSV
            </Button>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="flex-1 bg-[#F3EFE9] border-2 border-neutral-900 rounded-xl shadow-[4px_4px_0px_#1A1412] flex flex-col overflow-hidden animate-fade-in relative z-10 -mx-6 md:mx-0">
          <div className="flex-1 overflow-x-auto md:overflow-x-visible flex flex-col">
            <div className="min-w-0 md:min-w-[700px] flex flex-col flex-1">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[80px_minmax(200px,1fr)_120px_140px] gap-4 px-6 py-3 border-b-2 border-neutral-900 bg-surface-warm text-xs font-bold text-neutral-900 uppercase tracking-wider shrink-0">
                <div className="text-center">Rank</div>
                <div>Candidate Info</div>
                <div className="text-center">Match Score</div>
                <div></div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {candidates.map((candidate, index) => (
                    <motion.div
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex flex-col md:grid md:grid-cols-[80px_minmax(200px,1fr)_120px_140px] gap-3 md:gap-4 px-4 md:px-6 py-4 border-b-2 border-neutral-900 items-start md:items-center hover:bg-surface-warm cursor-pointer transition-colors group relative"
                    >
                      {/* Rank */}
                      <div className="absolute right-4 top-4 md:static text-center">
                        <span className="text-xl">{getRankEmoji(candidate.rank || 0)}</span>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0 pr-12 md:pr-0">
                        <span className="text-sm font-bold text-neutral-900 truncate">
                          {candidate.name || candidate.originalName}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500 mt-0.5">
                          {candidate.email && <span className="truncate">{candidate.email}</span>}
                          {candidate.phone && <span className="hidden md:inline">·</span>}
                          {candidate.phone && <span>{candidate.phone}</span>}
                          {!candidate.email && !candidate.phone && <span>Missing contact info</span>}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2 mt-1 md:mt-0 md:justify-center w-full md:w-auto">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider md:hidden">Match Score:</span>
                        <ScoreBadge score={candidate.totalScore || 0} />
                      </div>

                      {/* Action */}
                      <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0 pr-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full md:w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {candidates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                    <p>No candidates found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CandidateDrawer
        isOpen={!!selectedCandidate}
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}

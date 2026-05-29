"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CandidateResult } from "@/types";
import { ScoreBadge } from "./ScoreBadge";
import { ScoreBar } from "./ScoreBar";
import { SkillChip } from "./SkillChip";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";

interface CandidateDrawerProps {
  candidate: CandidateResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDrawer({ candidate, isOpen, onClose }: CandidateDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && candidate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-surface-white border-l-2 border-neutral-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b-2 border-neutral-900">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-neutral-900 tracking-tight mb-1"
                >
                  {candidate.name || candidate.originalName}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3 text-sm text-neutral-500"
                >
                  {candidate.email && (
                    <a href={`mailto:${candidate.email}`} className="hover:text-primary transition-colors">
                      {candidate.email}
                    </a>
                  )}
                  {candidate.email && candidate.phone && <span>·</span>}
                  {candidate.phone && <span>{candidate.phone}</span>}
                </motion.div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Top Level Score */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 bg-surface-warm rounded-2xl p-4 border border-neutral-200"
              >
                <ScoreBadge score={candidate.totalScore || 0} size="lg" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-0.5">
                    Total Match
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Ranked #{candidate.rank} overall
                  </p>
                </div>
              </motion.div>

              {/* Rationale */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Analysis Summary
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed bg-primary-light/50 p-4 rounded-xl border border-primary/10">
                  {candidate.scoringRationale || "No rationale available."}
                </p>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                  Score Breakdown
                </h3>
                <div className="flex flex-col gap-4">
                  <ScoreBar score={candidate.skillScore || 0} label="Hard Skills" />
                  <ScoreBar score={candidate.experienceScore || 0} label="Experience" />
                  <ScoreBar score={candidate.educationScore || 0} label="Education" />
                  <ScoreBar score={candidate.keywordScore || 0} label="Keywords & Formatting" />
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Skills Analysis
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs text-neutral-500 mb-2 block">Matched Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matchedSkills.length > 0 ? (
                        candidate.matchedSkills.map(s => <SkillChip key={s} label={s} variant="matched" />)
                      ) : (
                        <span className="text-sm text-neutral-400 italic">None detected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 mb-2 block">Missing Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {candidate.missingSkills.length > 0 ? (
                        candidate.missingSkills.map(s => <SkillChip key={s} label={s} variant="missing" />)
                      ) : (
                        <span className="text-sm text-neutral-400 italic">None missing</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex gap-3 shrink-0">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  window.open(`/api/v1/sessions/${candidate.sessionId}/resumes/${candidate.id}/url`, '_blank');
                }}
              >
                <FileText size={16} className="mr-2 inline" />
                View Resume File
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { toast } from "sonner";

const GraphicV1 = () => (
  <div className="hidden md:flex flex-1 relative h-[500px] w-full items-center justify-center pointer-events-none">
    {/* Card 1 (Back, Left) */}
    <div className="absolute left-[10%] top-[10%] w-[280px] bg-surface-warm border-2 border-neutral-900 rounded-xl p-5 shadow-[4px_4px_0px_#1A1412] animate-float rotate-[-6deg] opacity-80 z-0">
      <div className="h-4 w-24 bg-neutral-300 rounded mb-4" />
      <div className="h-3 w-full bg-neutral-300/50 rounded mb-2" />
      <div className="h-3 w-4/5 bg-neutral-300/50 rounded" />
    </div>

    {/* Card 2 (Back, Right) */}
    <div className="absolute right-[5%] bottom-[15%] w-[320px] bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[8px_8px_0px_#1A1412] animate-float-delayed rotate-[8deg] z-10">
      <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">JD</div>
          <div>
            <div className="h-4 w-32 bg-neutral-900 rounded mb-2" />
            <div className="h-3 w-20 bg-neutral-500 rounded" />
          </div>
      </div>
      <div className="flex gap-2">
          <div className="h-6 w-16 bg-primary-light rounded-full border border-primary/20" />
          <div className="h-6 w-20 bg-primary-light rounded-full border border-primary/20" />
      </div>
    </div>

    {/* Card 3 (Hero, Center Front) */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-primary border-2 border-neutral-900 rounded-xl p-6 shadow-[12px_12px_0px_#1A1412] z-20 animate-float">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg border-2 border-neutral-900 flex items-center justify-center text-xl font-bold text-primary shadow-[2px_2px_0px_#1A1412]">
            98
          </div>
          <div>
            <div className="h-5 w-32 bg-white rounded mb-2" />
            <div className="h-3 w-24 bg-primary-light/50 rounded" />
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-success border-2 border-neutral-900 flex items-center justify-center shadow-[2px_2px_0px_#1A1412]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
      
      <div className="space-y-3">
          <div className="h-2 w-full bg-primary-light/30 rounded-full overflow-hidden">
            <div className="h-full w-[98%] bg-white rounded-full" />
          </div>
          <div className="h-2 w-full bg-primary-light/30 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-white rounded-full" />
          </div>
          <div className="h-2 w-full bg-primary-light/30 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-white rounded-full" />
          </div>
      </div>
    </div>
  </div>
);

const GraphicV2 = () => (
  <div className="hidden md:flex flex-1 relative h-[600px] w-full items-center justify-center pointer-events-none perspective-1000 mt-4">
    {/* Background Decorative Rings */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border-2 border-dashed border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
    
    {/* Candidate 3 (Bottom Rank) */}
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute top-[60%] right-[2%] w-[340px] bg-surface-warm border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] z-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-neutral-900 flex items-center justify-center text-sm font-bold text-neutral-500">
            #3
          </div>
          <div className="h-4 w-28 bg-neutral-300 rounded" />
        </div>
        <div className="text-2xl font-black text-neutral-400">72</div>
      </div>
      <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div className="h-full w-[72%] bg-neutral-400 rounded-full" />
      </div>
    </motion.div>

    {/* Candidate 2 (Middle Rank) */}
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute top-[38%] right-[12%] w-[380px] bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[8px_8px_0px_#1A1412] z-20"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center text-base font-bold text-neutral-900 shadow-[2px_2px_0px_#1A1412]">
            #2
          </div>
          <div className="h-5 w-32 bg-neutral-900 rounded" />
        </div>
        <div className="text-3xl font-black text-neutral-900">85</div>
      </div>
      <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div className="h-full w-[85%] bg-neutral-900 rounded-full" />
      </div>
    </motion.div>

    {/* Candidate 1 (Top Rank - Hero) */}
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute top-[15%] right-[22%] w-[440px] bg-primary border-2 border-neutral-900 rounded-xl p-8 shadow-[12px_12px_0px_#1A1412] z-30 animate-float"
    >
      <div className="absolute -top-5 -left-5 w-14 h-14 bg-success border-2 border-neutral-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1A1412] z-40 transform -rotate-12">
        <span className="text-white text-2xl">👑</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg border-2 border-neutral-900 flex items-center justify-center text-2xl font-black text-primary shadow-[4px_4px_0px_#1A1412]">
            #1
          </div>
          <div>
            <div className="h-6 w-40 bg-white rounded mb-2.5" />
            <div className="h-4 w-28 bg-primary-light/50 rounded" />
          </div>
        </div>
        <div className="text-5xl font-black text-white drop-shadow-[4px_4px_0px_#1A1412]">98</div>
      </div>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs text-white/90 font-bold uppercase mb-1.5">
            <span>Hard Skills</span>
            <span>95/100</span>
          </div>
          <div className="h-2.5 w-full bg-primary-light/30 rounded-full overflow-hidden">
            <div className="h-full w-[95%] bg-success rounded-full" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-white/90 font-bold uppercase mb-1.5">
            <span>Experience</span>
            <span>100/100</span>
          </div>
          <div className="h-2.5 w-full bg-primary-light/30 rounded-full overflow-hidden">
            <div className="h-full w-[100%] bg-white rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>

  </div>
);

export default function LandingPage() {
  const router = useRouter();
  const { setSessionId, resetAll, setGlobalLoading } = useAppStore();
  const [sessionInput, setSessionInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleStartScreening = async () => {
    setIsCreating(true);
    setGlobalLoading(true, "INITIALIZING SESSION...");
    try {
      resetAll(); // Clear all previous uploads and JD data
      const res = await fetch("/api/v1/sessions", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create session");
      const data = await res.json();
      setSessionId(data.sessionId);
      router.push(`/new?session=${data.sessionId}`);
    } catch {
      toast.error("Failed to start screening. Please try again.");
      setGlobalLoading(false);
    } finally {
      setIsCreating(false);
      // Wait for route transition before clearing loader
      setTimeout(() => setGlobalLoading(false), 500);
    }
  };

  const handleResumeSession = () => {
    const id = sessionInput.trim();
    if (!id) {
      toast.warning("Please enter a Session ID.");
      return;
    }
    setGlobalLoading(true, "RESUMING SESSION...");
    setSessionId(id);
    router.push(`/session/${id}/results`);
    setTimeout(() => setGlobalLoading(false), 500);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />

      {/* Soft radial glow behind CTA */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(154,0,2,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-10 max-w-7xl mx-auto w-full gap-8 lg:gap-12 py-4 lg:py-8 relative z-10">
        
        {/* Left: Typography & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 w-full flex flex-col items-start text-left max-w-[600px]"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-[80px] font-bold text-primary tracking-tighter leading-[1.0] mb-6"
          >
            Review resumes with <br className="hidden md:block"/>confidence.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-700 max-w-[500px] leading-relaxed mb-8 font-medium"
          >
            Upload your candidates' resumes, paste the job description, and we'll help you organize and review them efficiently.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:min-w-[260px] h-14 text-lg font-bold"
              onClick={handleStartScreening}
              isLoading={isCreating}
            >
              {isCreating ? "Initializing..." : "Start Screening →"}
            </Button>
          </motion.div>

          {/* Session Resume Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-[420px] bg-surface-white p-5 rounded-xl border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] mt-10"
          >
            <p className="text-[13px] text-neutral-500 mb-3 font-bold uppercase tracking-wider">
              Resume a session
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Session ID…"
                  value={sessionInput}
                  onChange={(e) => setSessionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResumeSession()}
                />
              </div>
              <Button
                variant="secondary"
                onClick={handleResumeSession}
                className="shrink-0 bg-white"
              >
                Go
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Abstract CSS Composition */}
        {/* <GraphicV1 /> */}
        <GraphicV2 />
      </div>

      {/* Footer */}
      <footer className="py-2 pb-6 text-center shrink-0">
        <p className="text-xs text-neutral-500">
          Files are automatically deleted after 30 days · No account required
        </p>
      </footer>
    </div>
  );
}

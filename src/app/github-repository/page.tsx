"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  Folder, 
  FileText, 
  Terminal, 
  Copy, 
  Check, 
  Database, 
  Brain, 
  Upload, 
  Cpu,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  GitFork,
  Activity,
  FileCode,
  BookOpen
} from "lucide-react";

// Package Manager commands mapping
const COMMANDS = {
  npm: [
    { label: "Clone & Install dependencies", cmd: "git clone https://github.com/Prathmesh-D/Recruvia.git && npm install" },
    { label: "Generate Prisma Client ORM", cmd: "npx prisma generate" },
    { label: "Synchronize local database models", cmd: "npx prisma db push" },
    { label: "Launch hot-reload dev server", cmd: "npm run dev" }
  ],
  yarn: [
    { label: "Clone & Install dependencies", cmd: "git clone https://github.com/Prathmesh-D/Recruvia.git && yarn install" },
    { label: "Generate Prisma Client ORM", cmd: "yarn prisma generate" },
    { label: "Synchronize local database models", cmd: "yarn prisma db push" },
    { label: "Launch hot-reload dev server", cmd: "yarn dev" }
  ],
  pnpm: [
    { label: "Clone & Install dependencies", cmd: "git clone https://github.com/Prathmesh-D/Recruvia.git && pnpm install" },
    { label: "Generate Prisma Client ORM", cmd: "pnpm prisma generate" },
    { label: "Synchronize local database models", cmd: "pnpm prisma db push" },
    { label: "Launch hot-reload dev server", cmd: "pnpm dev" }
  ]
};

// Architecture Pipeline Steps
const ARCH_STEPS = [
  {
    title: "Resume Ingestion",
    subtitle: "Step 01",
    desc: "Uses custom HTML5 dropzones and mammoth/pdf2json streams to capture and extract text profiles.",
    tech: "PDF/Word Parser",
    latency: "~40ms",
    type: "Stream Input"
  },
  {
    title: "SSE SSE Broadcasting",
    subtitle: "Step 02",
    desc: "Broadcasting real-time evaluation ticks and queue status directly to standard client controllers.",
    tech: "Next Server SSE",
    latency: "~10ms",
    type: "Push Stream"
  },
  {
    title: "Gemini Structured Analysis",
    subtitle: "Step 03",
    desc: "Gemini 2.0 Flash parses resumes against JD metrics utilizing strict responseSchema parameters.",
    tech: "Google GenAI API",
    latency: "~1200ms",
    type: "AI Pipeline"
  },
  {
    title: "Prisma Relational Sync",
    subtitle: "Step 04",
    desc: "Writes parsed candidate grades, keywords, and contact metadata into local PostgreSQL databases.",
    tech: "Prisma & Postgres",
    latency: "~80ms",
    type: "Database Sync"
  }
];

// Interactive File Tree data
const FILE_TREE = [
  {
    path: "src",
    name: "src",
    type: "folder" as const,
    level: 0,
  },
  {
    path: "src/app",
    name: "app",
    type: "folder" as const,
    level: 1,
  },
  {
    path: "src/app/api",
    name: "api",
    type: "folder" as const,
    level: 2,
  },
  {
    path: "src/app/api/session/[sessionId]/route.ts",
    name: "route.ts",
    type: "file" as const,
    level: 3,
    purpose: "Handles real-time resume scanning status and progress streams. Connects client to Server-Sent Events (SSE) for instant, live updates.",
    imports: ["next/server", "@/lib/prisma", "@google/generative-ai"],
    exports: ["GET (Server-Sent Event emitter)"],
    codeSnippet: `// src/app/api/session/[sessionId]/route.ts
export async function GET(req: NextRequest, { params }) {
  const { sessionId } = params;
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  
  // Establish Server-Sent Events stream
  const encoder = new TextEncoder();
  writer.write(encoder.encode("event: open\\ndata: {}\\n\\n"));
  
  // Emit processing progress dynamically...
}`
  },
  {
    path: "src/app/session",
    name: "session",
    type: "folder" as const,
    level: 2,
  },
  {
    path: "src/app/session/[sessionId]",
    name: "[sessionId]",
    type: "folder" as const,
    level: 3,
  },
  {
    path: "src/app/session/[sessionId]/page.tsx",
    name: "page.tsx",
    type: "file" as const,
    level: 4,
    purpose: "The interactive processing room. Renders the vertical 3-card carousel feed displaying parsed files as the AI pipeline scans them.",
    imports: ["framer-motion", "lucide-react", "@/components/ui/Button"],
    exports: ["SessionPage (default export)"],
    codeSnippet: `// src/app/session/[sessionId]/page.tsx
export default function SessionPage({ params }) {
  const { sessionId } = params;
  const [activeCard, setActiveCard] = useState(0);
  
  return (
    <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-8">
      {/* 3-Card Vertical Carousel */}
      <CarouselFeed items={queue} active={activeCard} />
    </div>
  );
}`
  },
  {
    path: "src/app/session/[sessionId]/results",
    name: "results",
    type: "folder" as const,
    level: 4,
  },
  {
    path: "src/app/session/[sessionId]/results/page.tsx",
    name: "page.tsx",
    type: "file" as const,
    level: 5,
    purpose: "Renders the dashboard candidate table, detailed sub-score analysis modals, ranking metrics, and exports reports.",
    imports: ["react", "lucide-react", "recharts", "@/lib/prisma"],
    exports: ["ResultsDashboard (default export)"],
    codeSnippet: `// src/app/session/[sessionId]/results/page.tsx
export default function ResultsDashboard({ params }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  return (
    <div className="space-y-6">
      <RankingsTable 
        candidates={candidates} 
        onSelect={setSelectedCandidate} 
      />
      {selectedCandidate && <DetailModal candidate={selectedCandidate} />}
    </div>
  );
}`
  },
  {
    path: "src/components",
    name: "components",
    type: "folder" as const,
    level: 1,
  },
  {
    path: "src/components/ResumeDropzone.tsx",
    name: "ResumeDropzone.tsx",
    type: "file" as const,
    level: 2,
    purpose: "Custom neobrutalist dropzone. Captures drag-and-drop actions, reads PDF/Word uploads, and initializes analysis sessions.",
    imports: ["react-dropzone", "lucide-react", "framer-motion"],
    exports: ["ResumeDropzone"],
    codeSnippet: `// src/components/ResumeDropzone.tsx
export function ResumeDropzone({ onUploadComplete }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"] },
    multiple: true
  });
  
  return (
    <div {...getRootProps()} className="border-dashed border-2 p-10 cursor-pointer">
      <input {...getInputProps()} />
      <Upload className="mx-auto text-primary animate-bounce mb-3" />
      <p>Drag files or click to upload candidates</p>
    </div>
  );
}`
  },
  {
    path: "src/lib",
    name: "lib",
    type: "folder" as const,
    level: 1,
  },
  {
    path: "src/lib/gemini.ts",
    name: "gemini.ts",
    type: "file" as const,
    level: 2,
    purpose: "AI scoring pipeline configuration. Sets system instructions, structures Gemini API requests, and executes schema verification via Zod object models.",
    imports: ["@google/generative-ai", "zod", "@/lib/prisma"],
    exports: ["evaluateResume", "geminiModel"],
    codeSnippet: `// src/lib/gemini.ts
import { GoogleGenAI } from "@google/generative-ai";
import { z } from "zod";

const responseSchema = z.object({
  candidateName: z.string(),
  overallScore: z.number(),
  matchedSkills: z.array(z.string())
});

export async function evaluateResume(text: string, jd: string) {
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: { responseSchema, responseMimeType: "application/json" }
  });
}`
  },
  {
    path: "prisma",
    name: "prisma",
    type: "folder" as const,
    level: 0,
  },
  {
    path: "prisma/schema.prisma",
    name: "schema.prisma",
    type: "file" as const,
    level: 1,
    purpose: "Relational database schema mapping models for Candidates, JD requirements, evaluation sessions, and parsed sub-scores.",
    imports: ["datasource db", "generator client"],
    exports: ["Candidate (Model)", "Session (Model)", "Score (Model)"],
    codeSnippet: `// prisma/schema.prisma
model Candidate {
  id             String   @id @default(uuid())
  name           String
  email          String?
  phone          String?
  skillsScore    Float
  experienceScore Float
  overallScore   Float
  sessionId      String
  session        Session  @relation(fields: [sessionId], references: [id])
}`
  }
];

function TerminalCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1A1412] border-2 border-neutral-900 p-3 rounded-lg relative flex justify-between items-center group font-mono text-[11px] text-[#F3EFE9] shadow-inner">
      <div className="flex items-center gap-2 overflow-x-auto pr-4 scrollbar-none">
        <span className="text-primary font-bold select-none">$</span>
        <span>{command}</span>
      </div>
      <button
        onClick={handleCopy}
        className="w-7 h-7 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 transition-colors cursor-pointer shrink-0"
        title="Copy to clipboard"
      >
        {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export default function GitHubRepositoryPage() {
  const router = useRouter();
  const [activePkgManager, setActivePkgManager] = useState<"npm" | "yarn" | "pnpm">("npm");
  const [activeArchStep, setActiveArchStep] = useState<number>(2);
  
  // File Explorer State
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "src/app": true,
    "src/app/api": true,
    "src/app/session": false,
    "src/app/session/[sessionId]": false,
    "src/components": true,
    "src/lib": true,
    "prisma": true
  });
  const [activeFilePath, setActiveFilePath] = useState<string>("src/lib/gemini.ts");

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Find the details of the active file
  const activeFile = FILE_TREE.find(item => item.path === activeFilePath && item.type === "file");

  // Check if flat tree item should render based on parent expansions
  const isItemVisible = (itemPath: string) => {
    const parts = itemPath.split("/");
    if (parts.length === 1) return true; // root level
    
    // Check all nested parent folders
    for (let i = 1; i < parts.length; i++) {
      const parentPath = parts.slice(0, i).join("/");
      if (expandedFolders[parentPath] === false) {
        return false;
      }
    }
    return true;
  };

  const stats = [
    { label: "Core Stack", value: "Next.js 15 / TS", desc: "Cherry Vanilla Theme", color: "border-primary text-primary" },
    { label: "AI Engine", value: "Gemini 2.0 Flash", desc: "Zod Schema Enforced", color: "border-primary text-primary" },
    { label: "Database ORM", value: "Prisma / Postgres", desc: "Supabase Relational", color: "border-neutral-900 text-neutral-900" },
    { label: "Build Integrity", value: "Online / Validated", desc: "npx tsc passing", color: "border-success text-success" }
  ];

  return (
    <div className="flex-1 w-full bg-surface min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col relative z-10 gap-6">
        
        {/* Top Layout: Header Info (Left) + Stats (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Header card (Left) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-9 bg-surface-white border-2 border-neutral-900 rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_#1A1412] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 h-full"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-warm border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] rounded-sm mb-3">
                <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest mt-[1px]">
                  Recruvia Open Source Core
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-neutral-900">
                System Architecture & Code
              </h1>
              <p className="text-neutral-700 text-sm font-medium leading-relaxed max-w-[500px]">
                Explore candidate parsing streams, structured Gemini configurations, and PostgreSQL migration instructions.
              </p>
            </div>
            
            <a
              href="https://github.com/Prathmesh-D/Recruvia.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] text-white hover:bg-primary-dark transition-all font-bold text-xs uppercase tracking-wider rounded-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1412] shrink-0"
            >
              <GitFork size={14} /> View Recruvia GitHub
            </a>
          </motion.div>

          {/* Stats Grid Banner (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-white border-2 border-neutral-900 rounded-xl p-3 text-center lg:text-left lg:flex lg:items-center lg:justify-between shadow-[4px_4px_0px_#1A1412] hover:-translate-y-0.5 transition-all h-full lg:px-4"
              >
                <div>
                  <div className="text-[9px] font-black text-neutral-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-sm sm:text-base font-black text-neutral-900 mt-1 font-heading leading-none">{stat.value}</div>
                </div>
                <div className="hidden lg:block text-[9px] font-bold text-primary max-w-[80px] text-right truncate whitespace-normal">
                  {stat.desc}
                </div>
                <div className="lg:hidden text-[9px] font-bold text-primary mt-1 border-t border-neutral-200 pt-1.5 truncate">{stat.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Interactive IDE Explorer Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-surface-white border-2 border-neutral-900 rounded-xl shadow-[8px_8px_0px_#1A1412] overflow-hidden flex flex-col"
        >
          {/* Editor Header Bar */}
          <div className="bg-surface-warm border-b-2 border-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary border border-neutral-900 inline-block" />
                <span className="w-3 h-3 rounded-full bg-surface-white border border-neutral-900 inline-block" />
                <span className="w-3 h-3 rounded-full bg-success border border-neutral-900 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-700 ml-2 select-none">
                recruvia-ide://workspace
              </span>
            </div>
            <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-primary uppercase select-none">
              interactive explorer
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            {/* Sidebar list (md:col-span-4) */}
            <div className="md:col-span-4 border-b-2 md:border-b-0 md:border-r-2 border-neutral-900 bg-surface-white p-4 overflow-y-auto max-h-[300px] md:max-h-none">
              <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 select-none">
                File System Map
              </div>
              <div className="font-mono text-xs text-neutral-700 space-y-1">
                {FILE_TREE.map((item) => {
                  const visible = isItemVisible(item.path);
                  if (!visible) return null;

                  const isFolder = item.type === "folder";
                  const isExpanded = expandedFolders[item.path];
                  const isActive = activeFilePath === item.path;

                  return (
                    <div
                      key={item.path}
                      style={{ paddingLeft: `${item.level * 12}px` }}
                      onClick={() => {
                        if (isFolder) {
                          toggleFolder(item.path);
                        } else {
                          setActiveFilePath(item.path);
                        }
                      }}
                      className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-colors select-none ${
                        isActive 
                          ? "bg-primary text-white font-bold" 
                          : "hover:bg-surface-warm/60 text-neutral-950"
                      }`}
                    >
                      {isFolder ? (
                        <>
                          {isExpanded ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
                          <Folder size={14} className={isActive ? "text-white shrink-0" : "text-primary shrink-0"} />
                        </>
                      ) : (
                        <>
                          <span className="w-3 shrink-0" />
                          <FileText size={14} className={isActive ? "text-white shrink-0" : "text-neutral-500 shrink-0"} />
                        </>
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editor preview (md:col-span-8) */}
            <div className="md:col-span-8 bg-surface-warm/20 p-6 flex flex-col justify-between">
              {activeFile ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-3">
                      <div>
                        <div className="text-[9px] font-black text-primary font-mono tracking-wider uppercase">
                          selected module
                        </div>
                        <h4 className="text-base font-black text-neutral-900 font-mono mt-0.5">
                          {activeFile.path.split("/").pop()}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono bg-surface-white border border-neutral-400 rounded px-2 py-0.5 text-neutral-600">
                        {activeFile.path}
                      </span>
                    </div>

                    {/* Description Section */}
                    <div className="mt-3.5 space-y-2.5">
                      <div>
                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wide">Purpose</span>
                        <p className="text-xs text-neutral-700 font-medium leading-relaxed mt-0.5">
                          {activeFile.purpose}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 pt-1">
                        <div>
                          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wide">Imports</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeFile.imports?.map(imp => (
                              <span key={imp} className="text-[9px] font-mono bg-surface-white border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-700">
                                {imp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wide">Core Exports</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeFile.exports?.map(exp => (
                              <span key={exp} className="text-[9px] font-mono bg-primary-light border border-primary/20 rounded px-1.5 py-0.5 text-primary font-bold">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <div className="text-[9px] font-black text-neutral-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <FileCode size={12} className="text-primary" /> Implementation Snapshot
                    </div>
                    <div className="bg-[#1A1412] border-2 border-neutral-900 p-4 rounded-lg font-mono text-[10px] text-[#F3EFE9] overflow-x-auto shadow-inner select-text">
                      <pre className="whitespace-pre scrollbar-thin">
                        <code>{activeFile.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-400 rounded-lg">
                  <FileText size={42} className="text-neutral-400 mb-2.5 animate-pulse" />
                  <h4 className="font-bold text-neutral-700 text-sm">No File Selected</h4>
                  <p className="text-xs text-neutral-400 max-w-[280px] mt-1 font-semibold">
                    Click any code module file in the workspace directory explorer on the left to see its implementation overview.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Setup Console & System Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Architecture Pipeline Details (md:col-span-5) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-5 bg-surface-white border-2 border-neutral-900 rounded-xl p-5 shadow-[6px_6px_0px_#1A1412] flex flex-col"
          >
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2 select-none">
              <Cpu size={16} className="text-primary animate-spin" style={{ animationDuration: "3s" }} /> Pipeline Execution Nodes
            </h3>
            
            <div className="flex-1 flex flex-col justify-between gap-3">
              {ARCH_STEPS.map((step, idx) => {
                const isActive = activeArchStep === idx;
                return (
                  <div
                    key={step.title}
                    onClick={() => setActiveArchStep(idx)}
                    className={`border-2 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 select-none ${
                      isActive 
                        ? "bg-primary-light border-primary shadow-[2px_2px_0px_#B50002] -translate-y-0.5" 
                        : "bg-surface-white border-neutral-900 hover:bg-surface-warm/40 shadow-[2px_2px_0px_#1A1412]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono font-bold px-1 py-0.2 border rounded shrink-0 ${
                          isActive 
                            ? "bg-primary text-white border-primary" 
                            : "bg-surface-warm border-neutral-900 text-neutral-800"
                        }`}>
                          {step.subtitle}
                        </span>
                        <h4 className="font-extrabold text-[11px] text-neutral-900 truncate">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-semibold truncate mt-1">
                        {step.desc}
                      </p>
                    </div>
                    <ChevronRight size={14} className={`shrink-0 ${isActive ? "text-primary" : "text-neutral-400"}`} />
                  </div>
                );
              })}
            </div>

            {/* Expanded step details modal card inside sidebar */}
            <div className="bg-surface-warm border-2 border-neutral-900 p-3.5 rounded-lg mt-4 shadow-[2.5px_2.5px_0px_#1A1412]">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[8px] font-black tracking-widest text-primary uppercase font-mono">
                  {ARCH_STEPS[activeArchStep].type}
                </span>
                <span className="text-[9px] font-bold font-mono text-neutral-500">
                  Latency: {ARCH_STEPS[activeArchStep].latency}
                </span>
              </div>
              <h5 className="font-black text-xs text-neutral-900 mt-1">
                {ARCH_STEPS[activeArchStep].tech}
              </h5>
              <p className="text-[10px] text-neutral-700 font-medium leading-relaxed mt-1.5">
                {ARCH_STEPS[activeArchStep].desc}
              </p>
            </div>
          </motion.div>

          {/* Setup Console Card (md:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-7 bg-surface-white border-2 border-neutral-900 rounded-xl p-5 shadow-[6px_6px_0px_#1A1412] flex flex-col justify-between"
          >
            <div>
              {/* Header with terminal icon & tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-neutral-900 pb-2 mb-4">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 select-none">
                  <Terminal size={16} className="text-primary" /> Setup Terminal Console
                </h3>
                
                {/* Console tabs */}
                <div className="flex border-2 border-neutral-900 rounded-md overflow-hidden bg-surface-warm shadow-[1.5px_1.5px_0px_#1A1412]">
                  {(["npm", "yarn", "pnpm"] as const).map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => setActivePkgManager(pkg)}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                        activePkgManager === pkg 
                          ? "bg-primary text-white" 
                          : "hover:bg-surface-white text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-600 font-semibold leading-relaxed mb-4">
                Configure your environment, install relevant package models, and run the hot-reloading development server locally:
              </p>
            </div>

            {/* List of console commands */}
            <div className="space-y-3">
              {COMMANDS[activePkgManager].map((item, index) => (
                <div key={index} className="space-y-1">
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider ml-1">
                    {item.label}
                  </span>
                  <TerminalCommand command={item.cmd} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex justify-center"
        >
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => router.push("/")} 
            className="px-8 shadow-[4px_4px_0px_#1A1412] bg-white hover:bg-primary-light"
          >
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

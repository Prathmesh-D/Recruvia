"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  Mail, 
  FileText, 
  Shield, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Code2, 
  Layers, 
  Lock, 
  Server, 
  ExternalLink 
} from "lucide-react";

type TabType = "about" | "skills" | "projects" | "credentials";

function TypewriterEffect() {
  const phrases = [
    "Building secure, production-grade software",
    "Java + React + TypeScript developer",
    "AES encryption researcher @ IJSRD",
    "Always shipping, always learning"
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 20 : 40;
    
    if (!isDeleting && displayedText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(
          isDeleting
            ? currentPhrase.substring(0, displayedText.length - 1)
            : currentPhrase.substring(0, displayedText.length + 1)
        );
      }, typingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <div className="min-h-[24px] flex items-center justify-center md:justify-start">
      <span className="font-mono text-xs sm:text-sm font-bold text-primary">
        {displayedText}
      </span>
      <span className="w-1.5 h-4 bg-primary ml-1 animate-pulse shrink-0" />
    </div>
  );
}

export default function DeveloperPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("about");

  const tabs = [
    { id: "about", label: "About & Journey", icon: GraduationCap },
    { id: "skills", label: "Tech Stack", icon: Code2 },
    { id: "projects", label: "Projects & Research", icon: Layers },
    { id: "credentials", label: "Certifications", icon: Award },
  ];

  const stats = [
    { label: "B.Tech IT", value: "7.92 CGPA", desc: "MITS Gwalior", color: "border-primary text-primary" },
    { label: "Diploma CS", value: "8.09 CGPA", desc: "GPC Betul", color: "border-success text-success" },
    { label: "Publications", value: "1 Paper", desc: "IJSRD Cryptography", color: "border-neutral-900 text-neutral-900" },
    { label: "Credentials", value: "3 Active", desc: "AWS, Walmart, IIT", color: "border-neutral-900 text-neutral-900" }
  ];

  return (
    <div className="flex-1 w-full bg-surface min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col relative z-10">
        
        {/* Top Layout: Profile (Left) + Stats (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Header Profile Section (Left) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-9 bg-surface-white border-2 border-neutral-900 rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_#1A1412] flex flex-col md:flex-row items-center gap-6 sm:gap-8 h-full"
          >
            {/* Avatar Area */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-primary/15 rounded-full border-2 border-neutral-900 flex flex-col items-center justify-center shadow-[4px_4px_0px_#1A1412] shrink-0">
              <span className="font-heading font-black text-2xl text-primary mt-1">PD</span>
              <span className="text-[10px] font-bold text-neutral-500 font-mono">DEVELOPER</span>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-warm border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] rounded-sm mb-3">
                <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest mt-[1px]">
                  Full Stack Developer · Security Enthusiast · Published Researcher
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-2">
                Prathmesh Deshkar
              </h1>
              
              {/* Dynamic Typewriter effect */}
              <div className="mb-4">
                <TypewriterEffect />
              </div>

              {/* Social Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <a
                  href="https://linkedin.com/in/prathmesh-deshkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] text-white border-2 border-neutral-900 rounded-md font-bold text-xs shadow-[2px_2px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1A1412] transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Prathmesh-D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181717] text-white border-2 border-neutral-900 rounded-md font-bold text-xs shadow-[2px_2px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1A1412] transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.62-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.22.694.825.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="mailto:pdeshkar350@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EA4335] text-white border-2 border-neutral-900 rounded-md font-bold text-xs shadow-[2px_2px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1A1412] transition-all"
                >
                  <Mail size={14} /> Email
                </a>
                <a
                  href="https://prathmesh-d.github.io/Resume/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4285F4] text-white border-2 border-neutral-900 rounded-md font-bold text-xs shadow-[2px_2px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1A1412] transition-all"
                >
                  <FileText size={14} /> Resume
                </a>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid Banner (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3.5 h-full"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-white border-2 border-neutral-900 rounded-xl p-3 text-center lg:text-left lg:flex lg:items-center lg:justify-between shadow-[4px_4px_0px_#1A1412] hover:-translate-y-0.5 transition-all h-full lg:px-4"
              >
                <div>
                  <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-base lg:text-lg font-extrabold text-neutral-900 mt-1 font-heading leading-none">{stat.value}</div>
                </div>
                <div className="hidden lg:block text-[9px] font-bold text-neutral-400 max-w-[80px] text-right truncate whitespace-normal">
                  {stat.desc}
                </div>
                <div className="lg:hidden text-[9px] font-bold text-neutral-400 mt-0.5 truncate">{stat.desc}</div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b-2 border-neutral-900 mb-8 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A1412] ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-surface-white hover:bg-surface-warm text-neutral-700 hover:text-neutral-900"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* About & Education */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Profile Card & Highlights (Left) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-5 shadow-[6px_6px_0px_#1A1412]">
                    <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider mb-3 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      About Me
                    </h3>
                    <div className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                      <p>
                        Full Stack Developer and IT undergraduate at Madhav Institute of Technology and Science, Gwalior, passionate about building secure, scalable applications. Focus lies at the intersection of software engineering, cryptography, and cloud deployment, creating systems that are reliable, maintainable, and built with security in mind.
                      </p>
                    </div>

                    {/* Moto Blockquote */}
                    <div className="bg-surface-warm border border-neutral-900 shadow-[2px_2px_0px_#1A1412] p-3 rounded-lg my-4 relative overflow-hidden">
                      <div className="absolute right-0 top-0 bg-primary text-white border-b border-l border-neutral-900 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase">
                        MOTTO
                      </div>
                      <p className="italic font-heading text-sm font-black text-neutral-800 leading-snug">
                        "Always building something. Always learning something harder."
                      </p>
                    </div>

                    {/* Highlights Bullet List */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex gap-2 items-start bg-surface-warm/40 border border-neutral-900 p-2.5 rounded shadow-[1.5px_1.5px_0px_#1A1412]">
                        <Lock size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-neutral-900 text-[10px] uppercase tracking-wide">Sentra Deployment</div>
                          <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 leading-tight">AES-256-GCM + RSA platform.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-surface-warm/40 border border-neutral-900 p-2.5 rounded shadow-[1.5px_1.5px_0px_#1A1412]">
                        <FileText size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-neutral-900 text-[10px] uppercase tracking-wide">AES Publications</div>
                          <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 leading-tight">MixColumns cipher research.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-surface-warm/40 border border-neutral-900 p-2.5 rounded shadow-[1.5px_1.5px_0px_#1A1412]">
                        <Server size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-neutral-900 text-[10px] uppercase tracking-wide">DevOps & Cloud</div>
                          <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 leading-tight">Docker, Actions, AWS & Render.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-surface-warm/40 border border-neutral-900 p-2.5 rounded shadow-[1.5px_1.5px_0px_#1A1412]">
                        <Code2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-neutral-900 text-[10px] uppercase tracking-wide">Spring Boot Core</div>
                          <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 leading-tight">Scalable system design patterns.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic History (Right) */}
                <div className="lg:col-span-5">
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-5 shadow-[6px_6px_0px_#1A1412] h-full">
                    <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      <GraduationCap size={18} /> Journey
                    </h3>
                    
                    <div className="relative border-l border-neutral-900 ml-3 pl-4 space-y-4">
                      
                      {/* B.Tech */}
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-primary border border-neutral-900 rounded-full -left-[21.5px] top-1" />
                        <span className="text-[9px] font-mono font-bold bg-surface-warm px-1.5 py-0.5 border border-neutral-400 rounded inline-block mb-1">
                          2023 – 2027
                        </span>
                        <h4 className="font-bold text-neutral-900 text-xs leading-tight">B.Tech – Information Technology</h4>
                        <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">MITS, Gwalior</p>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-primary-light border border-primary/20 rounded text-[9px] font-bold text-primary">
                          CGPA: 7.92 / 10
                        </div>
                      </div>

                      {/* Diploma */}
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-surface-white border border-neutral-900 rounded-full -left-[21.5px] top-1" />
                        <span className="text-[9px] font-mono font-bold bg-surface-warm px-1.5 py-0.5 border border-neutral-400 rounded inline-block mb-1">
                          2021 – 2024
                        </span>
                        <h4 className="font-bold text-neutral-900 text-xs leading-tight">Diploma – Computer Science</h4>
                        <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">GPC, Betul</p>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-success/10 border border-success/20 rounded text-[9px] font-bold text-success">
                          CGPA: 8.09 / 10
                        </div>
                      </div>

                      {/* 10th */}
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-surface-white border border-neutral-900 rounded-full -left-[21.5px] top-1" />
                        <span className="text-[9px] font-mono font-bold bg-surface-warm px-1.5 py-0.5 border border-neutral-400 rounded inline-block mb-1">
                          2021
                        </span>
                        <h4 className="font-bold text-neutral-900 text-xs leading-tight">SSC (10th)</h4>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[9px] font-bold text-neutral-600">
                          Grade: 8.7 / 10 CGPA
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tech Stack */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Languages & Frontend */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col">
                    <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      <Code2 size={18} className="text-primary" /> Languages & Frontend
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Java", desc: "Core & JVM" },
                        { name: "TypeScript", desc: "Safety & Types" },
                        { name: "JavaScript", desc: "Interactivity" },
                        { name: "React", desc: "SPA Development" },
                        { name: "Vite", desc: "Build Tooling" },
                        { name: "Tailwind CSS", desc: "Neobrutalist Styling" },
                        { name: "HTML5", desc: "Semantic Structure" },
                        { name: "CSS3", desc: "Layout & Anims" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex flex-col px-3 py-2 bg-surface-white border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_#1A1412] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1412] hover:bg-surface-warm transition-all select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <span className="font-extrabold text-neutral-900 text-xs">{item.name}</span>
                          <span className="text-[9px] text-neutral-400 font-bold leading-none mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backend & Database */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col">
                    <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      <Server size={18} className="text-primary" /> Backend & Database
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Spring Boot", desc: "Enterprise MVC" },
                        { name: "Java API", desc: "Robust Backends" },
                        { name: "MongoDB", desc: "Atlas & GridFS" },
                        { name: "MySQL", desc: "Relational Storage" },
                        { name: "Gradle", desc: "Dependency Tool" },
                        { name: "REST APIs", desc: "Contract Design" },
                        { name: "JWT Auth", desc: "HttpOnly Security" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex flex-col px-3 py-2 bg-surface-white border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_#1A1412] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1412] hover:bg-surface-warm transition-all select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <span className="font-extrabold text-neutral-900 text-xs">{item.name}</span>
                          <span className="text-[9px] text-neutral-400 font-bold leading-none mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security & Crypto */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col">
                    <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      <Shield size={18} className="text-primary" /> Security & Crypto
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "AES-256-GCM", desc: "Content Encryption" },
                        { name: "RSA Wrapping", desc: "Asymmetric Sealing" },
                        { name: "Kali Linux", desc: "Security Auditing" },
                        { name: "Ethical Hacking", desc: "Defense Scanning" },
                        { name: "MixColumns", desc: "Algorithm Diffusion" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex flex-col px-3 py-2 bg-surface-white border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_#1A1412] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1412] hover:bg-surface-warm transition-all select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <span className="font-extrabold text-neutral-900 text-xs">{item.name}</span>
                          <span className="text-[9px] text-neutral-400 font-bold leading-none mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DevOps & Tools */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col">
                    <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                      <Lock size={18} className="text-primary" /> DevOps & Tools
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Docker", desc: "Containerization" },
                        { name: "GitHub Actions", desc: "CI/CD Workflows" },
                        { name: "Electron", desc: "Desktop Delivery" },
                        { name: "Git", desc: "Version Control" },
                        { name: "VS Code", desc: "Primary IDE" },
                        { name: "Linux OS", desc: "Systems Admin" },
                        { name: "Render", desc: "Cloud Hosting" },
                        { name: "AWS Cloud", desc: "Infrastructure" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex flex-col px-3 py-2 bg-surface-white border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_#1A1412] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1412] hover:bg-surface-warm transition-all select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <span className="font-extrabold text-neutral-900 text-xs">{item.name}</span>
                          <span className="text-[9px] text-neutral-400 font-bold leading-none mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Callout */}
                <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-5 shadow-[4px_4px_0px_#1A1412] flex items-center gap-3">
                  <Code2 size={20} className="text-primary shrink-0" />
                  <p className="text-xs text-neutral-600 font-bold leading-relaxed">
                    Designed to write strict, standard-compliant components. Experienced with cryptographic systems validation, environment configuration, database optimizations, and cross-platform native software integration.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Projects & Publications */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Sentra */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 transition-all">
                    <div className="absolute right-0 top-0 bg-success text-white border-b-2 border-l-2 border-neutral-900 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Active
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                        Sentra — Encrypted Sharing
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Java 21 · React · TypeScript · MongoDB · Docker · Render · Electron
                      </p>
                      <p className="text-xs text-neutral-600 font-medium mb-4 leading-relaxed">
                        Full-stack encrypted file-sharing platform designed to provide a highly secure ecosystem for routing sensitive data. Uses asymmetric keys for storage security.
                      </p>
                      <ul className="text-[11px] text-neutral-500 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>AES-256-GCM file contents + RSA wrapped keys.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>JWT Auth inside HttpOnly cookies with refresh cycles.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>MongoDB Atlas + GridFS for encrypted stream buffer chunks.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>Dual Delivery: SPA web client + Windows app via Electron.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href="https://github.com/Prathmesh-D/Sentra"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white border-2 border-neutral-900 rounded-md font-bold text-[11px] shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                      <a
                        href="https://sentra-web.onrender.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white border-2 border-neutral-900 rounded-md font-bold text-[11px] shadow-[2px_2px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1A1412] transition-all"
                      >
                        Live Link <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Enhanced AES-192 */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 transition-all">
                    <div className="absolute right-0 top-0 bg-[#4285F4] text-white border-b-2 border-l-2 border-neutral-900 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Published
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                        Enhanced AES-192 Research Tool
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Java · AES-192 · Cryptography · Research
                      </p>
                      <p className="text-xs text-neutral-600 font-medium mb-4 leading-relaxed">
                        A Java-based cryptographic validation interface and round modifier built directly on top of published academic research. Offers analysis metrics for file verification.
                      </p>
                      <ul className="text-[11px] text-neutral-500 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary text-xs mt-0.5">•</span>
                          <span>Modified AES-192 cipher with modified MixColumns round execution.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary text-xs mt-0.5">•</span>
                          <span>Evaluated via system entropy, avalanche effects, and execution timings.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary text-xs mt-0.5">•</span>
                          <span>Research paper published inside the IJSRD Journal.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <a
                        href="https://github.com/Prathmesh-D/AESFXEncrypt-JavaFX-AES-Encryption-Decryption-Tool"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white border-2 border-neutral-900 rounded-md font-bold text-[11px] shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Auto Login Bot */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 transition-all">
                    <div className="absolute right-0 top-0 bg-neutral-500 text-white border-b-2 border-l-2 border-neutral-900 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Complete
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                        Auto-Login Bot
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Python · Selenium · Automation
                      </p>
                      <p className="text-xs text-neutral-600 font-medium mb-4 leading-relaxed">
                        Stealth web automation bot targeting credential-based portal routing. Written in Python and configured for headless execution environments.
                      </p>
                      <ul className="text-[11px] text-neutral-500 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-neutral-500 text-xs mt-0.5">•</span>
                          <span>Stealth browser agent spoofing to bypass validation systems.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-neutral-500 text-xs mt-0.5">•</span>
                          <span>Secure credential fetching using environment variables.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-neutral-500 text-xs mt-0.5">•</span>
                          <span>Fully modular class designs for simple scaling.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <a
                        href="https://github.com/Prathmesh-D/AutoLoginBot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white border-2 border-neutral-900 rounded-md font-bold text-[11px] shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Future Projects */}
                  <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] flex flex-col justify-between relative overflow-hidden opacity-95">
                    <div className="absolute right-0 top-0 bg-primary text-white border-b-2 border-l-2 border-neutral-900 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      In Progress
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                        Future Architectures
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Spring Boot · System Design · Microservices
                      </p>
                      <p className="text-xs text-neutral-600 font-medium mb-4 leading-relaxed">
                        Currently structuring production-grade backend projects focusing on system scaling, messaging brokers, caching setups, and modular microservice designs.
                      </p>
                      <ul className="text-[11px] text-neutral-500 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary text-xs mt-0.5">•</span>
                          <span>Designing high-throughput backend controllers in Spring Boot.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary text-xs mt-0.5">•</span>
                          <span>Leveraging relational indexes and Redis cache boundaries.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200 text-neutral-400 border-2 border-neutral-300 rounded-md font-bold text-[11px] cursor-not-allowed"
                      >
                        Coming Soon...
                      </button>
                    </div>
                  </div>

                </div>

                {/* Publications Table Card */}
                <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412] mt-6">
                  <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                    <BookOpen size={20} /> Research & Publications
                  </h3>
                  <div className="bg-surface-warm/40 border-2 border-neutral-900 p-5 rounded-lg shadow-[3px_3px_0px_#1A1412] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="inline-flex items-center gap-1 bg-primary text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border border-neutral-900">
                        IJSRD VOL. 12, ISSUE 4
                      </div>
                      <h4 className="font-heading font-black text-[15px] text-neutral-900 leading-tight">
                        Assessing the Impact of Increased MixColumns on AES Encryption Security and Performance
                      </h4>
                      <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                        Evaluating cryptographic diffusion enhancements, avalanche behaviors, and runtime CPU overhead modifications.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <a
                        href="https://www.ijsrd.com/Article.php?manuscript=IJSRDV12I40064"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white border-2 border-neutral-900 rounded-md font-bold text-xs shadow-[3px_3px_0px_#1A1412] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1A1412] transition-all"
                      >
                        Read Paper <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {activeTab === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="bg-surface-white border-2 border-neutral-900 rounded-xl p-6 shadow-[6px_6px_0px_#1A1412]">
                  <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-wider mb-6 border-b-2 border-neutral-900 pb-2 flex items-center gap-2">
                    <Award size={20} /> Professional Credentials
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* AWS Forage */}
                    <div className="bg-surface-warm/30 border-2 border-neutral-900 p-5 rounded-lg shadow-[3px_3px_0px_#1A1412] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
                      <div>
                        <div className="w-10 h-10 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-xl mb-4 font-bold text-[#4285F4]">
                          AWS
                        </div>
                        <h4 className="font-bold text-neutral-900 text-sm leading-tight">Solutions Architecture Virtual Simulation</h4>
                        <p className="text-[10px] text-neutral-500 font-extrabold mt-1">Issued by AWS (Forage)</p>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-bold font-mono bg-surface-warm border border-neutral-400 rounded px-1.5 py-0.5 text-neutral-600">2025</span>
                        <span className="text-[9px] font-bold text-[#4285F4] uppercase tracking-wider">Cloud Layout</span>
                      </div>
                    </div>

                    {/* Walmart Forage */}
                    <div className="bg-surface-warm/30 border-2 border-neutral-900 p-5 rounded-lg shadow-[3px_3px_0px_#1A1412] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
                      <div>
                        <div className="w-10 h-10 rounded bg-success/10 border border-success/30 flex items-center justify-center text-xl mb-4 font-bold text-success">
                          W
                        </div>
                        <h4 className="font-bold text-neutral-900 text-sm leading-tight">Software Engineering Virtual Simulation</h4>
                        <p className="text-[10px] text-neutral-500 font-extrabold mt-1">Issued by Walmart (Forage)</p>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-bold font-mono bg-surface-warm border border-neutral-400 rounded px-1.5 py-0.5 text-neutral-600">2025</span>
                        <span className="text-[9px] font-bold text-success uppercase tracking-wider">Enterprise Dev</span>
                      </div>
                    </div>

                    {/* IIT Jodhpur */}
                    <div className="bg-surface-warm/30 border-2 border-neutral-900 p-5 rounded-lg shadow-[3px_3px_0px_#1A1412] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
                      <div>
                        <div className="w-10 h-10 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-xl mb-4 font-bold text-primary">
                          IIT
                        </div>
                        <h4 className="font-bold text-neutral-900 text-sm leading-tight">Ethical Hacking Certificate</h4>
                        <p className="text-[10px] text-neutral-500 font-extrabold mt-1">Issued by IIT Jodhpur</p>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-bold font-mono bg-surface-warm border border-neutral-400 rounded px-1.5 py-0.5 text-neutral-600">2022</span>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Security</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <Button variant="secondary" size="lg" onClick={() => router.push("/")} className="px-8 shadow-[4px_4px_0px_#1A1412] bg-white">
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

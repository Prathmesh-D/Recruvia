"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function DrawerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { resetAll } = useAppStore();

  // Prevent scrolling when drawer is open
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

  const handleStartNew = () => {
    resetAll();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 bg-primary border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] hover:bg-primary-dark transition-colors"
        aria-label="Open Menu"
      >
        <span 
          className="font-bold text-2xl text-surface-white"
          style={{ fontFamily: "var(--font-bangers), sans-serif", marginTop: "2px" }}
        >
          R.
        </span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-surface border-l-2 border-neutral-900 shadow-2xl z-[101] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b-2 border-neutral-900 bg-surface-warm">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-3xl font-bold tracking-wider text-primary" 
                    style={{ fontFamily: "var(--font-logo-custom), sans-serif" }}
                  >
                    Recruvia.
                  </span>
                  <div className="bg-success border-2 border-neutral-900 px-2 py-0.5 shadow-[2px_2px_0px_#1A1412]">
                    <span className="text-[10px] font-bold font-sans text-white uppercase tracking-widest">
                      Build 01
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-surface-white border-2 border-neutral-900 shadow-[2px_2px_0px_#1A1412] hover:bg-neutral-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                <button 
                  onClick={handleStartNew}
                  className="w-full text-left bg-surface-white border-2 border-neutral-900 p-4 shadow-[4px_4px_0px_#1A1412] hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between group"
                >
                  <span className="font-bold text-lg uppercase tracking-wide">Start New Session</span>
                  <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <div className="mt-8 border-t-2 border-neutral-900 pt-8 flex flex-col gap-4">
                  <Link
                    href="/github-repository"
                    onClick={() => setIsOpen(false)}
                    className="font-bold text-neutral-500 hover:text-neutral-900 transition-colors text-sm uppercase tracking-widest"
                  >
                    GitHub Repository
                  </Link>
                  <Link
                    href="/developer"
                    onClick={() => setIsOpen(false)}
                    className="font-bold text-neutral-500 hover:text-neutral-900 transition-colors text-sm uppercase tracking-widest"
                  >
                    Developer
                  </Link>
                </div>
              </div>

              <div className="p-6 border-t-2 border-neutral-900 bg-surface-warm text-xs font-mono text-neutral-500">
                System Status: Online <span className="text-success ml-1">●</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

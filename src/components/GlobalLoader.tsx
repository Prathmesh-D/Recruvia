"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalLoader() {
  const { globalLoading, loadingMessage } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {globalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Logo container */}
            <motion.div
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 100, 
                duration: 0.5 
              }}
              className="bg-neutral-900 border-4 border-neutral-900 px-8 py-4 flex items-center justify-center shadow-[8px_8px_0px_#EFE6DE]"
              style={{ color: "#EFE6DE", zIndex: 110 }}
            >
              <motion.span 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl md:text-6xl font-bold tracking-wider whitespace-nowrap" 
                style={{ fontFamily: "var(--font-logo-custom), sans-serif" }}
              >
                Recruvia.
              </motion.span>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <div className="h-1 w-24 bg-neutral-900 overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-surface-white"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="text-white font-mono text-sm tracking-widest uppercase">
                {loadingMessage}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

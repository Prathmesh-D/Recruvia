"use client";

import { LayoutGroup } from "framer-motion";

export function MotionLayoutProvider({ children }: { children: React.ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}

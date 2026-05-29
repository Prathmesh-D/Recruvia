"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { DrawerMenu } from "./DrawerMenu";

export function BrandingEdge() {
  const pathname = usePathname();
  
  return (
    <header className="fixed top-0 left-0 w-full bg-surface-warm border-b-2 border-neutral-900 z-50 px-6 h-16 flex items-center justify-between shadow-sm">
      <div className="flex-1 min-w-0 pr-4">
        <Breadcrumbs />
      </div>
      <div className="shrink-0 flex items-center gap-3.5">
        <nav className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/developer"
            className={`px-3 py-1.5 border-2 border-neutral-900 font-bold text-[10px] uppercase tracking-wider rounded-md transition-all ${
              pathname === "/developer"
                ? "bg-primary text-white shadow-[2px_2px_0px_#1A1412]"
                : "bg-surface-white text-neutral-700 shadow-[2px_2px_0px_#1A1412] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#1A1412] hover:text-neutral-900"
            }`}
          >
            Developer
          </Link>
        </nav>
        <div className="h-6 w-0.5 bg-neutral-300 hidden sm:block" />
        <DrawerMenu />
      </div>
    </header>
  );
}

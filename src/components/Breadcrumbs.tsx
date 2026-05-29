"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Suspense } from "react";

function BreadcrumbsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  // Determine breadcrumb structure based on route
  const getBreadcrumbs = () => {
    const paths = [{ name: "Recruvia", href: "/" }];

    if (pathname.includes("/new")) {
      paths.push({ name: "New Session", href: `/new${sessionId ? `?session=${sessionId}` : ""}` });
      if (pathname.includes("/step2")) {
        paths.push({ name: "Job Description", href: `/new/step2${sessionId ? `?session=${sessionId}` : ""}` });
      }
    } else if (pathname.includes("/session/")) {
      // e.g. /session/123/results
      paths.push({ name: "Session", href: "#" });
      if (pathname.includes("/results")) {
        paths.push({ name: "Results", href: pathname });
      } else {
        paths.push({ name: "Analysis", href: pathname });
      }
    } else if (pathname.includes("/github-repository")) {
      paths.push({ name: "GitHub Repository", href: "/github-repository" });
    } else if (pathname.includes("/developer")) {
      paths.push({ name: "Developer", href: "/developer" });
    }

    return paths;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-sm font-bold tracking-wide">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={crumb.name} className="flex items-center">
            {isFirst ? (
              <Link
                href={crumb.href}
                className={`transition-colors hover:text-primary ${
                  isLast ? "text-neutral-900" : "text-neutral-500"
                }`}
                style={{ fontFamily: isFirst ? "var(--font-logo-custom), sans-serif" : undefined, fontSize: isFirst ? "24px" : undefined, color: isFirst ? "var(--color-primary)" : undefined }}
              >
                {crumb.name}.
              </Link>
            ) : (
              <Link
                href={crumb.href}
                className={`transition-colors hover:text-primary whitespace-nowrap ${
                  isLast ? "text-neutral-900" : "text-neutral-500"
                }`}
              >
                {crumb.name}
              </Link>
            )}

            {!isLast && (
              <ChevronRight className="w-4 h-4 mx-1 sm:mx-2 text-neutral-300 shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Breadcrumbs() {
  return (
    <Suspense fallback={<div className="h-6 w-32 bg-neutral-200 animate-pulse rounded" />}>
      <BreadcrumbsInner />
    </Suspense>
  );
}

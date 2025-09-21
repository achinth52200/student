
"use client";

import { useLoader } from "@/hooks/use-loader";

export function PageLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="page-loader-overlay">
        <div className="loader-wrapper">
            <span className="loader-letter">L</span>
            <span className="loader-letter">O</span>
            <span className="loader-letter">A</span>
            <span className="loader-letter">D</span>
            <span className="loader-letter">I</span>
            <span className="loader-letter">N</span>
            <span className="loader-letter">G</span>
            <span className="loader-letter">.</span>
            <span className="loader-letter">.</span>
            <span className="loader-letter">.</span>
            <div className="loader"></div>
        </div>
    </div>
  );
}

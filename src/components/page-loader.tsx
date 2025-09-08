
"use client";

import { useLoader } from "@/hooks/use-loader";

export function PageLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-wrapper">
        <div className="page-loader-circle"></div>
        <div className="page-loader-circle"></div>
        <div className="page-loader-circle"></div>
        <div className="page-loader-shadow"></div>
        <div className="page-loader--shadow"></div>
        <div className="page-loader-shadow"></div>
      </div>
    </div>
  );
}

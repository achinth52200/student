
"use client";

import { useLoader } from "@/hooks/use-loader";

export function PageLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="page-loader-overlay">
       <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  );
}


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
        <span style={{'--i': 1} as React.CSSProperties}>L</span>
        <span style={{'--i': 2} as React.CSSProperties}>O</span>
        <span style={{'--i': 3} as React.CSSProperties}>A</span>
        <span style={{'--i': 4} as React.CSSProperties}>D</span>
        <span style={{'--i': 5} as React.CSSProperties}>I</span>
        <span style={{'--i': 6} as React.CSSProperties}>N</span>
        <span style={{'--i': 7} as React.CSSProperties}>G</span>
        <span style={{'--i': 8} as React.CSSProperties}>.</span>
        <span style={{'--i': 9} as React.CSSProperties}>.</span>
        <span style={{'--i': 10} as React.CSSProperties}>.</span>
      </div>
    </div>
  );
}

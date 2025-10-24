
"use client";

export function PageTransitionSpinner() {
  return (
    <div className="page-transition-loader-container">
        <div aria-live="assertive" role="alert" className="page-transition-loader-spinner"></div>
    </div>
  );
}

import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 21h8" />
      <path d="M6 18h12" />
      <path d="M10 3v7c0 1.1-.9 2-2 2H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-5c-1.1 0-2-.9-2-2V3" />
      <path d="m14 3-4 8 4 8" />
    </svg>
  );
}

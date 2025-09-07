import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="white" />
    </svg>
  );
}

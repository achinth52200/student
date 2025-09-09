import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.5)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M50 2.5a47.5 47.5 0 0 1 37.1 74.4A47.5 47.5 0 0 1 12.9 25.6 47.2 47.2 0 0 1 50 2.5Z"
        fill="url(#grad1)"
        transform="rotate(15 50 50)"
      />
      <path
        d="M50 2.5a47.5 47.5 0 0 1 37.1 74.4A47.5 47.5 0 0 1 12.9 25.6 47.2 47.2 0 0 1 50 2.5Z"
        fill="hsl(var(--background))"
        opacity="0.2"
        transform="rotate(-15 50 50) scale(0.8)"
      />
       <path
        d="M50 10a40 40 0 1 1-28.28 11.72A40 40 0 0 1 50 10Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

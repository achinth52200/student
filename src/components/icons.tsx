import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        {...props}
    >
        <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))" />
        <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="hsl(var(--primary-foreground))" 
            fontSize="40" 
            fontWeight="bold"
            fontFamily="sans-serif"
        >
            SC
        </text>
    </svg>
  );
}

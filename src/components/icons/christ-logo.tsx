
import type { SVGProps } from "react";

export function ChristLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 450 100"
        {...props}
    >
        <style>
            {`.seal-text{font-family:serif;font-weight:700;font-size:10px;fill:#b59554;letter-spacing:.5px}.christ-text{font-family:serif;font-weight:700;font-size:50px;fill:#1e40af}.deemed-text{font-family:sans-serif;font-size:10px;fill:#b59554}.location-text{font-family:sans-serif;font-size:9px;fill:#1e40af}`}
        </style>
        <g transform="translate(50 50)">
            <circle cx="0" cy="0" r="45" fill="none" stroke="#b59554" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="38" fill="none" stroke="#b59554" strokeWidth="0.5"/>
            <path id="excellence" d="M -30.38 -22.3 A 37 37 0 0 1 30.38 -22.3" fill="none" />
            <text>
                <textPath href="#excellence" startOffset="50%" textAnchor="middle" className="seal-text">
                    EXCELLENCE
                </textPath>
            </text>
            <path id="service" d="M 30.38 22.3 A 37 37 0 0 1 -30.38 22.3" fill="none" />
            <text>
                <textPath href="#service" startOffset="50%" textAnchor="middle" className="seal-text">
                    SERVICE
                </textPath>
            </text>
            
            <g transform="scale(0.8)">
                <path d="M0-35 l6 12 -16 4 10 19 -22-6 22-6 -10 19 16 4 -6-12 6-12 -16-4 10-19 22 6 -22 6 10-19 -16-4z" fill="#b59554"/>
                <circle cx="0" cy="0" r="16" fill="none" stroke="#b59554" strokeWidth="1"/>
                <path d="M-4.5 12.5 L-2.5 12.5 L-2.5 8.5 L-1 8.5 L-1 12.5 L1 12.5 L1 8.5 L2.5 8.5 L2.5 12.5 L4.5 12.5 L4.5 7 L-4.5 7Z" fill="#b59554"/>
                <path d="M0-12 a0.5 0.5 0 0 0 0 1 a0.5 0.5 0 0 0 0-1 M-1.5-1.5 L0-15 L1.5-1.5" fill="none" stroke="#b59554" strokeWidth="1"/>
                <circle cx="0" cy="-4" r="2" fill="#b59554"/>
                <path d="M0-2 C 2 0, -2 0, 0-2" fill="#fff"/>
            </g>
             <text x="0" y="32" textAnchor="middle" className="seal-text" fontSize="9">CHRIST</text>
        </g>
        <g transform="translate(105 0)">
            <text x="0" y="45" className="christ-text">CHRIST</text>
            <rect x="0" y="52" width="340" height="1" fill="#b59554"/>
            <text x="0" y="68" className="deemed-text">(DEEMED TO BE UNIVERSITY)</text>
            <text x="0" y="85" className="location-text">BANGALORE | DELHI NCR | PUNE</text>
        </g>
    </svg>
  );
}

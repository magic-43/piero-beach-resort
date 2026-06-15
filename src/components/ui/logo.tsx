

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <svg
      viewBox="30 70 350 130"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* P downstroke */}
        <path
          d="M 72 102 C 70 120, 62 145, 54 168"
          strokeWidth="11"
        />
        {/* P loop */}
        <path
          d="M 44 135 C 40 108, 62 82, 88 82 C 110 82, 118 102, 104 122 C 92 135, 74 138, 58 138"
          strokeWidth="11"
        />
        {/* i e r o and tail */}
        <path
          d="M 120 148 C 122 135, 128 122, 132 122 C 136 122, 130 140, 132 148 C 134 152, 142 145, 145 134 C 146 128, 138 128, 136 138 C 135 145, 138 148, 144 148 C 150 148, 154 132, 160 132 C 164 132, 160 142, 162 148 C 165 152, 175 148, 178 134 C 180 125, 168 125, 166 136 C 165 144, 170 148, 178 148 C 188 148, 204 142, 222 136 L 368 94"
          strokeWidth="10"
        />
      </g>
      
      {/* Dot for i */}
      <circle cx="132" cy="106" r="5.5" fill="currentColor" />

      {showText && (
        <text
          x="215"
          y="190"
          textAnchor="middle"
          fill="currentColor"
          opacity="0.8"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="22"
          letterSpacing="0.15em"
        >
          BEACH RESORT
        </text>
      )}
    </svg>
  );
}

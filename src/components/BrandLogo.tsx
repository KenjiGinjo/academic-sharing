type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
};

export function BrandLogo({
  className = "",
  markClassName = "h-8 w-8",
  showWordmark = true,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        className={markClassName}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Outer neural ring — neuroscience */}
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.22"
          strokeDasharray="2.5 3"
        />
        {/* Synapse arcs */}
        <path
          d="M7 15C10 9 16 6 22 7"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M18 33C24 34 31 30 34 24"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* AI network spine */}
        <path
          d="M12 13L20 20L28 13"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <path
          d="M20 20V29"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Letter C */}
        <path
          d="M18.2 12.2C14.6 12.2 11.8 15.1 11.8 18.8C11.8 22.5 14.6 25.4 18.2 25.4C19.4 25.4 20.5 25.1 21.4 24.5"
          stroke="currentColor"
          strokeWidth="2.55"
          strokeLinecap="round"
        />
        {/* Letter G */}
        <path
          d="M29.8 17.2C28.8 14.1 25.8 12.2 22.4 12.2C19 12.2 16.2 15.1 16.2 18.8C16.2 22.5 19 25.4 22.4 25.4C24.5 25.4 26.3 24.4 27.4 22.8V20.4H23.2"
          stroke="currentColor"
          strokeWidth="2.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Nodes */}
        <circle cx="7" cy="15" r="1.55" fill="currentColor" />
        <circle cx="12" cy="13" r="1.25" fill="currentColor" opacity="0.9" />
        <circle cx="20" cy="20" r="1.85" fill="currentColor" />
        <circle cx="28" cy="13" r="1.25" fill="currentColor" opacity="0.9" />
        <circle cx="20" cy="29" r="1.45" fill="currentColor" />
        <circle cx="34" cy="24" r="1.55" fill="currentColor" />
        <circle cx="27.4" cy="20.4" r="1.15" fill="currentColor" />
      </svg>
      {showWordmark ? (
        <span className="font-display tracking-tight">CG NeurAI</span>
      ) : null}
    </span>
  );
}

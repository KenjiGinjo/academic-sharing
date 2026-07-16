/** Abstract neural × AI composition for the homepage hero. Decorative only. */
export function HeroVisual() {
  return (
    <div
      className="hero-visual relative mx-auto aspect-square w-full max-w-sm lg:max-w-md"
      aria-hidden
    >
      <div
        className="absolute inset-[8%] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 42% 38%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 62%)",
        }}
      />
      <div
        className="absolute inset-[18%] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at 60% 55%, color-mix(in srgb, var(--accent-deep) 10%, transparent), transparent 58%)",
        }}
      />

      <svg
        className="relative h-full w-full text-accent-deep"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer orbit rings */}
        <g>
          <circle
            cx="200"
            cy="200"
            r="168"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.12"
            strokeDasharray="3 5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 200 200"
              to="360 200 200"
              dur="48s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="200"
            cy="200"
            r="128"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.16"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 200 200"
              to="0 200 200"
              dur="72s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Network edges */}
        <g
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.28"
        >
          <path d="M118 96L200 152" />
          <path d="M200 152L286 108" />
          <path d="M200 152L200 200" />
          <path d="M118 96L92 178" />
          <path d="M92 178L148 228" />
          <path d="M148 228L200 200" />
          <path d="M200 200L268 188" />
          <path d="M286 108L268 188" />
          <path d="M268 188L312 248" />
          <path d="M148 228L168 292" />
          <path d="M200 200L168 292" />
          <path d="M168 292L248 310" />
          <path d="M312 248L248 310" />
          <path d="M268 188L200 152" />
        </g>

        {/* Traveling signals */}
        <path
          d="M118 96L200 152L268 188L312 248"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="10 180"
          opacity="0.7"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="190"
            to="-190"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M92 178L148 228L168 292L248 310"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="8 160"
          opacity="0.45"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="168"
            to="-168"
            dur="4.8s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Nodes */}
        <g fill="currentColor">
          <PulsingNode cx={118} cy={96} r={5} opacity={0.55} />
          <PulsingNode cx={286} cy={108} r={4.5} opacity={0.5} delay="0.8s" />
          <PulsingNode cx={92} cy={178} r={4} opacity={0.45} />
          <PulsingNode
            cx={200}
            cy={152}
            r={6}
            opacity={0.85}
            fill="var(--accent)"
            dur="2.6s"
          />
          <PulsingNode cx={148} cy={228} r={5} opacity={0.55} delay="0.8s" />
          <PulsingNode
            cx={200}
            cy={200}
            r={8}
            opacity={1}
            fill="var(--accent)"
            dur="2.6s"
          />
          <PulsingNode cx={268} cy={188} r={5.5} opacity={0.6} />
          <PulsingNode cx={312} cy={248} r={4.5} opacity={0.5} delay="0.8s" />
          <PulsingNode cx={168} cy={292} r={5} opacity={0.5} />
          <PulsingNode cx={248} cy={310} r={4} opacity={0.45} delay="0.8s" />
        </g>

        {/* Soft node halos */}
        <circle
          cx="200"
          cy="200"
          r="16"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.22"
        >
          <animate
            attributeName="r"
            values="14;18;14"
            dur="2.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.12;0.28;0.12"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="200"
          cy="152"
          r="12"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.18"
        >
          <animate
            attributeName="r"
            values="10;14;10"
            dur="3.4s"
            begin="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.1;0.24;0.1"
            dur="3.4s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

function PulsingNode({
  cx,
  cy,
  r,
  opacity,
  fill,
  delay = "0s",
  dur = "3.2s",
}: {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  fill?: string;
  delay?: string;
  dur?: string;
}) {
  const low = Math.max(0.25, opacity * 0.55);
  const high = Math.min(1, opacity * 1.15);

  return (
    <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity}>
      <animate
        attributeName="opacity"
        values={`${low};${high};${low}`}
        dur={dur}
        begin={delay}
        repeatCount="indefinite"
      />
    </circle>
  );
}

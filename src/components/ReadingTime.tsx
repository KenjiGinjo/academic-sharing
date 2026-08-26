import { formatReadingTime } from "@/lib/reading-time";

export function ReadingTime({
  minutes,
  size = "md",
}: {
  minutes: number;
  size?: "sm" | "md";
}) {
  const label = formatReadingTime(minutes);
  const sizeClass =
    size === "md"
      ? "px-2.5 py-1 text-sm"
      : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-md bg-accent-soft font-semibold tracking-tight text-accent-deep ${sizeClass}`}
    >
      {label}
    </span>
  );
}

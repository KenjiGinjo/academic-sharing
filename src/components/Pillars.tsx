const pillars = [
  {
    title: "Daily Blog",
    body: "Lightweight notes and essays that keep the archive warm and human.",
  },
  {
    title: "Structured Tutorials",
    body: "Series-based guides with clear outcomes, chapters, and lasting value.",
  },
  {
    title: "Open Sharing",
    body: "Knowledge written to be transferred — calm, scannable, and durable.",
  },
  {
    title: "Contributors",
    body: "A small People directory for the writers and builders behind the work.",
  },
];

export function Pillars() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {pillars.map((item) => (
          <div key={item.title}>
            <div className="mb-4 h-px w-10 bg-accent" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

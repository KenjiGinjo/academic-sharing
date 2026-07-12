export type Person = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  links?: { label: string; href: string }[];
};

export const people: Person[] = [
  {
    id: "avery-lin",
    name: "Avery Lin",
    role: "Editor & Tutorials",
    bio: "Writes structured guides on knowledge design and keeps series outlines coherent across releases.",
    initials: "AL",
    links: [{ label: "GitHub", href: "https://github.com" }],
  },
  {
    id: "noah-chen",
    name: "Noah Chen",
    role: "Blog & Research Notes",
    bio: "Publishes short essays on learning practice, reading systems, and the craft of technical writing.",
    initials: "NC",
    links: [{ label: "X", href: "https://x.com" }],
  },
  {
    id: "mira-okada",
    name: "Mira Okada",
    role: "Design Systems",
    bio: "Focuses on calm academic interfaces, typography, and documentation layouts that stay out of the way.",
    initials: "MO",
  },
  {
    id: "eli-park",
    name: "Eli Park",
    role: "Engineering",
    bio: "Builds the static-first frontend and CMS hooks that keep content portable as the archive grows.",
    initials: "EP",
    links: [{ label: "GitHub", href: "https://github.com" }],
  },
];

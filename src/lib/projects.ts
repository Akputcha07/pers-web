import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type NowEntry = CollectionEntry<'now'>;

/* -------------------------------------------------------------------------- */
/* Presentation metadata                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Full class strings, not composed ones. Tailwind scans source files as plain
 * text, so `bg-${domain}-soft` would never be generated.
 */
export const DOMAIN_META = {
  software: {
    label: 'Software',
    chip: 'bg-software-soft text-software border-software/25',
    dot: 'bg-software',
  },
  hardware: {
    label: 'Hardware',
    chip: 'bg-hardware-soft text-hardware border-hardware/25',
    dot: 'bg-hardware',
  },
  hybrid: {
    label: 'Hardware + Software',
    chip: 'bg-hybrid-soft text-hybrid border-hybrid/25',
    dot: 'bg-hybrid',
  },
} as const;

export const STATUS_META = {
  active: { label: 'In progress', chip: 'border-accent/40 text-accent' },
  shipped: { label: 'Shipped', chip: 'border-line-strong text-muted' },
  prototype: { label: 'Prototype', chip: 'border-line-strong text-muted' },
  archived: { label: 'Archived', chip: 'border-line text-faint' },
} as const;

export const DOMAIN_ORDER = ['software', 'hardware', 'hybrid'] as const;

/* -------------------------------------------------------------------------- */
/* Dates                                                                      */
/* -------------------------------------------------------------------------- */

export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "May 2026 – Aug 2026", or "May 2026 – Present" when `ended` is omitted. */
export function formatRange(started: Date, ended?: Date): string {
  const start = formatMonth(started);
  const end = ended ? formatMonth(ended) : 'Present';
  return start === end ? start : `${start} – ${end}`;
}

/** Rough "3 days ago" / "2 months ago" for the Now page. */
export function relativeTime(date: Date): string {
  const days = Math.round((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return months === 1 ? 'last month' : `${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? 'last year' : `${years} years ago`;
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                    */
/* -------------------------------------------------------------------------- */

/** Drafts stay visible in `astro dev` and are dropped from production builds. */
const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

/** Highest weight first, then most recently started. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', isPublished);
  return projects.sort((a, b) => {
    if (a.data.weight !== b.data.weight) return b.data.weight - a.data.weight;
    return (b.data.started?.getTime() ?? 0) - (a.data.started?.getTime() ?? 0);
  });
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.data.featured);
  // Fall back to the newest projects so the homepage is never empty.
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

/** Newest update first. */
export async function getNowEntries(): Promise<NowEntry[]> {
  const entries = await getCollection('now', isPublished);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Every distinct tech tag across published projects, alphabetised. */
export async function getAllTech(): Promise<string[]> {
  const projects = await getProjects();
  const tech = new Set(projects.flatMap((project) => project.data.tech));
  return [...tech].sort((a, b) => a.localeCompare(b));
}

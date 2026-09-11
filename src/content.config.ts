import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Shared shape for the "Repo / Demo / Datasheet" buttons on a project page. */
const link = z.object({
  label: z.string(),
  href: z.string().url(),
});

/**
 * Projects: one Markdown file per project in src/content/projects/.
 * The filename becomes the URL, e.g. `flight-computer.md` -> /projects/flight-computer/
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences. Shown on the card and in search results. */
    summary: z.string(),

    /** Drives the coloured badge and the filter buttons on /projects. */
    domain: z.enum(['software', 'hardware', 'hybrid']),
    /** Optional; the status badge is hidden when omitted. */
    status: z.enum(['active', 'shipped', 'prototype', 'archived']).optional(),

    /** Optional context: what you did and who it was for. */
    role: z.string().optional(),
    org: z.string().optional(),

    /** Optional; the timeline is hidden when omitted. */
    started: z.coerce.date().optional(),
    /** Leave out for ongoing work; the UI will render "Present". */
    ended: z.coerce.date().optional(),

    /** Technologies, parts, instruments. Rendered as chips and used by search. */
    tech: z.array(z.string()).default([]),

    /** 2 to 4 bullets of outcomes. Shown in a callout above the article body. */
    highlights: z.array(z.string()).default([]),

    links: z.array(link).default([]),

    /** Featured projects appear on the homepage, ordered by `weight`. */
    featured: z.boolean().default(false),
    /** Higher sorts first within a group. Ties fall back to start date. */
    weight: z.number().default(0),

    /** Path under public/, e.g. '/images/board.jpg'. Optional. */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    /** Draft entries are excluded from production builds. */
    draft: z.boolean().default(false),
  }),
});

/**
 * Now: the running log behind /now. One Markdown file per update.
 * The newest entry (by `date`) becomes the headline "currently" block.
 */
const now = defineCollection({
  loader: glob({ base: './src/content/now', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Headline for this update, e.g. "Bringing up the rev B board". */
    title: z.string(),
    date: z.coerce.date(),
    /** One sentence. Used in the RSS feed and the collapsed list view. */
    summary: z.string(),
    /** Short chips: what has your attention right now. */
    focus: z.array(z.string()).default([]),
    /** Optional slugs from src/content/projects that this update relates to. */
    projects: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, now };

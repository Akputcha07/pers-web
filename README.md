# Personal portfolio

Astro + Tailwind CSS + Markdown, deployed as a static site on Cloudflare Pages.

Three things it does:

1. **Projects** — coding and electrical engineering work, filterable by domain,
   each with its own write-up page.
2. **About** — the recruiting surface: experience, education, skills,
   coursework, credentials, contact links and a resume download.
3. **Now** — a running log of what you are working on at the moment, with the
   newest entry surfaced on the homepage and an RSS feed.

---

## Prerequisites

Node.js 20.3 or newer (22 LTS recommended). Node is **not installed on this
machine** — install it before you can run anything:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then open a new terminal so `node` and `npm` are on your PATH.

`node_modules/` is already populated and the site has been built and verified
once, so your first `npm install` should be quick.

## Running it

```bash
npm install      # already done once, safe to re-run
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site locally
npm run check    # type-check .astro and .ts files
```

---

## Where to edit things

| I want to change... | Edit |
| --- | --- |
| Name, role, blurb, location | `src/data/site.ts` |
| Email, GitHub, LinkedIn | `SOCIALS` in `src/data/site.ts` |
| Skills, experience, education, awards | `src/data/site.ts` |
| "Open to work" banner | `AVAILABILITY` in `src/data/site.ts` |
| A project | a Markdown file in `src/content/projects/` |
| What I'm working on now | a Markdown file in `src/content/now/` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Domain / canonical URL | `site:` in `astro.config.mjs` |

**Start with `src/data/site.ts`.** Everything personal lives there, and the
whole site reads from it.

### Your resume

Drop your PDF at `public/resume.pdf` and it is served from `/resume.pdf`.
Update `RESUME.updated` in `src/data/site.ts` when you replace it. To hide every
resume link on the site, set `RESUME.href` to `null`.

---

## Adding a project

Create `src/content/projects/my-project.md`. The filename becomes the URL, so
that file publishes at `/projects/my-project/`.

```markdown
---
title: My Project
summary: One or two sentences. This shows on the card and in search results.
domain: hardware        # software | hardware | hybrid
status: active          # active | shipped | prototype | archived
role: Solo project      # optional
org: Some Lab           # optional
started: 2026-01-15
ended: 2026-06-30       # omit for ongoing work; renders as "Present"
tech: [KiCad, STM32, C]
highlights:
  - Lead with outcomes. Numbers if you have them.
  - Two to four of these.
links:
  - label: Repository
    href: https://github.com/you/my-project
featured: true          # shows on the homepage
weight: 50              # higher sorts first
cover: /images/board.jpg  # optional, from public/
coverAlt: The assembled board
draft: false            # drafts show in dev, are excluded from builds
---

Your write-up in Markdown. Code blocks get syntax highlighting in both themes.
```

Every field except `title`, `summary`, `domain`, `status` and `started` is
optional. The schema in `src/content.config.ts` validates this at build time,
so a typo fails the build with a clear message rather than shipping broken.

## Adding a "now" update

Create `src/content/now/2026-09-something.md`:

```markdown
---
title: What I am up to
date: 2026-09-08
summary: One sentence. Used on the homepage and in the RSS feed.
focus: [Board bring-up, Learning Rust]
projects: [my-project]   # optional; slugs from src/content/projects/
---

The details, in Markdown.
```

The entry with the newest `date` becomes the headline block on `/now` and the
"Currently" strip on the homepage. Everything older collapses into the list
below it. Filenames are just for your own ordering — the `date` field is what
the site sorts on.

---

## Deploying to Cloudflare Pages

The site builds to plain static files, so no adapter and no Workers runtime is
needed.

1. Push this directory to a GitHub or GitLab repository.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
   Git**, and pick the repo.
3. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `22` (set `NODE_VERSION=22` under environment variables) |

4. Deploy. Cloudflare builds every push to your default branch and gives
   preview URLs for other branches.

### After the first deploy

Set your real domain in two places:

- `site:` in `astro.config.mjs` — drives canonical URLs, `sitemap-index.xml`
  and `rss.xml`.
- The `Sitemap:` line in `public/robots.txt`.

`public/_headers` already sets sensible security headers and caches the
fingerprinted `/_astro/*` assets for a year.

### Deploying from your terminal instead

```bash
npm install -D wrangler
npx wrangler pages deploy dist --project-name=your-project
```

---

## Project structure

```
src/
├── components/       # Header, Footer, ProjectCard, Chip, ThemeToggle...
├── content/
│   ├── projects/     # one Markdown file per project
│   └── now/          # one Markdown file per update
├── data/site.ts      # ← all your personal information
├── layouts/          # BaseLayout
├── lib/projects.ts   # collection queries, date formatting, badge styling
├── pages/            # routes; file path = URL
├── styles/global.css # Tailwind theme tokens, light + dark
└── content.config.ts # frontmatter schemas
public/               # served as-is: favicon, robots.txt, _headers, resume.pdf
```

## Notes

- **Dark mode** follows the system setting and can be toggled in the header.
  The choice persists in `localStorage`, and is applied by an inline script
  before first paint so there is no flash.
- **No JavaScript framework.** The only client-side code is the theme toggle,
  the mobile menu, and the project filter — a few dozen lines of vanilla JS.
- **Drafts** (`draft: true`) render in `npm run dev` and are excluded from
  `npm run build`, so you can work on a write-up before publishing it.
- **The `overrides` block in `package.json`** pins a single copy of Vite. Astro
  depends on Vite 6 while `@tailwindcss/vite` accepts 6 through 8; without the
  pin, npm installs two copies and `npm run check` reports a spurious plugin
  type error. Remove it only if Astro and Tailwind converge on one major.

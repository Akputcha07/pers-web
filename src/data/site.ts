/* ============================================================================
 * EDIT THIS FILE FIRST.
 *
 * Everything personal about the site lives here: your name, contact details,
 * social links, resume, skills, experience and education. Change the values
 * below and the whole site updates. No other file needs to be touched for
 * basic personalisation.
 *
 * Projects and "now" updates are Markdown files instead:
 *   src/content/projects/*.md
 *   src/content/now/*.md
 * ========================================================================== */

export const SITE = {
  /** Shown in the header, page titles and structured data. */
  name: 'Akshay Putcha',
  /** One-line role descriptor. Appears under your name in the hero. */
  role: 'Computer Engineering Student at Texas A&M University',
  /** City / region. Recruiters filter on this, so keep it accurate. */
  location: 'McKinney, TX',
  /** ~2 sentences. Used for the homepage intro and as the meta description. */
  blurb:
    'Systems-oriented Computer Engineering student with a proven track record of ' +
    'designing and executing end-to-end applications. Combines hands-on experience in ' +
    'UI/UX prototyping and accessibility-focused mobile design with rigorous backend and ' +
    'AI integration skills. Adept at navigating complex technical constraints to engineer ' +
    'functional, high-performance software.',
  /** Short meta description fallback for pages that do not set their own. */
  description:
    'Portfolio of Akshay Putcha, a Computer Engineering student at Texas A&M University. ' +
    'Projects, experience, and skills.',
  /** Your production URL, read from astro.config.mjs so it is defined once. */
  url: import.meta.env.SITE ?? 'https://yourdomain.com',
} as const;

/** Set `available` to false when you are not looking, and the banner disappears. */
export const AVAILABILITY = {
  available: false,
  /** Short status line shown in the homepage hero pill. */
  headline: '',
  /** Optional longer note shown on the About page. Set to '' to hide. */
  detail: '',
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Text shown on hover and to screen readers. */
  handle: string;
};

/** Delete any you do not use. The UI adapts to however many are here. */
export const SOCIALS: SocialLink[] = [
  { label: 'Email', href: 'mailto:akputcha@gmail.com', handle: 'akputcha@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/Akputcha07', handle: '@fangyus' },
  { label: 'GitHub', href: 'https://github.com/Xodyus', handle: '@Xodyus' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshay-putcha', handle: '/in/akshay-putcha' },
];

/**
 * Put your PDF at `public/resume.pdf` and it will be served from `/resume.pdf`.
 * Set `href: null` to hide every "Resume" link across the site.
 */
export const RESUME = {
  href: '/resume.pdf' as string | null,
  /** Bump this when you upload a new PDF so visitors see it is current. Set to '' to hide. */
  updated: '' as string,
} as const;

/* -------------------------------------------------------------------------- */
/* Skills, grouped so the About page can render them as a matrix.              */
/* -------------------------------------------------------------------------- */

export type SkillGroup = {
  title: string;
  /** 'software' or 'hardware' tints the heading to match the project badges. */
  domain: 'software' | 'hardware';
  items: string[];
};

export const SKILLS: SkillGroup[] = [
  {
    title: 'Languages',
    domain: 'software',
    items: ['Python', 'C++', 'Java', 'TypeScript', 'C'],
  },
  {
    title: 'Frameworks & Libraries',
    domain: 'software',
    items: ['React', 'Tauri', 'FastAPI', 'Qt 6', 'Playwright'],
  },
  {
    title: 'APIs & Data',
    domain: 'software',
    items: ['Anthropic Claude API', 'SQLite', 'Win32 API'],
  },
  {
    title: 'Embedded & Hardware',
    domain: 'hardware',
    items: ['Arduino', 'DHT11 sensor', 'Photoresistor', 'Serial communication'],
  },
];

/* -------------------------------------------------------------------------- */
/* Experience, newest first.                                                   */
/* -------------------------------------------------------------------------- */

export type Experience = {
  role: string;
  org: string;
  /** Free text, so you can write "May 2026 - Aug 2026" or "2024 - Present". */
  period: string;
  location?: string;
  /** 2 to 4 bullets. Lead with impact and include numbers where you have them. */
  points: string[];
  /** Optional tech chips shown under the bullets. */
  stack?: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    role: 'Junior Software Developer',
    org: 'One Sight Technology',
    period: 'May 2024 - May 2025',
    location: 'Chennai, Tamil Nadu',
    points: [
      'Spearheaded the technical design of a mobile application prototype aimed at improving accessibility and quality of life for children with Autism Spectrum Disorder (ASD).',
      'Engineered customized UI/UX features, including specialized color modes, to maximize user engagement and accessibility.',
      'Architected and implemented a backend storage solution to track user preferences and save progress across gamified learning modules.',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Education                                                                   */
/* -------------------------------------------------------------------------- */

export type Education = {
  school: string;
  credential: string;
  period: string;
  location?: string;
  /** Optional. Delete the line if you would rather not publish it. */
  gpa?: string;
  /** Courses recruiters actually scan for. Keep it to the relevant ones. */
  coursework?: string[];
  notes?: string[];
};

export const EDUCATION: Education[] = [
  {
    school: 'Texas A&M University',
    credential: 'Computer Engineering',
    period: 'Expected May 2029',
    location: 'College Station, TX',
    gpa: '3.3 / 4.0',
  },
];

/* -------------------------------------------------------------------------- */
/* Awards, certifications, activities. Hidden automatically when empty.        */
/* -------------------------------------------------------------------------- */

export type Credential = {
  title: string;
  issuer?: string;
  year?: string;
  href?: string;
};

export const CREDENTIALS: Credential[] = [
  { title: 'Claude Code in Action' },
  { title: 'Building with Claude API' },
  { title: 'Java Certificate' },
];

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const NAV = [
  { label: 'Projects', href: '/projects/' },
  { label: 'Now', href: '/now/' },
  { label: 'About', href: '/about/' },
] as const;

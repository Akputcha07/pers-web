import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../data/site';
import { getNowEntries } from '../lib/projects';

export async function GET(context: APIContext) {
  const entries = await getNowEntries();

  return rss({
    title: `${SITE.name} — Now`,
    description: 'Updates on what I am currently building and learning.',
    site: context.site ?? SITE.url,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/now/${entry.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}

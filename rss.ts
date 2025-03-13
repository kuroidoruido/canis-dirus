import { type FeedEntry, parseFeed } from "jsr:@mikaelporttila/rss@*";
import { RSS_FEED_URL } from "./env.ts";

export type RssEntry = {
  title: string;
  link: string;
  published: string;
};

export async function getRssEntries(): Promise<RssEntry[]> {
  try {
    console.log("Fetching RSS feed", RSS_FEED_URL);
    const response = await fetch(RSS_FEED_URL);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    console.log(`Found ${feed.entries.length} entries in RSS feed`);
    const items: RssEntry[] = feed.entries.map((entry: FeedEntry) => ({
      title: entry.title.value,
      link: entry.links[0].href,
      published: new Date(entry.published ?? entry.updated).toISOString(),
    }));

    // Sort item on the publication date, ascending order. Useful so the oldest MAX_ITEM_PER_RUN items will be published.
    return items.sort((a: RssEntry, b: RssEntry) =>
      a.published.localeCompare(b.published)
    );
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
}

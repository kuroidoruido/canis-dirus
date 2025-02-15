import { type FeedEntry, parseFeed } from "jsr:@mikaelporttila/rss@*";

// Mastodon API configuration
const MASTODON_TOKEN = Deno.env.get("MASTODON_TOKEN");
const MASTODON_INSTANCE = Deno.env.get("MASTODON_INSTANCE") ||
  "https://mastodon.social";
const RSS_FEED_URL = Deno.env.get("RSS_FEED_URL") ||
  "https://ehret.me/links.xml";
const STATUS_VISIBILITY = Deno.env.get("STATUS_VISIBILITY") || "unlisted";
const KV_PREFIX = Deno.env.get("KV_PREFIX") || "canis-dirus";
const CREATE_POSTS = (Deno.env.get("CREATE_POSTS") || "true") === "true";
const MESSAGE_TITLE_PREFIX = Deno.env.get("MESSAGE_TITLE_PREFIX") || "🎉 ";
const MESSAGE_LINK_PREFIX = Deno.env.get("MESSAGE_LINK_PREFIX") || "🔗 ";
const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE") || "0 * * * *";
const MAX_ITEM_PER_RUN = parseInt(Deno.env.get("MAX_ITEM_PER_RUN") || "1", 10);

type RssEntry = {
  title: string;
  link: string;
  published: string;
};

async function getRssEntries(): Promise<RssEntry[]> {
  try {
    console.log("Fetching RSS feed", RSS_FEED_URL);
    const response = await fetch(
      RSS_FEED_URL,
    );
    const xml = await response.text();
    const feed = await parseFeed(xml);

    console.log(`Found ${feed.entries.length} entries in RSS feed`);
    const items: RssEntry[] = feed.entries.map((entry: FeedEntry) => ({
      title: entry.title.value,
      link: entry.links[0].href,
      published: (new Date(entry.published ?? entry.updated)).toISOString(),
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

async function postToMastodon({ title, link }: RssEntry) {
  const status =
    `${MESSAGE_TITLE_PREFIX}${title}\n${MESSAGE_LINK_PREFIX}${link}`;

  try {
    const mastoUrl = new URL(`${MASTODON_INSTANCE}/api/v1/statuses`);
    console.log(`Posting status to ${mastoUrl.toString()}`, {
      status,
      visibility: STATUS_VISIBILITY,
    });
    mastoUrl.searchParams.set("status", status);
    mastoUrl.searchParams.set("visibility", STATUS_VISIBILITY);
    const response = await fetch(mastoUrl.toString(), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MASTODON_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting to Mastodon:", error);
    throw error;
  }
}

Deno.cron("Check RSS feed", CRON_SCHEDULE, async () => {
  const rssEntries = await getRssEntries();
  const kv = await Deno.openKv();

  console.log(MAX_ITEM_PER_RUN);

  for (const rssEntry of rssEntries) {
    const entry = await kv.get([KV_PREFIX, rssEntry.link]);
    if (!entry.value) {
      if (CREATE_POSTS) {
        await postToMastodon(rssEntry);
      }
      kv.set([KV_PREFIX, rssEntry.link], rssEntry);
    }
  }

  kv.close();
});

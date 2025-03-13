import { getRssEntries } from "./rss.ts";
import { postToMastodon } from "./mastodon.ts";

const IS_LOCAL = Deno.env.get("IS_LOCAL") === "true";
const KV_PREFIX = Deno.env.get("KV_PREFIX") ?? "canis-dirus";
const CREATE_POSTS = (Deno.env.get("CREATE_POSTS") ?? "true") === "true";
const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE") ?? "0 * * * *";
const MAX_ITEM_PER_RUN = parseInt(Deno.env.get("MAX_ITEM_PER_RUN") ?? "1", 10);
const DENO_KV_URL = Deno.env.get("DENO_KV_URL");

async function runTheToots() {
  const rssEntries = await getRssEntries();
  const kv = await Deno.openKv(DENO_KV_URL);

  console.log(`Ready to post ${MAX_ITEM_PER_RUN} items`);

  let posted = 0;
  for (const rssEntry of rssEntries) {
    const entry = await kv.get([KV_PREFIX, rssEntry.link]);
    if (!entry.value) {
      if (CREATE_POSTS) {
        await postToMastodon(rssEntry);
        kv.set([KV_PREFIX, rssEntry.link], rssEntry);
        posted = posted + 1;
      }
    }

    if (posted >= MAX_ITEM_PER_RUN) {
      break;
    }
  }

  kv.close();
}

if (IS_LOCAL) {
  await runTheToots();
} else {
  Deno.cron("Check RSS feed", CRON_SCHEDULE, async () => {
    await runTheToots();
  });
}

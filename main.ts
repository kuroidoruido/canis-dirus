import { getRssEntries } from "./rss.ts";
import { postToMastodon } from "./mastodon.ts";
import {
  DENO_KV_URL,
  MAX_ITEM_PER_RUN,
  KV_PREFIX,
  CREATE_POSTS,
  IS_LOCAL,
  CRON_SCHEDULE,
} from "./env.ts";

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

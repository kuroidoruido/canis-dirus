export const IS_LOCAL = Deno.env.get("IS_LOCAL") === "true";
export const KV_PREFIX = Deno.env.get("KV_PREFIX") ?? "canis-dirus";
export const CREATE_POSTS = (Deno.env.get("CREATE_POSTS") ?? "true") === "true";
export const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE") ?? "0 * * * *";
export const MAX_ITEM_PER_RUN = parseInt(
  Deno.env.get("MAX_ITEM_PER_RUN") ?? "1",
  10
);
export const DENO_KV_URL = Deno.env.get("DENO_KV_URL");
export const RSS_FEED_URL =
  Deno.env.get("RSS_FEED_URL") || "https://ehret.me/links.xml";
export const MASTODON_TOKEN = Deno.env.get("MASTODON_TOKEN");
export const MASTODON_INSTANCE =
  Deno.env.get("MASTODON_INSTANCE") ?? "https://mastodon.social";
export const STATUS_VISIBILITY =
  Deno.env.get("STATUS_VISIBILITY") ?? "unlisted";
export const MESSAGE_TITLE_PREFIX =
  Deno.env.get("MESSAGE_TITLE_PREFIX") ?? "🎉 ";
export const MESSAGE_LINK_PREFIX = Deno.env.get("MESSAGE_LINK_PREFIX") ?? "🔗 ";

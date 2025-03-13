// Mastodon API configuration
import {
  MESSAGE_TITLE_PREFIX,
  MESSAGE_LINK_PREFIX,
  MASTODON_INSTANCE,
  STATUS_VISIBILITY,
  MASTODON_TOKEN,
} from "./env.ts";
import { RssEntry } from "./rss.ts";

export async function postToMastodon({ title, link }: RssEntry) {
  const status = `${MESSAGE_TITLE_PREFIX}${title}\n${MESSAGE_LINK_PREFIX}${link}`;

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
        Authorization: `Bearer ${MASTODON_TOKEN}`,
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

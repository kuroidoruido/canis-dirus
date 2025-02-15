# 🐺 Canis Dirus

A script to RSS ➡️ Mastodon automagically.

## Pre-requisites

This needs [🦖Deno](https://deno.com/).

## Install dependencies

Run `deno install`

## Run the script

A Mastodon token is needed, created at
`<MASTODON_INSTANCE>/settings/applications`

You can create a `.env` file like this:

```
MASTODON_INSTANCE=https://mastodon.social
MASTODON_TOKEN=myawesometoken
RSS_FEED_URL=https://example.com/links.xml
STATUS_VISIBILITY=public
CREATE_POSTS=true
MESSAGE_TITLE_PREFIX="🎉 "
MESSAGE_LINK_PREFIX="🔗 "
CRON_SCHEDULE="0 * * * *"
MAX_ITEM_PER_RUN=1
```

⚠️ To run locally, it is recommended to comment the KV and Cron lines.

```shell
deno run --env-file=.env main.ts
```

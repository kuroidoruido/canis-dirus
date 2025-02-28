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

⚠️ To run locally, use:

- Set the `IS_LOCAL` environment variable to "true"
- An access token from https://dash.deno.com/account, added to the
  `DENO_KV_ACCESS_TOKEN` environment variable
- The Deno KV url from the deployment dashboard, added to the `DENO_KV_URL`
  environment variable

Then run with:

```shell
deno run --allow-env --allow-net --env-file=.env --unstable-kv main.ts
```

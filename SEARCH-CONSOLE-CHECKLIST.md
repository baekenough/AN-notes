# Search Console + Social Preview Release Checklist

Use this checklist after shipping SEO/GEO changes to AI Native Notes.

## 0) Fast preflight
Run the repo-native smoke check before manual console work:

```bash
npm run check:seo-release
```

Optional alternate target:

```bash
npm run check:seo-release -- https://an-con.vercel.app
```

This script verifies:
- representative HTML routes
- JSON-LD presence on landing pages
- `llms.txt` / `agents.txt` discovery markers
- `opengraph-image` / `twitter-image` image responses

## 1) Confirm the production target
- Primary Vercel deployment: `https://ai-native-notes-h15naf5mf-sangyi-baeks-projects.vercel.app`
- Current alias used for smoke checks: `https://an-con.vercel.app`
- Canonical site URL expected by metadata: `https://annotes.baekenough.com`

## 2) Check crawl/index entry points
- Open `/robots.txt`
- Open `/sitemap.xml`
- Open `/llms.txt`
- Open `/agents.txt`
- Confirm all four return `200 OK`

Suggested URLs:
- `https://annotes.baekenough.com/robots.txt`
- `https://annotes.baekenough.com/sitemap.xml`
- `https://annotes.baekenough.com/llms.txt`
- `https://annotes.baekenough.com/agents.txt`

## 3) Inspect representative pages
Verify these pages render and show the new SEO/content surface:
- `/en`
- `/en/gpt-codex`
- `/en/gpt-codex/codex-getting-started`
- `/en/whats-new`
- `/ko`
- `/es`

What to look for:
- FAQ section appears on the homepage
- Tool summary + topic chips appear on the homepage/tool index
- Article updated date is visible
- No blank subtitle badge on the homepage

## 4) Search Console URL inspection
For each of the representative URLs above:
- Run **URL Inspection**
- Request indexing if Google has not recrawled yet
- Confirm canonical URL is the locale URL you expect
- Confirm page is crawlable and not blocked by robots

## 5) Rich results / structured data spot check
On homepage, tool page, article page, and What's New:
- Verify JSON-LD is present in page source
- Confirm expected schema types:
  - Homepage: `WebSite`, `Organization`, `CollectionPage`, `FAQPage`
  - Tool page: `CollectionPage`, `BreadcrumbList`
  - Article page: `Article`, `BreadcrumbList`
  - What's New: `CollectionPage`, `BreadcrumbList`

Recommended tools:
- Google Rich Results Test
- Schema Markup Validator

## 6) Social preview validation
Check both assets return image responses:
- `/opengraph-image`
- `/twitter-image`

Then run preview checks in:
- X Card Validator / equivalent preview tool
- Facebook Sharing Debugger
- Slack unfurl preview in a private channel

## 7) Snippet quality review
Search for the site or inspect rendered metadata and confirm:
- title is specific to the page
- description matches visible page content
- OG/Twitter image loads
- `googlebot` preview directives are present

## 8) Post-release monitoring
During the first 24–72 hours after release:
- watch Search Console coverage/indexing changes
- watch for crawl anomalies on locale-prefixed pages
- spot-check if homepage/tool/article pages are being recached correctly
- record any mismatch between canonical domain and Vercel alias previews

## 9) If something looks wrong
- Re-run `npm run lint`
- Re-run `npx tsc --noEmit --pretty false --project tsconfig.json`
- Re-run `npm run build`
- Re-run `npm run check:seo-release`
- Inspect deployment logs with:
  - `vercel inspect ai-native-notes-h15naf5mf-sangyi-baeks-projects.vercel.app --logs`

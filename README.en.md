[한국어](README.md) | [English](README.en.md) | [Español](README.es.md)

---

# AI Native Notes

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

A community-driven guide site for using AI coding tools properly

**Live site**: https://annotes.baekenough.com

![AI Native Notes Screenshot](docs/screenshot.png)

---

## What is AI Native Notes?

AI Native Notes is inspired by PyCon. Just as PyCon is a gathering space for the Python community, AI Native Notes is a collection of practical guides for anyone who wants to use AI coding tools effectively.

Claude Code, GPT Codex, Gemini CLI — find real-world tips for each tool in one place. Built not just for developers, but for everyone who wants to put AI tools to work.

---

## Supported Tools

| Tool | Tips | Status |
|------|------|--------|
| Claude Code (Anthropic) | 6 | Live |
| GPT Codex (OpenAI) | 7 | Live |
| Gemini CLI (Google) | 5 | Live |

---

## Key Features

- **19 practical tips** — each with difficulty level, reading time, and cross-tool connections
- **3 languages** — Korean, English, Spanish (Chinese and Japanese planned)
- **Cross-tool links** — tips connect to related guides in other tools
- **What's New** — highlights of game-changing features per tool
- **Browser language detection** — automatic locale routing
- **Dark theme** — Geist typography
- **Mobile-first responsive** — from Z Flip 6 to 11" tablets

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install and Run

```bash
git clone https://github.com/baekenough/AN-notes.git
cd AN-notes
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Content Structure

```
content/
  {tool}/           # claude-code | gpt-codex | gemini-cli
    {slug}/
      ko.mdx        # Korean
      en.mdx        # English
      es.mdx        # Spanish
```

---

## Adding Content

To add a new tip, create an MDX file for each language with the following frontmatter:

```yaml
---
title: "Tip title"
description: "One-line summary"
tool: claude-code          # claude-code | gpt-codex | gemini-cli
difficulty: beginner       # beginner | intermediate | advanced
readingTime: 5             # minutes
tags: [claude, workflow]
relatedTips:
  - tool: gpt-codex
    slug: agents-md
connections:
  - tool: gemini-cli
    slug: getting-started
    reason: "Similar configuration file approach"
---
```

---

## Deployment

Production deployment with Docker:

```bash
# Build the image
docker build -t ai-native-notes .

# Run the container
docker run -p 3000:3000 ai-native-notes
```

HTTPS is handled via Cloudflare Tunnel.

---

## Contributing

New tips, translation improvements, and bug fixes are all welcome.

1. Fork this repository
2. Create a branch: `feature/your-tip-name`
3. Commit your changes: `feat: add new tip for claude-code`
4. Open a Pull Request

For tip suggestions or feedback, open an issue.

---

## License

[MIT](LICENSE) — Copyright (c) 2026 baekenough

---

## Links

- Live site: https://annotes.baekenough.com
- GitHub: https://github.com/baekenough/AN-notes

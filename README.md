# Tech & the City — Full Site (Next.js)

Industrial aesthetic with SATC pink accents. Multi-page, SEO, markdown blog, Street Series, Events, Subscribe, About.
Optional in-browser editor via **Decap CMS** (GitHub-backed).

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Write articles (markdown)
Add a new file in `content/posts/your-article.md` with frontmatter:

```md
---
title: "My Title"
date: "2025-09-02"
excerpt: "Short summary"
tags: ["AI","Culture"]
read: "4 min"
---
Your markdown content here.
```

The post appears automatically at `/articles/your-article`.

## Optional: Browser editor (no-code)
- Deploy to GitHub + Netlify.
- Edit `public/admin/config.yml` with your repo.
- Enable **Netlify Identity** & **Git Gateway**.
- Visit `/admin` to write posts in the browser.

## Deploy
- **Vercel (recommended):** import repo → Deploy (Next.js).
- **Netlify:** `npm run build`, publish `.next` via adapter or Next-on-Netlify.
- **Render/Fly:** `npm run build && npm start`.

## Customize
- Colors: Tailwind config or `app/globals.css`.
- Navigation: `components/Nav.jsx`.
- Footer: `components/Footer.jsx`.
- Events data: `data/events.json`.
- Street videos: `data/street.json`.
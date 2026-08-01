# Deploying PrymCare Health to GitHub Pages

## Site structure (multi-page)

The site is now a proper multi-page website with shared assets:

```
index.html          Home
about.html           About Us
shop.html             Shop (full product catalogue + cart)
blog.html             Wellness Library
partner.html          Become a Partner
faq.html              FAQs
contact.html          Contact
assets/css/style.css  Shared styles used by every page except shop.html (which is self-contained)
assets/js/main.js     Shared behaviour (nav, scroll effects, cookie bar, forms, counters, carousel)
assets/logo.jpg       Logo file (also embedded as base64 directly in every page — see below)
manifest.json, robots.txt, sitemap.xml
```

Every page pulls in `assets/css/style.css` and `assets/js/main.js` via normal `<link>`/`<script src>` tags — make sure the whole `assets/` folder is pushed, not just the HTML files.

## What was wrong

Your logo and images weren't showing after deploying. This is almost always one of these, in order of likelihood:

1. **The `assets` folder never actually made it into the repo.** GitHub's drag-and-drop uploader on the web sometimes uploads only the files you drop and silently skips nested folders, especially if you dragged the folder in from a file explorer rather than using "Add file → Upload files" and selecting the folder's contents directly.
2. **Case sensitivity.** GitHub Pages runs on Linux servers, which treat `Logo.jpg`, `logo.JPG`, and `logo.jpg` as three different files. If the file got renamed slightly during upload (a common GitHub web-UI quirk), the reference in the HTML no longer matches.
3. **Repo/Pages path mismatch.** If `index.html` isn't sitting at the root of the branch GitHub Pages is serving (or is inside an extra subfolder), relative paths like `assets/logo.jpg` will 404.
4. **Jekyll processing.** GitHub Pages runs your site through Jekyll by default, which can occasionally interfere with folders it doesn't expect.

## What I fixed

- **The logo is now embedded directly in the HTML** as a Base64 data URI everywhere it's displayed (header, hero, about section, footer, and favicon). This means the logo **cannot break from a bad file path ever again** — it's part of the HTML itself, not a separate file GitHub has to serve correctly. This is the main fix.
- **Added `.nojekyll`** to the repo root, which tells GitHub Pages to skip Jekyll processing entirely and serve every file exactly as-is.
- **Added `manifest.json`** with an embedded icon, so the site behaves better as an installable/mobile-friendly app.
- All the product, category, and section icons were already inline SVG code (not image files), so those were never affected by this bug.

The only files that still reference `assets/logo.jpg` as a normal path are the `og:image` / `twitter:image` meta tags and the structured data — social media crawlers (Facebook, Twitter/X, WhatsApp link previews) require a real hosted image URL, they can't read embedded data URIs. Once your site is live at its final domain, double-check that `https://yourdomain.com/assets/logo.jpg` loads directly in a browser tab — if it does, social previews will work too.

## How to deploy correctly

1. Push the **entire folder** (`index.html`, `assets/`, `robots.txt`, `sitemap.xml`, `manifest.json`, `.nojekyll`) to your repository — ideally with `git push` from the command line rather than the web upload UI, since it's the most reliable way to preserve folder structure:
   ```bash
   git init
   git add .
   git commit -m "Deploy PrymCare Health site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. In your repo, go to **Settings → Pages**, and set the source branch to `main` and the folder to `/ (root)`.
3. Wait 1–2 minutes, then visit `https://YOUR_USERNAME.github.io/YOUR_REPO/`.
4. If you still see anything broken, open your browser's DevTools → Network tab, reload, and look for any request showing a red 404 — that tells you exactly which file path is wrong.

## Before going live, update these placeholders

- Phone/WhatsApp number: currently `233000000000` (search/replace across `index.html`)
- Email: `hello@prymcare.com`
- Social links in the contact section and structured data (currently built from the `@prymcare` handle)
- Domain references in the SEO tags and `sitemap.xml` (currently `prymcare.com`)
- Product prices/descriptions — update with your live catalogue

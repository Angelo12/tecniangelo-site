# Tecni Angelo LLC — company site

One-page static site (no build step). Plain HTML/CSS in `index.html`.

## Files
- `index.html` — the page
- `icon.png`, `favicon.png` — app/brand icon
- `quetasa-home.png` — hero screenshot
- `CNAME` — add this when you point a custom domain (see below)

## Deploy free on GitHub Pages
1. Create a **public** repo, e.g. `Angelo12/tecniangelo-site`.
2. Push these files to the `main` branch.
3. Repo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `(root)`.
4. Live in ~1 min at `https://angelo12.github.io/tecniangelo-site/`.

```bash
cd /Users/angelo/Documents/tecniangelo-site
git init && git add -A && git commit -m "Tecni Angelo LLC site"
gh repo create Angelo12/tecniangelo-site --public --source=. --push
```

## Add a custom domain later (no rebuild)
The site is domain-ready. When you buy a domain (e.g. `tecniangelo.com`):
1. Create a file named `CNAME` in this repo containing one line: `tecniangelo.com`
2. At your registrar, add DNS records pointing to GitHub Pages:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `angelo12.github.io`
3. Repo → Settings → Pages → set the custom domain + Enforce HTTPS.

That's the whole switch — same files, professional URL.

## After you have the URL
- Add it as the **Marketing URL** in App Store Connect (currently blank).
- Add it as the **Website / developer contact** in Google Play Console.
- Optional: move the privacy policy onto this domain so everything lives under one brand
  (currently at https://angelo12.github.io/quetasa-legal/ — keep that link working, or
  add a redirect, since it's already referenced in App Store Connect).

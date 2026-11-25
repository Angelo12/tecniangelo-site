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

## quelocal/ — the QueLocal product page
A separate static page at `https://tecniangelo.com/quelocal/` (Spanish): `quelocal/index.html`,
`quelocal/styles.css`, `quelocal/app.js` and `quelocal/media/`. No build step.

- The product was called Fogón POS until 24 November 2026 and its page was at `/fogon/`.
  `fogon/index.html` is all that is left there: it sends old links on to `/quelocal/`,
  keeping the section they pointed to. "Fogón" on the page today is only the name of the
  default colour combination, as in the program.
- The pictures and videos are copies from the product repo (`Angelo12/fogon-pos`, private),
  folders `docs/demo` and `docs/demo/showcase`. After retaking them there, run
  `python tools/site-media.py <this repo>/quelocal docs/demo` from that repo.
- Measured figures carry a `data-stat="..."` attribute, so each can be found and changed
  everywhere it appears.
- A video block hides itself while its file is missing, so the page never shows a broken player.
- The page says what does not work yet (fiscal printers first of all). Keep that section true.
- The home page links to it from its own "QueLocal" section and the footer.

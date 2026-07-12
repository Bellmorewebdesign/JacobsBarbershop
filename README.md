# Elegant Barber Shop — Website

A polished, production-ready static website for **Elegant Barber Shop** in
Bellmore, New York. Built with plain HTML, CSS, and vanilla JavaScript — no
frameworks, no backend, no build step. It's designed to be hosted for free on
**GitHub Pages**.

- **Business:** Elegant Barber Shop
- **Address:** 210 Bedford Ave, Bellmore, NY 11710
- **Phone:** (516) 679-8909
- **Rating:** 4.9 stars on Google (135 reviews)

---

## Project overview

Two pages that share one stylesheet and one script:

- **`index.html`** — the main homepage (info bar, hero, about, services,
  family section, gallery preview, reviews, visit/location with map, and a
  final call to action).
- **`gallery.html`** — a full 15-image haircut gallery plus "What Customers
  Appreciate," "Before You Visit," and a compact visit card.

Both pages include a shared, accessible navigation, footer, and image lightbox.

## File structure

```
.
├── index.html          # Homepage
├── gallery.html        # Full gallery page
├── styles.css          # Shared styles for both pages
├── script.js           # Shared JS (nav, reveal animations, gallery, lightbox)
├── README.md           # This file
├── .nojekyll           # Tells GitHub Pages to serve files as-is
├── Elegant_logo.png    # Logo (header, hero, footer)
├── favicon_elegant.png # Favicon / touch icon
├── exterior-barbershop.png  # Storefront photo (Visit section)
├── Barbershop_elegant.png   # Shop interior photo (About section)
├── 3-boys.png          # Family-friendly photo (hero + family section)
└── gallery/
    ├── README.md       # Instructions for adding haircut photos
    ├── gallery-01.png  # (add these — see gallery/README.md)
    └── ... through gallery-15.png
```

The `gallery-01.png … gallery-15.png` files are **not included yet**. Until you
add them, the site shows a clean "Gallery photo coming soon" placeholder in each
empty slot — no broken images.

## How to preview locally

You need any simple static file server. The easiest is Python (already
installed on most systems):

```bash
python -m http.server 8000
```

Then open your browser to:

```
http://localhost:8000
```

That's it — there is **no `npm install` and no build command**.

## Gallery image naming

Add your haircut photos to the `gallery/` folder using these **exact**
lowercase filenames:

```
gallery-01.png … gallery-15.png
```

- The first six appear on the homepage preview.
- All fifteen appear on `gallery.html`.
- **Filenames are case-sensitive on GitHub Pages** — use lowercase and the
  `.png` extension exactly.

See [`gallery/README.md`](gallery/README.md) for full details and photo-size
recommendations.

## How to update business information

Business details (address, phone, hours, ratings, social links) live directly
in the HTML. To change them:

- **Phone number:** search `index.html` and `gallery.html` for
  `+15166798909` (the `tel:` links) and `(516) 679-8909` (the visible text).
- **Address:** search for `210 Bedford Ave`.
- **Hours:** edit the `<table class="hours">` blocks in the Visit sections.
- **Ratings / review text:** edit the Reviews section in `index.html`.
- **Social links:** search for `instagram.com` and `tiktok.com`.
- **Structured data:** update the `application/ld+json` block near the top of
  each HTML file so search engines stay in sync.

## How to replace photos

- **Logo / favicon / storefront / interior / family photos:** replace the
  matching `.png` file in the project root, keeping the same filename.
- **Gallery photos:** drop correctly named files into the `gallery/` folder
  (see above). Replacing a file while keeping its name updates the site
  automatically.

## How to deploy through GitHub Pages

1. Commit and push your files to the repository (see commands below).
2. On GitHub, open the repository and go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the **`main`** branch.
6. Select the **`/ (root)`** folder.
7. Click **Save**.
8. Wait a minute or two for GitHub Pages to publish the site, then visit the
   URL it shows.

> **Note:** GitHub Pages filenames are **case-sensitive**. `gallery-01.png` and
> `Gallery-01.PNG` are different files.

### Example git commands

```bash
git status
git add .
git commit -m "Build Elegant Barber Shop website"
git pull --rebase origin main
git push origin main
```

## No backend, no build

- **There is no backend, database, or server code.** Everything runs in the
  browser.
- **There is no npm install and no build step.** The files work directly as-is
  through GitHub Pages.
- All paths are **relative**, so the site works whether it's served from a
  domain root or a repository subdirectory.

---

Powered by [Bellmore Web Design](https://bellmorewebdesign.com).

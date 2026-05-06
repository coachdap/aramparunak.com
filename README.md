# aramparunak.com

Personal site for Aram Parunak. Astro 4.x, hand-rolled CSS, deploys to Cloudflare Pages.

It is the writing/voice hub. The business — [hoopscollege.com](https://hoopscollege.com) — lives elsewhere and is linked to from here.

---

## Run locally

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

```bash
npm run build       # build to ./dist
npm run preview     # serve the built site locally
```

---

## Project structure

```
src/
  components/      Header, Footer, BaseHead (<head> partial)
  layouts/         BaseLayout (page shell), PostLayout (single post)
  pages/
    index.astro            Home (/)
    about.astro            /about
    now.astro              /now
    principles.astro       /principles  (titled "What I Believe")
    contact.astro          /contact
    404.astro              404 page
    rss.xml.ts             /rss.xml feed
    writing/
      index.astro          /writing  (Start here + Archive by year)
      [...slug].astro      /writing/<slug>
  content/
    config.ts              Content-collection schema for /writing
    writing/               Markdown post files live here
  styles/
    global.css             Single global stylesheet, all design tokens
  consts.ts                Site-wide constants (URLs, social, email)
public/
  robots.txt
  favicon.svg
  og-default.svg           Default Open Graph image
astro.config.mjs           Astro + sitemap + mdx
wrangler.toml              Cloudflare Pages config
```

---

## Add a new blog post

1. Drop a `.md` (or `.mdx`) file into `src/content/writing/`. The filename becomes the URL slug, so `the-real-problem.md` → `/writing/the-real-problem/`.
2. Frontmatter:

   ```yaml
   ---
   title: The real problem with youth basketball
   date: 2026-04-12
   description: One-line summary used in meta tags and on the archive page.
   featured: true              # optional, defaults to false
   tags: ["On the work"]       # optional; one tag is fine, array allows multiple
   ---
   ```

3. Write the post in plain Markdown. Headings (`##`, `###`), lists, blockquotes, fenced code blocks, images, and links all work.

4. Mark up to 5 posts `featured: true` to surface them in the **Start here** section on `/writing`. The rest fall into the year-grouped archive automatically.

5. Tag each post with one of the existing sections so it groups cleanly. Current sections (and what they're about):

   - **On the work** — greatness, effort, refusing shortcuts, doing it daily
   - **On teaching** — how skill is built, decision-making, progression
   - **On parents** — what families do right and wrong
   - **On honesty** — truth-telling, no marketing veneer
   - **On leadership** — owning failures, accountability
   - **On building** — making your own thing, betting on yourself
   - **On faith** *(empty — for future posts)*
   - **On family** *(empty — yours, not other people's)*
   - **On the early years** *(empty — West Jefferson, the misdiagnosis, identity)*

   To introduce a new section, just start using a new tag — there's no central registry.

The dev server hot-reloads on save. The build will fail loudly if a post is missing a required frontmatter field.

---

## Update the /now page

Edit `src/pages/now.astro`. Replace the placeholder paragraphs with the current state. Bump `lastUpdated` near the top of the file:

```ts
const lastUpdated = new Date('2026-05-03');
```

The footer date renders from that one constant. Don't hand-format it elsewhere.

---

## Accent color

The site ships with **oxblood** as the default accent — used for links, the wordmark on hover, and the OG image background. Three options are wired into `src/styles/global.css`:

| Name           | Hex       | Feel                                                    |
| -------------- | --------- | ------------------------------------------------------- |
| Oxblood        | `#6b1f2a` | Default. Serious, credibility-driven, slightly literary. |
| Deep teal      | `#1f4a4a` | Calm, technical, builder-leaning. Cooler register.       |
| Burnt sienna   | `#b6562d` | Warmer, more energetic. Closest to "basketball" without being orange. |

To switch:

```css
/* src/styles/global.css */
:root {
  --accent: var(--accent-deep-teal);   /* was: var(--accent-oxblood) */
  --accent-hover: #143030;             /* darker shade for hover */
}
```

If you change the accent, also update the `fill` in `public/og-default.svg` (the OG card background) to match.

Recommended `--accent-hover` values:

- Oxblood → `#4a151d`
- Deep teal → `#143030`
- Burnt sienna → `#8a3e1f`

---

## Design notes (so future-you doesn't drift)

- One column. `max-width: 680px`, centered. No sidebars, no asides.
- Inter via Google Fonts, system-stack fallback. Body 18–19px, line-height 1.65.
- Near-black text (`#1a1a1a`) on near-white (`#fafafa`).
- No hero images, author photos, carousels, sliders, animations, parallax, drop shadows, or gradients.
- Borders used sparingly — only the footer top rule and blockquote bar.
- Wordmark "Aram Parunak" is plain text. No logo image.
- Footer is one line of attribution and four social links. No newsletter signup.
- Mobile-first. The same single-column layout, just tighter horizontal padding.

If you find yourself reaching for a component library, stop. The site is small enough that hand-rolled CSS is the right answer.

---

## SEO + technical bits

- Per-page title, description, canonical, Open Graph, Twitter card — all in `src/components/BaseHead.astro`.
- `sitemap-index.xml` generated automatically by `@astrojs/sitemap` at build time.
- `/rss.xml` generated from `src/content/writing/` by `src/pages/rss.xml.ts`.
- JSON-LD: `Person` schema on `/` and `/about`; `Article` schema on each post (in `PostLayout.astro`).
- `robots.txt` and a default OG image live in `public/`.
- 404 page at `src/pages/404.astro` matches the rest of the design.

---

## Deploy to Cloudflare Pages

### One-time GitHub setup

1. Create a GitHub repo and push this project.

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<you>/aramparunak.com.git
   git push -u origin main
   ```

2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.

3. Pick the repo. Use these build settings:

   | Field                    | Value                |
   | ------------------------ | -------------------- |
   | Framework preset         | Astro                |
   | Build command            | `npm run build`      |
   | Build output directory   | `dist`               |
   | Root directory           | `/`                  |
   | Node version             | `20` or higher       |

   (`NODE_VERSION=20` as an environment variable also works.)

4. Save & deploy. Subsequent pushes to `main` redeploy automatically; pull requests get preview URLs.

### Custom domain

Once the first deploy is green:

1. Pages project → **Custom domains → Set up a custom domain**.
2. Add `aramparunak.com` and `www.aramparunak.com`.
3. If the domain's DNS is on Cloudflare already, the records are added for you. Otherwise add the CNAMEs Cloudflare shows.

### Wrangler (optional, for direct deploys)

`wrangler.toml` is included so you can deploy from the CLI if you'd rather skip the GitHub integration:

```bash
npm i -g wrangler
wrangler pages deploy dist --project-name aramparunak-com
```

GitHub-driven deploys are simpler — keep that as the default and reach for wrangler only if needed.

---

## Sample posts

Three placeholder posts ship in `src/content/writing/` so the archive renders during development. Delete them when you drop the real 28 posts in:

```bash
rm src/content/writing/sample-post-*.md
```

The frontmatter shape matches the existing posts (`title`, `date`, `description`, `featured`) — they should slot in without changes.

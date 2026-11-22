# Step Tracker website

A static site with no build step: `index.html`, `privacy.html`, `terms.html` and `support.html`, plus `styles.css`, `main.js` and `assets/`.

## Preview

Double-click `index.html` to open it in Safari, or run a local server from this folder:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Before launch

1. **Domain.** The site is set up for `https://kunalvmore.github.io/StepTracker/`. If you move to a custom domain, update the canonical and Open Graph tags in each page’s `<head>`.
2. **App Store link and Smart App Banner.** Set up for App ID `6837991257`. The badges link to `https://apps.apple.com/app/id6837991257`, which starts working when the app is live. Safari only shows the banner once the app is on the store.
3. **Official badge.** Swap the drawn "Download on the App Store" badge for Apple's official SVG from Apple's Marketing Resources page.
4. **App Store Connect.** Privacy Policy URL: `https://kunalvmore.github.io/StepTracker/privacy.html` · Support URL: `https://kunalvmore.github.io/StepTracker/support.html`

## Hosting (free)

- **GitHub Pages:** push this folder to a repository, then turn on Settings → Pages.
- **Cloudflare Pages / Netlify:** drag and drop this folder.

## Animations

The site uses plain CSS and about 150 lines of JavaScript (`main.js`), with no libraries:

- The hero headline comes in word by word.
- The phone tilts with your pointer.
- Floating cards pop in and drift.
- The walk Live Activity ticks in real time.
- Sections fade in as you scroll, and the phones move with a slight parallax.
- The widgets pop in and their bars grow.
- The iPhone Duo screen unfolds as you reach it.
- FAQ answers open smoothly.
- The final call-to-action gradient flows slowly.

Everything turns off automatically when the visitor has **Reduce Motion** switched on.

# Kevin Siringo Ringo — personal portfolio

Static HTML, CSS, and vanilla ES modules for https://kevin200203.github.io/. All public content lives in `index.html`; GitHub Pages publishes `main` at `/`. No framework, dependency installation, or build step is needed to deploy.

## Preview and assets

Run `python3 scripts/preview.py`, then open http://localhost:4173. The preview server disables caching. Every local runtime asset URL uses the same `?v=20261112-7` cache version, including font preloads, image variants, worker imports, and the vendored Three.js core import. Update these together when shipping changes.

- `index.html`: semantic content, navigation, immediate SVG-clipped photograph, paper figure, citation, canonical URL, Open Graph, and Twitter Card.
- `packages/css/styles.css`: Bricolage Grotesque headings, Source Serif 4 body, editorial margin columns, responsive navigation, light/dark palettes, and static background fallback.
- `packages/js/main.js`: theme preference, mobile navigation, citation copying, and deferred background loading.
- `packages/js/engram.js`: the single background canvas, worker bridge, theme, pause preference, visibility, and graceful fallback.
- `packages/js/engram-worker.js`: regular perspective memory grid, adjacent-entry pulses, scroll movement, and desktop pointer response.
- `packages/js/vendor/`: pinned Three.js 0.180.0 ES modules and MIT license; only the local core-import URL is versioned.
- `packages/js/portrait-outline.js` and `portrait-network.js`: optional static-contour authoring data, not downloaded by the page.
- `packages/fonts/`: two local WOFF2 families and their OFL licenses. BibTeX uses system monospace.
- `packages/images/`: the original portrait crop, its static contour, two WebP sizes of the paper’s original Figure 1, and a 1200 × 630 PNG social preview.

## Portrait and background

The original clipped photograph and SVG contour are present in HTML. Only the contour settles once over 1.4 seconds; reduced motion disables it. The photograph never waits for JavaScript or particle assembly, and sections never wait for scrolling to become visible.

One fixed Three.js canvas is enhanced after the content loads. Its regular rows, columns, and depth suggest a memory table; occasional red pulses follow two or three adjacent entries. This is a decorative illustration of the paper’s bigram/trigram pathways, not actual learned weights. CSS gradient scrims leave roughly 12–15% background strength beneath reading areas, without measuring individual elements. The right margin, hero, and section gaps expose the grid.

The worker is capped at 20 fps and DPR 1.5, with 1,071 nodes on desktop and 234 on mobile. A visible header button pauses/resumes motion and remembers the choice. Rendering stops in hidden tabs. Reduced motion, unavailable OffscreenCanvas/WebGL, context loss, and module failures retain a static CSS grid. Initial reduced-motion visits do not fetch Three.js. All content and navigation work without JavaScript.

Optional authoring tools:

- `node scripts/generate-neural-fallback.mjs` refreshes the static contour and inline clipping path; it preserves the current asset version. Keep the contour and original photograph aligned when changing the pose.
- `scripts/social-preview.html` is the source for the checked-in PNG. Open it through the preview server, wait for fonts, and capture its 1200 × 630 viewport at DPR 1. Neither authoring action is part of deployment.

## Content changes in this review

Sources and verification decisions are in [CONTENT-SOURCES.md](CONTENT-SOURCES.md). Comments next to claims identify their sources; missing details use `TODO(content)`.

- Hero: “I research language models for Indonesia's regional languages, starting with Batak and Minangkabau.” The primary link is “Read the TOBA-LM paper”; the CV remains secondary.
- Research: the opening explains the data-scarcity problem and attributes the speaker totals to BPS (2011), as quoted by the paper. The approach and training-result paragraphs are preserved. Authors and publication links follow the enlarged paper title, with the original architecture figure below the summary.
- Projects: only Tomato Vision and AUTOPLANDES remain, with concise contribution/leadership descriptions and their evidence links directly below. Tomato Vision has no screenshot.
- Experience: newest first, role and organization together, with short descriptions. The user confirmed the BFI start date as 13 August 2025. Awards contains the KSE scholarship and P2MW funding; Coursera entries and generic Profile links were removed.
- Identity: Kevin Siringo Ringo throughout the portfolio. The printed name Kevin Siringoringo is preserved in the paper author line and BibTeX. Contact retains the original invitation and destinations, with a smaller “Let’s talk”.

To add a section, use `.section`, a concise heading with `aria-labelledby`, and `.editorial-row` containing `.margin-note` plus `.entry-content`. On mobile these form one reading column. Keep claim sources beside the content and in the source log.

## Remaining content TODO

Confirm Kevin’s specific role and responsibilities in **Tomato Vision**. The existing portfolio establishes participation and technologies; no team-lead or sole-developer role is invented. There are no unresolved paper-author, figure, social-preview, or BFI-date TODOs.

## Verification

Screenshots and machine-readable reports are kept locally in the ignored `docs/qa/` directory. Review screenshots cover 1440px and 390px in light/dark themes, with hero, research, projects, experience, and full-page views. Mobile checks include 360, 375, 390, 414, 430, and 768px widths and 844×390 / 915×412 landscape. Visible mobile links/buttons have at least 44 × 44px targets.

Checks cover immediate portrait/no-JS content, reduced motion (including preference changes), missing OffscreenCanvas/WebGL/modules, pause persistence, hidden-tab suspension, DPR cap, keyboard menu/focus, theme persistence, clipboard success/fallback, and publication/identity metadata. Automated axe checks and manual screenshots complement each other; the background is deliberately stronger in empty space and subdued under text.

Local simulated mobile Lighthouse: **Performance 98, Accessibility 100**, FCP **0.9s**, LCP **0.9s**, TBT **150ms**, CLS **0.01**. Local transfer totals are uncompressed and are not compared with GitHub Pages compressed transfer. The before/after transfer audit uses the public site, cold-cache resource discovery, and encoded response body sizes including worker imports and the lazy-loaded figure; headers and TLS overhead are excluded. These measurements are observations, not guarantees for every device.

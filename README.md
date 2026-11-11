# Kevin Siringo-Ringo — personal portfolio

A static portfolio for GitHub Pages: research, projects, experience, and contact. All public content lives in `index.html`. No framework, package installation, or build step is needed to publish.

## Preview

Run `python3 scripts/preview.py`, then open http://localhost:4173. This checkout-local server disables caching. Deployed CSS/module entry URLs also carry an explicit version; keep those versions in sync when replacing assets.

## Structure

- `index.html`: semantic content, citation, navigation, and a static SVG portrait fallback.
- `packages/css/styles.css`: wide editorial layout, readable text columns, local fonts, responsive navigation, and light/dark palettes.
- `packages/js/main.js`: theme preference, mobile navigation, citation copying, deferred visual loading, and one-time section reveals.
- `packages/js/background.js` / `background-worker.js`: slow sine-wave neural background at ten fps, with all reading regions erased from the canvas.
- `packages/js/hero.js`: interaction, visibility, reduced motion, and the bridge to the rendering worker.
- `packages/js/hero-worker.js`: Three.js portrait formation, reconstruction, and contour signal loop. Rendering runs in a worker, capped at approximately 30 fps and DPR 2.
- `packages/js/portrait-outline.js`: the pose contour used by both the photograph clipping geometry and the neural frame.
- `packages/js/portrait-network.js`: shared contour containment, deterministic variation, and coordinated red/rose/mauve colors.
- `packages/js/vendor/`: pinned Three.js 0.180.0 ES modules and MIT license.
- `packages/fonts/`: Bricolage Grotesque and Source Serif 4 WOFF2 files and OFL licenses.
- `packages/images/`: the original portrait crop and its vector neural frame.

## Hero direction

The current design follows the user's latest revisions:

1. A brief, sparse network arrives from across the viewport: 48 signals on small screens, 96 on desktop. It does not intercept input and sits behind readable content.
2. Textured fragments travel into the user's exact pose. Each fragment carries its piece of the original photograph from the beginning.
3. The same fragments enlarge and join into one photographic surface; there is no separate neural silhouette replaced by a fading photograph. A procedural contour mask removes the source background.
4. Three interrupted, moving paths with traveling nodes follow the head, shoulders, and body. A curved network across the lower torso moves with them and continues the body into the background, concealing its cropped bottom. Colors derive from the site's red accent.

The viewport layer is removed after the arrival, or immediately when the visitor scrolls. Only the contour and lower-torso networks continue moving. No stage labels, Replay, or visible playback buttons remain. A separate, very faint sinusoidal network follows the page edges and empty spaces. Its renderer removes text, links, headings, and the portrait area from the drawing; it stops in a hidden tab and becomes static with reduced motion. The portrait itself supports tap/Space to pause or resume both continuous animations and arrow keys to tilt, with screen-reader instructions and visible keyboard focus.

Rendering suspends offscreen or in a hidden tab. Reduced-motion visitors get the static final portrait and frame without downloading Three.js. Missing Worker/OffscreenCanvas/WebGL, module failure, and context loss retain the static fallback. Page content and navigation remain available without JavaScript. The five main sections each appear once on entering the viewport, using a short 380ms transition. Reduced motion, print, and no-JavaScript views show the content directly; anchor navigation and keyboard focus also reveal destinations.

To change the pose, update the contour and source photo together. To change colors, edit `portrait-network.js`; fragment density, contour flow, and the lower-torso shape live in `hero-worker.js`. After editing that geometry, run the optional authoring command `node scripts/generate-neural-fallback.mjs` to refresh the checked-in SVG frame and inline clipping path. This is not a deployment build step.

## Content and extension

Sources and verification decisions are recorded in [CONTENT-SOURCES.md](CONTENT-SOURCES.md). The user's original facts and destinations remain the baseline; later public research was explicitly authorized.

The copy was condensed and reframed:

- The hero introduces Kevin with “My work connects language model research with computer vision and applied AI systems.”
- Research uses the complete publication title and author order, three short paragraphs, contextual figures, prominent paper links, and copyable BibTeX. The training result is attributed to the paper and described in steps, not wall-clock speed.
- Projects connect crop health, workflow automation, and public information to their technical approaches. Tomato Vision keeps its PKM-KC context but its application-listing image is removed at the user’s request. AUTOPLANDES includes the verified team-lead and Innovillage record. Workflow Systems and Pakkat remain concise where concrete outcomes have not been supplied.
- Experience and education follow a chronological narrative: university study, teaching during those studies, Bangkit training, then the current AI Engineering role. Scholarships, funding, and courses appear once in Awards & Certifications.
- Contact invites research collaboration and applied AI opportunities with “tell me what you’re exploring,” retaining the original email and LinkedIn destinations.

Add a section using `.section` / `.section-heading` with a unique heading ID and `aria-labelledby`. `.editorial-row` pairs a `.margin-note` with `.entry-content`; on small screens they become one reading column. Keep facts in their relevant section and technology names in context.

## Remaining content TODOs

Search `TODO(content)` in `index.html`:

- Confirm the BFI-specific employment start date. The existing 2025–Present period describes AI Engineering, rather than verified BFI tenure.
- Supply verified direct credential URLs for the listed courses.
- Add a concrete workflow, intended users, and verified outcome for Workflow Systems.
- Add a concrete example of the public information or service provided by the Pakkat Village website. No missing impact figures or user stories have been invented.

The paper's author list and the meaning of its training-step comparison have been checked against arXiv; they are no longer draft TODOs.

## Verification

Local screenshots and audit artifacts live in the ignored `docs/qa/` directory. The final version is checked at 1440px and 390px with motion in both themes. Responsive content checks also cover 360, 375, 390, 414, 430, and 768px widths, plus 844×390 and 915×412 landscape layouts in both themes. The mobile project metadata remains visible, including the AUTOPLANDES program year. Tests cover assembly from one persistent set of photographic fragments, moving contour nodes and lower-torso geometry, automatic looping, keyboard pause, cleanup of the viewport layer, navigation/focus, clipboard fallback, theme persistence, no JavaScript, reduced motion, missing WebGL/Worker/modules, and context loss.

The original checked-out mobile page measured 6,568px. The broader portfolio requested in later revisions contains more verified content than the first compact redesign; the final narrative version is 4,820px at 390px width, rather than the earlier 2,876px compact prototype. The final desktop height at 1440px is 3,950px. Lighthouse results are local simulated mobile measurements, not a guarantee for every device or host.

Final local Lighthouse mobile: **Performance 94, Accessibility 100**, FCP **0.9s**, LCP **3.0s**, TBT **120ms**, CLS **0**. Automated axe checks found no WCAG A/AA violations at 1440px and 390px in both themes.

# Kevin Siringo-Ringo — personal portfolio

A static portfolio for GitHub Pages: research, projects, experience, and contact. All public content lives in `index.html`. No framework, package installation, or build step is needed to publish.

## Preview

Run `python3 scripts/preview.py`, then open http://localhost:4173. This checkout-local server disables caching. Deployed CSS/module entry URLs also carry an explicit version; keep those versions in sync when replacing assets.

## Structure

- `index.html`: semantic content, citation, navigation, and a static SVG portrait fallback.
- `packages/css/styles.css`: wide editorial layout, readable text columns, local fonts, responsive navigation, and light/dark palettes.
- `packages/js/main.js`: theme preference, mobile navigation, citation copying, deferred background loading.
- `packages/js/background.js` / `background-worker.js`: slow sine-wave neural background at ten fps, with all reading regions erased from the canvas.
- `packages/js/portrait-outline.js`: the pose contour used by both the photograph clipping geometry and the neural frame.
- `packages/js/portrait-network.js`: shared contour containment, deterministic variation, and coordinated red/rose/mauve colors.
- `packages/js/vendor/`: pinned Three.js 0.180.0 ES modules and MIT license.
- `packages/fonts/`: Bricolage Grotesque and Source Serif 4 WOFF2 files and OFL licenses.
- `packages/images/`: the original portrait crop and its vector neural frame.

## Portrait

The original clipped photograph and its SVG contour render directly from HTML. Only the contour settles once over 1.4 seconds using CSS; the photograph is never hidden or assembled from particles. Reduced motion disables that animation. Sections are always visible, without scroll reveals.

The optional authoring command `node scripts/generate-neural-fallback.mjs` refreshes the checked-in contour asset and inline clipping path. This is not a deployment build step. Keep the contour and source photograph aligned when changing the pose.

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

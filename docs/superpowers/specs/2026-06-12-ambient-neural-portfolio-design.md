# Ambient Neural Portfolio Design Spec

Date: 2026-06-12

## Goal

Redesign Kevin Siringo-Ringo's portfolio into a more cinematic, futuristic, and premium static website while keeping it readable for recruiters and technical reviewers.

The new direction is an **Ambient Neural Portfolio**: a dark, fluid, high-tech interface with a decorative neural animation layer, sparse hero text, and concise portfolio content.

## Approved Direction

Use the **Recruiter-Safe Immersive Lab** direction with these refinements:

- The hero should not feel text-heavy.
- The hero must not include "AI ENGINEER @ BFI TECH".
- The hero focus label should be exactly: `LLM RESEARCH`.
- The Three.js visual layer is decorative only.
- The animation must not reveal project information, control navigation, or add extra information panels.
- Remove the earlier "Engram event" concept entirely.

## Audience

Primary audience:

- Recruiters and hiring teams who need to understand Kevin's profile quickly.

Secondary audience:

- Technical reviewers who want evidence of LLM research, AI engineering, and software work.

The visual style can be ambitious, but the site must still communicate the essentials within the first few seconds.

## Visual Direction

The site should feel like a premium AI research portfolio rather than a conventional resume page.

Core visual language:

- Dark cinematic base.
- Fluid neural canvas background.
- Holographic color accents: deep blue, cyan, purple, green, pink, and subtle gold.
- Central glowing neural structure or particle field.
- Glassmorphism panels with blur, translucency, fine borders, and soft glow.
- Compact, high-contrast typography.
- Minimal hero copy.

Avoid:

- Long blocks of text in the hero.
- Company label in the hero.
- Decorative terminal panels that explain the animation.
- Animation-driven project reveals.
- Scroll hijacking.
- Navigation that becomes hard to understand.
- Visual effects that make text unreadable.

## Hero Design

The hero is the main visual transformation.

Required hero content:

- Name: `Kevin Siringo-Ringo`
- Focus label: `LLM RESEARCH`
- Short supporting line: one concise sentence about AI research, language models, and intelligent systems.
- Two primary actions:
  - View Work
  - Contact

The existing detailed AI Engineer positioning can move below the hero into concise evidence or profile sections. The first viewport should feel spacious and visual, not like a dense resume.

## Animation Design

Use Three.js via CDN as a progressive enhancement for the hero visual layer.

Animation role:

- Decorative ambient atmosphere only.
- Supports the premium AI/LLM research mood.
- Does not expose hidden project content.
- Does not replace standard navigation.

Preferred effects:

- Fluid particle field or neural canvas.
- Glowing central node structure.
- Slow cursor-reactive movement.
- Subtle particle drift.
- Optional click pulse or particle ripple that is visual only.

Constraints:

- Use a pinned Three.js CDN version.
- Keep the core page static and readable if Three.js fails to load.
- Respect `prefers-reduced-motion: reduce`.
- Reduce particle count on mobile.
- Avoid heavy post-processing.
- Do not block page rendering while the animation loads.

## Information Architecture

Keep the portfolio as a single static page with anchored sections.

Recommended order:

1. Hero
2. Evidence Snapshot
3. Research
4. Projects
5. Skills
6. Journey
7. Certifications
8. Contact

The content below the hero should become more concise than the current page. Use short cards, tags, and compact summaries instead of long paragraphs.

## Section Treatment

### Evidence Snapshot

Purpose: quick credibility.

Use compact glass panels with short labels and minimal descriptions. Keep proof points scannable.

### Research

Purpose: show the strongest LLM/research signal.

Feature TOBA-LM and related LLM research in a concise block. Avoid turning the section into a paper summary. Use metrics and links where useful.

### Projects

Purpose: show applied work without overwhelming the page.

Use fewer words per project card. Emphasize project title, domain, and technology tags.

### Skills

Purpose: make technical fit easy to scan.

Use grouped tags, with LLM and AI research skills first. Keep the visual style consistent with the glass system.

### Journey

Purpose: provide career and education context.

Keep timeline entries concise.

### Certifications

Purpose: supporting credibility.

Use compact cards only. Do not let this section dominate the page.

### Contact

Purpose: clear recruiter actions.

Use direct links for CV, LinkedIn, and email.

## Technical Design

Maintain the existing static architecture:

- `index.html` for semantic content.
- `packages/css/styles.css` for the visual system, responsive layout, glass styling, and fallback backgrounds.
- `packages/js/main.js` for navigation, theme handling if retained, scroll reveal, and Three.js initialization.

Add no build step. The site must remain deployable on GitHub Pages by serving static files.

Three.js should be loaded as an ES module from a pinned CDN URL. The animation code should be isolated so the rest of the page works if the import fails.

## Fallback Design

The page must have a CSS-only fallback that still looks intentional:

- Dark neural gradient background.
- Static glowing central shape or CSS pseudo-element.
- Same hero text and actions.
- No broken empty canvas area.

If WebGL is unsupported, the user should still see a complete portfolio.

## Accessibility And UX

Requirements:

- Keep semantic headings and sections.
- Preserve skip link and keyboard-friendly navigation.
- Maintain visible focus states.
- Ensure CTA buttons are at least 44px high.
- Keep text contrast readable over the dark visual background.
- Avoid hover-only access to important information.
- Respect reduced motion.
- Prevent horizontal scrolling on mobile.

## Responsive Design

Desktop:

- Hero can use a split composition: minimal text on the left, decorative neural structure on the right or center-right.
- Glass panels may float lightly, but should not obscure primary text.

Tablet:

- Reduce visual density and particle count.
- Keep hero copy readable and centered or stacked.

Mobile:

- Prioritize name, `LLM RESEARCH`, one supporting line, and actions.
- Use a simpler neural background.
- Hide or simplify any decorative 3D structure if it competes with readability or performance.

## Success Criteria

The redesign is successful if:

- The first viewport feels significantly more futuristic and premium than the current portfolio.
- The hero has much less text than the current page.
- The hero uses `LLM RESEARCH` and does not mention `AI ENGINEER @ BFI TECH`.
- The animation is clearly decorative, not an information reveal mechanism.
- The site remains static and GitHub Pages compatible.
- The portfolio remains readable and usable without Three.js.
- Mobile layout does not overflow or bury the main actions.

## Out Of Scope

- Migrating to React, Next.js, or another framework.
- Adding backend features.
- Adding a CMS.
- Making the animation explain projects.
- Building scroll-jacked camera journeys.
- Adding hidden terminal easter eggs.
- Publishing or deploying changes.

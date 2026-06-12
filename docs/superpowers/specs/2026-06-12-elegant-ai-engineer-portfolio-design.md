# Elegant AI Engineer Portfolio Design Spec

Date: 2026-06-12

## Goal

Refactor the portfolio so it clearly feels like Kevin Siringo-Ringo's personal portfolio, not a generic abstract AI website.

The approved direction is an **Elegant AI Engineer Portfolio** inspired by the uploaded graphic designer portfolio reference, adapted for Kevin's AI engineering and LLM research positioning.

## Core Direction

Use the reference for layout and energy, but adapt the content and tone:

- Main hero headline: `AI ENGINEER`
- Personal identity must be obvious in the first viewport.
- Use Kevin's face or a clean portrait silhouette as a central visual.
- Keep the right-side person placement from the reference.
- Use a strong blue visual system with yellow-lime accents.
- Reduce purple strongly.
- Avoid heavy sci-fi, nature-like, random particle, or generic abstract backgrounds.
- Keep tech details subtle and supportive, not dominant.
- Use a bold condensed display font for the hero headline.
- Use clean readable sans-serif text for body content.

## Why This Replaces The Previous Direction

The ambient neural version looked premium but did not communicate "personal portfolio" strongly enough. It felt too much like a random abstract website.

This new design should make the viewer immediately understand:

- This is Kevin's portfolio.
- Kevin is an AI Engineer.
- The page is professional, personal, and elegant.
- AI/LLM work is important, but the human identity leads the design.

## Audience

Primary audience:

- Recruiters and hiring teams evaluating Kevin for AI engineering, LLM, automation, and data-related roles.

Secondary audience:

- Technical reviewers who want proof of research and project capability.

The first viewport should be attractive and memorable, but still easy to understand in a few seconds.

## Visual Language

Primary style:

- Elegant personal portfolio.
- Bold role-driven hero.
- Blue editorial background.
- Yellow-lime accent strokes and timeline markers.
- Glassmorphism cards used as information containers.
- Portrait or silhouette as the strongest non-text element.

Color direction:

- Dominant: vivid royal/portfolio blue.
- Secondary: deeper blue and navy for depth.
- Accent: yellow-lime for active states, underline strokes, CTA, and timeline dots.
- Neutral: white and soft blue-gray for text.
- Avoid: purple-dominant gradients, excessive neon, many unrelated colors.

Typography direction:

- Hero headline should use a condensed, heavy display style similar to the reference.
- Body and cards should use readable sans-serif typography.
- Keep all text high-contrast and scan-friendly.

## Hero Design

The hero is the highest-priority section.

Required content:

- Small greeting: `Hello, I'm Kevin`
- Main headline: `AI ENGINEER`
- Supporting sentence: concise, about LLM research, automation systems, and applied AI engineering.
- Primary CTA: `View My Work`
- Secondary CTA: `Contact`
- Personal visual: Kevin's photo or a silhouette treatment based on the profile image.

Hero layout:

- Left side: greeting, huge `AI ENGINEER` headline, short supporting sentence, actions.
- Right side: portrait/silhouette, with light circular or curved visual accents.
- Top nav: portfolio identity, section links, and a work/contact CTA.
- Below hero: a wide glass summary card similar to the reference.

Do not include:

- `AI ENGINEER @ BFI TECH` in the hero.
- `LLM RESEARCH` as the main hero label.
- Abstract neural canvas as the main visual.
- Project reveal interactions.
- Decorative terminal panels.
- Dense text blocks.

## Portrait And Silhouette Treatment

Use `packages/images/profile.jpeg` as the starting asset.

Preferred implementation:

- Use the real portrait if it works visually with the new layout.
- If the raw photo feels too literal or does not blend well, use CSS treatment to create an elegant silhouette-style portrait.
- The person visual should remain recognizable as the portfolio owner, not a generic avatar.

The portrait may use:

- Masked cutout or rounded organic frame.
- Blue shadow or glow.
- Thin circular line accents.
- Subtle yellow-lime highlights.

Avoid:

- Over-filtering until the person is unrecognizable.
- Heavy AI/neural overlays on the face.
- Busy particle fields around the portrait.

## Summary Card

Add a glass summary card under the hero, inspired by the reference.

Suggested columns:

1. Who Am I?
   - Kevin Siringo-Ringo
   - AI Engineer focused on LLM research, automation, and applied AI systems.

2. Experience
   - Use a compact yellow-line timeline.
   - Include current AI engineering work and TOBA-LM research.

3. Specialties
   - LLM Research
   - Automation
   - Data Engineering
   - Computer Vision

The card should be informative but not text-heavy.

## Sections Below Hero

Keep the one-page structure, but refactor the style to match the hero.

Recommended order:

1. Hero
2. Summary Card
3. Research
4. Work / Projects
5. Experience and Education
6. Skills
7. Certifications / Recognition
8. Contact

## Experience And Education

Use the reference's vertical timeline pattern:

- Yellow-lime line.
- Circular yellow-lime dots.
- Compact year range.
- Short role or education title.
- One supporting line max.

This treatment should appear in both:

- Hero summary card.
- Main Experience / Education section.

## Research And Projects

Research should still highlight TOBA-LM, but the design should not feel like a paper page.

Use concise cards:

- Title.
- One-sentence description.
- Key tags.
- Optional metrics or links.

Projects should use image cards where available:

- Tomato Vision
- Workflow systems / automation
- Pakkat Village or other early web project if still useful

Keep project copy short.

## Technical Design

Maintain the static GitHub Pages architecture:

- `index.html`
- `packages/css/styles.css`
- `packages/js/main.js`

No build step.

Three.js is no longer required for the main direction. It may be removed unless a very subtle decorative layer is still needed. If retained, it must not dominate the design.

Prefer CSS and existing assets over heavy runtime effects.

## Accessibility And UX

Requirements:

- Keep semantic headings and sections.
- Preserve keyboard navigation and visible focus states.
- Keep text readable against blue backgrounds.
- CTA buttons must be at least 44px high.
- Avoid hover-only information.
- Keep mobile layout clean and readable.
- Prevent horizontal overflow.
- Respect reduced motion if animations are used.

## Responsive Design

Desktop:

- Large `AI ENGINEER` headline on left.
- Portrait/silhouette on right.
- Summary card spans under the hero.

Tablet:

- Keep split hero if there is enough space.
- Reduce headline size.
- Keep portrait visible but less dominant.

Mobile:

- Stack content.
- Show identity and `AI ENGINEER` clearly.
- Portrait can appear above or behind the headline if it does not reduce readability.
- Summary card becomes stacked sections.

## Success Criteria

The redesign is successful if:

- It immediately reads as Kevin's personal portfolio.
- `AI ENGINEER` is the dominant first-viewport message.
- The portrait or silhouette is a major visual element.
- The color system is mostly blue with yellow-lime accents.
- Purple is minimal or absent.
- The layout feels inspired by the provided reference without copying it exactly.
- Experience and education use yellow-line timeline styling.
- The page remains static, fast, and GitHub Pages compatible.

## Out Of Scope

- Copying the uploaded reference exactly.
- Creating a graphic designer-themed page.
- Adding backend features.
- Adding a CMS.
- Building heavy 3D or particle animation.
- Making the design primarily about abstract AI visuals.
- Publishing or deploying changes.

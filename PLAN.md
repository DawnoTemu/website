# Task & Context
Prepare a dedicated “Punkty Magii” pricing page that mirrors the site’s existing look while unifying header/footer structures across current pages and incorporating a newly generated illustration via the in-repo image script.

## Current State (codebase scan)
- Site served as static HTML; most pages duplicate a Tailwind-styled header/footer, but `polityka-prywatnosci.html` and `doc.html` diverge.
- `scripts/main.js` manages mobile navigation, consent logic, and nav highlighting (paths stop at `/casting`).
- Shared styling lives in `styles/styles.css`; assets (logos, hero art) sit under `images/`.
- `generate_images.py` provides an OpenAI-powered workflow for producing on-brand imagery.
- `sitemap.xml` lacks any entry for a pricing/credits route.

## Proposed Changes (files & functions)
- Add `punkty-magii.html` with canonical head imports, standardized header/footer, and sections covering purpose, pricing rule, usage scenarios, fairness, upcoming features, and calls to action per the brief.
- Normalize desktop/mobile navigation and footer markup across key HTML pages (`index.html`, `o-nas.html`, `biblioteka.html`, `badania.html`, `kontakt.html`, `podziekowanie.html`, `casting.html`, `polityka-prywatnosci.html`, `doc.html`, `ga4-test-tool.html`), ensuring shared classes/IDs for JS hooks.
- Extend `scripts/main.js` navigation mapping for the new `/punkty-magii` route and adjust logic if needed to support a consistent CTA/button pattern.
- Add any minimal CSS helpers in `styles/styles.css` for new components (e.g., credit cards, timeline badges) while respecting existing design tokens.
- Generate and include a hero/illustration image (e.g., `images/punkty-magii-hero.png`) using `generate_images.py`; reference it within the new page.
- Update `sitemap.xml` and shared footer link lists to surface the pricing page; adjust internal links/anchors that reference nav items.

## Step-by-Step Plan
1. Inventory header/footer variants to design a canonical markup pattern (desktop nav links, mobile menu, CTA) that satisfies all pages’ needs; note per-page CTA text/href requirements.
2. Draft `punkty-magii.html` scaffold with the shared `<head>` assets, standardized header/footer, and structured content covering the brief’s talking points (hero tagline, how points work, example math, usage, fairness rules, upcoming features, FAQ/CTA).
3. Run `generate_images.py` with a tailored Polish/English prompt to create the hero illustration; save to `images/punkty-magii-hero.png` and integrate into the hero or feature block.
4. Propagate the unified header/footer markup to the targeted HTML files, updating nav links (including the new `Punkty Magii` item) and preserving page-specific CTAs/anchors.
5. Adjust `scripts/main.js` to recognize `/punkty-magii` in `highlightCurrentPage`, confirm mobile menu toggle compatibility, and tweak CTA behavior if shared markup now expects consistent IDs.
6. Refresh `sitemap.xml` (and any footer quick links) to include the new page; double-check canonical/alternate URLs as needed.
7. Validate locally by serving the site (e.g., `node local-testing-server.js`), spot-checking desktop/mobile nav, verifying the new image loads, and rerunning `node test-ga4-functionality.js` if consent code touched.

## Risks & Assumptions
- Image generation requires a valid `OPENAI_API_KEY`; lacking credentials blocks asset creation.
- Copy must be in polished Polish to match the rest of the site; assume we craft localized text from the English brief.
- Standardizing the header may need CTA flexibility (e.g., `badania.html` uses “Weź udział”); assume we can keep unique labels/hrefs while sharing structure.
- Fixed header height changes might necessitate adjusting top padding/margins on pages with tight hero spacing.

## Validation & Done Criteria
- `punkty-magii.html` renders with on-brand styling, includes the generated illustration, and clearly communicates all brief sections.
- All updated pages share the same header/footer structure, with active nav highlighting and mobile menu behavior working on each route.
- New route appears in `sitemap.xml` and footer/CTA links; no broken anchors or missing assets in the browser console.
- GA4 consent automation (`node test-ga4-functionality.js`) passes if navigation script changes impact the modal logic.

## Open Questions
- Preferred Polish tagline/CTA choice from the provided options, or should multiple taglines appear on the page?
- Should the global nav include the `Badania` link everywhere, or remain limited to specific pages?

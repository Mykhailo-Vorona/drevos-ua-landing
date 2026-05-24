# Model Choice Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third landing-page block that helps the visitor choose a Drevos smokehouse by use case and shows each scenario as a product-style showcase.

**Architecture:** Extend the existing static landing preview with one new HTML section and a dedicated CSS block. Reuse the current dark visual language, but add layered product compositions for each card so the block feels like a showroom rather than plain text.

**Tech Stack:** Static HTML, CSS, existing local image assets

---

### Task 1: Import the landing preview into the project workspace

**Files:**
- Create: `landing-preview/index.html`
- Create: `landing-preview/styles.css`
- Create: `landing-preview/script.js`
- Create: `landing-preview/images/*`

- [ ] Copy the current preview files from the source folder in Downloads into `landing-preview/`.
- [ ] Copy the six model images into `landing-preview/images/models/`.

### Task 2: Add the new section markup

**Files:**
- Modify: `landing-preview/index.html`

- [ ] Insert a new `section` after `Що можна приготувати`.
- [ ] Add three choice cards with scenario text, CTA buttons, and separate showcase wrappers for layered model images.

### Task 3: Style the model-choice block

**Files:**
- Modify: `landing-preview/styles.css`

- [ ] Add layout styles for the new section heading, three-card grid, and each card body.
- [ ] Add layered showcase styling with glow, shelf shadow, image overlap, and responsive behavior.
- [ ] Add per-card image sizing and positioning so the compositions follow the user-approved model mapping.

### Task 4: Verify the visual result

**Files:**
- Modify: `plan.md` (optional later project sync only)

- [ ] Start a local static server for `landing-preview/`.
- [ ] Open the page in an automated browser and capture a screenshot of the new section.
- [ ] Adjust CSS if the compositions overlap poorly on desktop or mobile.

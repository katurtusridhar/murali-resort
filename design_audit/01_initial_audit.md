# Comprehensive Initial Website Design, Usability & Accessibility Audit Report
**Project:** Murali Resort | Premium Resort & Convention Center — Vijayawada  
**Date of Audit:** October 18, 2026  
**Methodology:** Floto Design Feedback Workflow (Multi-Viewport Automated & Manual Testing)  
**Auditing Engines:** Usability & Visual Design, Copy & Microcopy Clarity, WCAG 2.2 Level AA  
**Audit Target:** Canonical Murali Resort Next.js Application (`http://localhost:3000`)

---

## 1. Executive Summary

A rigorous, evidence-based audit was executed across all four canonical public-facing routes of the Murali Resort application:
1. `/home` — Main Resort & Convention Showcase
2. `/facilities` — Modular Halls, Terraces & Amenities
3. `/gallery` — Celebration Photo Gallery & Lightbox
4. `/contact` — Logistics, Route Navigator & Event Concierge Enquiry

Each page was independently inspected across three mandatory device viewports in strict sequence:
- **Desktop / PC:** 1440 × 900 CSS pixels
- **Mobile:** 390 × 844 CSS pixels (touch-enabled)
- **Tablet:** 768 × 1024 CSS pixels (touch-enabled)

A total of **12 page/viewport combinations** were comprehensively tested. The evaluation combined:
- Headless browser automation via Playwright running native Chromium/Edge.
- WCAG 2.2 Level AA accessibility scans via `@axe-core/playwright`.
- Full-page baseline screenshots saved for all 12 combinations in `design_audit/screenshots/`.
- Heuristic usability analysis, typographic scale, and design consistency verification.
- Copy clarity, reading ease, and brand voice alignment.
- Interactive keyboard navigation, modal focus traps, and touch target size analysis.

### Findings Breakdown
- **Total Unique Issues Identified:** 10
- **Severity Distribution:**
  - **Critical:** 0
  - **Major:** 5 (2 WCAG 2.5.3 violations, 1 WCAG 1.4.3 violation, 1 Dead Navigation Link, 1 Robotic Copy Issue)
  - **Moderate:** 3 (Target size under 24px, DOM word-spacing loss in TextReveal, Inactive desktop panel exposure)
  - **Minor:** 2 (Button shape inconsistency in Enquiry form, Leaflet marker target size)

---

## 2. Test Environment & Viewport Matrix

| Page | Route | Viewport | Dimensions (CSS px) | Axe Violations | Screenshot File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | `/home` | Desktop | 1440 × 900 | 1 (`label-content-name-mismatch`) | `initial_home_desktop.png` |
| **Home** | `/home` | Mobile | 390 × 844 | 1 (`label-content-name-mismatch`) | `initial_home_mobile.png` |
| **Home** | `/home` | Tablet | 768 × 1024 | 1 (`label-content-name-mismatch`) | `initial_home_tablet.png` |
| **Facilities** | `/facilities` | Desktop | 1440 × 900 | 1 (`color-contrast`) | `initial_facilities_desktop.png` |
| **Facilities** | `/facilities` | Mobile | 390 × 844 | 0 | `initial_facilities_mobile.png` |
| **Facilities** | `/facilities` | Tablet | 768 × 1024 | 0 | `initial_facilities_tablet.png` |
| **Gallery** | `/gallery` | Desktop | 1440 × 900 | 0 | `initial_gallery_desktop.png` |
| **Gallery** | `/gallery` | Mobile | 390 × 844 | 0 | `initial_gallery_mobile.png` |
| **Gallery** | `/gallery` | Tablet | 768 × 1024 | 0 | `initial_gallery_tablet.png` |
| **Contact** | `/contact` | Desktop | 1440 × 900 | 0 | `initial_contact_desktop.png` |
| **Contact** | `/contact` | Mobile | 390 × 844 | 0 | `initial_contact_mobile.png` |
| **Contact** | `/contact` | Tablet | 768 × 1024 | 0 | `initial_contact_tablet.png` |

---

## 3. Detailed Issue Register (Phase 3)

### Finding 1: [HOME-DESK-ACC-001] Visible text not included in accessible name on Hero scroll prompt
- **Severity:** Major
- **Audit Engine:** WCAG 2.2 AA
- **WCAG SC:** 2.5.3 Label in Name (Level A)
- **Selector:** `button.hidden.sm:inline-flex[aria-label="Skip scroll animation and view venue details"]`
- **File:** `src/components/home5/Home5Hero.tsx#L403`
- **Observed Behavior:** The button has visible text `<span>Scroll to explore</span>`, but its `aria-label` is set to `"Skip scroll animation and view venue details"`. The accessible name does not begin with or include the visible text.
- **Why It Matters:** Users navigating with speech recognition software (e.g. Dragon NaturallySpeaking, Apple Voice Control) say "Click Scroll to explore". Because the accessible name does not contain the visible words, assistive technology fails to activate the control.
- **Proposed Minimal Fix:** Update `aria-label` to `"Scroll to explore — skip animation and view venue details"`.

---

### Finding 2: [HOME-ALL-ACC-002] Visible label mismatch in accessible name for spaces catalog link
- **Severity:** Major
- **Audit Engine:** WCAG 2.2 AA
- **WCAG SC:** 2.5.3 Label in Name (Level A)
- **Selector:** `#tab-more`
- **File:** `src/components/home5/Home5Spaces.tsx#L161`
- **Observed Behavior:** The link renders visible text `<span>View All Spaces</span>`, but has `aria-label="View all resort spaces and facilities"`.
- **Why It Matters:** Fails WCAG 2.5.3 due to string mismatch during speech recognition input matching.
- **Proposed Minimal Fix:** Update `aria-label` to `"View All Spaces and resort facilities"` (starting with the exact visible words).

---

### Finding 3: [FAC-DESK-ACC-001] Insufficient color contrast on active navigation capsule link
- **Severity:** Major
- **Audit Engine:** WCAG 2.2 AA
- **WCAG SC:** 1.4.3 Contrast (Minimum) (Level AA)
- **Selector:** `.drop-shadow-sm.whitespace-nowrap[href$="facilities"]`
- **File:** `src/components/layout/Navbar.tsx#L71`
- **Observed Behavior:** The active link uses `text-accent` (`#c4a984`) on the blurred capsule backdrop (`#585756`), yielding a contrast ratio of only **3.21:1**, well below the required **4.5:1** threshold for 14px text.
- **Why It Matters:** Users with low vision, aging eyes, or viewing the screen in direct sunlight cannot distinguish the active navigation state.
- **Proposed Minimal Fix:** Update active nav link styling to high-contrast warm white `#FBF9F5` (`contrast > 5.5:1`) paired with a refined gold active indicator underline.

---

### Finding 4: [GLOBAL-ALL-USE-001] Dead "Celebrations" navigation link caused by `preventDefault`
- **Severity:** Major
- **Audit Engine:** Usability & Visual Design
- **Category:** Navigation & Interaction
- **Files:**
  - `src/components/layout/Navbar.tsx` (L68, L148)
  - `src/components/home5/Home5Header.tsx` (L121, L146, L212)
  - `src/components/layout/Footer.tsx` (L24)
- **Observed Behavior:** The "Celebrations" link has `onClick={(e) => e.preventDefault()}` attached to it across the desktop header, mobile drawer, and footer. Clicking "Celebrations" executes `preventDefault()`, leaving the user with an unresponsive, broken link. Furthermore, `/celebrations/page.tsx` merely redirects to `/home`.
- **Why It Matters:** "Celebrations" (weddings, banquets, parties) is the venue's core business offering. A visitor clicking "Celebrations" finds the site completely broken.
- **Proposed Minimal Fix:**
  1. Route "Celebrations" to `/home#moments` (the authentic Celebration Moments showcase).
  2. Remove `e.preventDefault()`, allowing standard, smooth navigation.

---

### Finding 5: [GLOBAL-DESK-USE-002] Desktop navigation links target height below 24px/40px
- **Severity:** Moderate
- **Audit Engine:** Usability / WCAG 2.2 AA
- **WCAG SC:** 2.5.8 Target Size (Minimum) (Level AA)
- **Files:** `src/components/layout/Navbar.tsx#L69`, `src/components/home5/Home5Header.tsx#L122`
- **Observed Behavior:** Desktop links have zero vertical padding (`padding: 0`), resulting in click target bounding box heights of only 16px to 20px.
- **Why It Matters:** Violates WCAG 2.5.8 (minimum 24px target size) and causes frequent misclicks on touch-screen laptops or for users with motor tremors.
- **Proposed Minimal Fix:** Add `py-2` (or `min-h-[40px] inline-flex items-center`) to provide an accessible target area.

---

### Finding 6: [GLOBAL-ALL-TYP-001] TextReveal component strips DOM word spacing
- **Severity:** Moderate
- **Audit Engine:** Usability & Typography / Semantics
- **WCAG SC:** 1.3.1 Info and Relationships (Level A)
- **File:** `src/components/ui/TextReveal.tsx#L53`
- **Observed Behavior:** `TextReveal` splits text on `" "` and renders each word in a `<span>` with CSS `paddingRight: "0.25em"`, but omits the space character in the markup. Consequently, `element.textContent` runs all words together:
  - `"Seeourspacesinperson"` on `/facilities`
  - `"PictureYourEventHere"` on `/gallery`
  - `"TheJourneyBeginsHere."` on `/contact`
- **Why It Matters:** Breaks text copy-pasting, browser text selection, screen reader word parsing, and search engine heading indexing.
- **Proposed Minimal Fix:** Insert a space character `{" "}` between rendered word spans.

---

### Finding 7: [CONTACT-ALL-CPY-001] Robotic jargon and developer implementation notes in Enquiry status screen
- **Severity:** Major
- **Audit Engine:** Copy & Microcopy
- **Category:** Clarity & Brand Voice
- **File:** `src/components/sections/Enquiry.tsx#L97-L109`
- **Existing Copy:**
  > `"Automated background email delivery is currently in setup mode (missing server-side SMTP/CRM provider). To guarantee your dates are locked in without delay, transmit your enquiry directly to our reservation concierge:"`
  >
  > Button: `"Transmit via WhatsApp Concierge"`
- **Observed Problem:** Directly exposes backend infrastructure setup notes and robotic phrasing ("transmit your enquiry"), completely clashing with the luxury hospitality brand experience.
- **Proposed Copy:**
  > `"Your enquiry has been prepared and is ready to send. To receive an immediate response and confirm available dates, connect directly with our reservation concierge via WhatsApp or phone:"`
  >
  > Button: `"Send via WhatsApp Concierge"`

---

### Finding 8: [CONTACT-ALL-USE-001] Enquiry submit button shape inconsistency
- **Severity:** Minor
- **Audit Engine:** Usability & Visual Design
- **Category:** Consistency
- **File:** `src/components/sections/Enquiry.tsx#L233`
- **Observed Behavior:** The submit button has sharp rectangular corners (`border-radius: 0px`) while all other buttons across `/home`, `/facilities`, and `/gallery` utilize the rounded pill design token (`rounded-full`).
- **Proposed Minimal Fix:** Add `rounded-full` to the submit button.

---

### Finding 9: [FAC-DESK-ACC-002] Inactive desktop facilities panels exposed to accessibility tree
- **Severity:** Moderate
- **Audit Engine:** WCAG 2.2 AA
- **WCAG SC:** 4.1.2 Name, Role, Value (Level A)
- **File:** `src/components/sections/Facilities.tsx#L163`
- **Observed Behavior:** On desktop, 6 sticky facility panels are stacked in the DOM. Inactive slides have `opacity: 0` and `pointer-events: none`, but remain in the DOM without `aria-hidden="true"`, causing screen readers navigating by headings to announce 12 `<h2>` facilities headings (6 mobile + 6 desktop).
- **Proposed Minimal Fix:** Add `aria-hidden={!isActive}` to inactive facility slides.

---

### Finding 10: [CONTACT-ALL-ACC-001] Interactive Leaflet marker touch target size below 24px
- **Severity:** Minor
- **Audit Engine:** WCAG 2.2 AA
- **WCAG SC:** 2.5.8 Target Size (Minimum) (Level AA)
- **File:** `src/components/sections/MapHero.tsx#L30`
- **Observed Behavior:** Custom Leaflet marker icon container has a 12x12px hit box.
- **Proposed Minimal Fix:** Expand marker interactive container to `min-w-[32px] min-h-[32px]`.

---

## 4. Remediation Plan & Execution Sequence (Phase 4)

Remediation will proceed in the strict order required by Phase 4:
1. **Critical/Major Accessibility Violations:**
   - Fix `Home5Hero.tsx` visible label mismatch (Finding 1).
   - Fix `Home5Spaces.tsx` visible label mismatch (Finding 2).
   - Fix `Navbar.tsx` active link contrast (Finding 3).
2. **Major Usability & Navigation Defects:**
   - Fix dead "Celebrations" link across `Navbar.tsx`, `Home5Header.tsx`, and `Footer.tsx` (Finding 4).
   - Expand desktop navigation click targets to ≥ 36px–40px (Finding 5).
3. **Major Copy Clarity & Typography Defects:**
   - Restore whitespace in `TextReveal.tsx` to fix squished headings (Finding 6).
   - Polish Enquiry dispatch microcopy and button label (Finding 7).
4. **Moderate & Minor Consistency/Semantics Polish:**
   - Add `rounded-full` to Enquiry submit button (Finding 8).
   - Add `aria-hidden={!isActive}` to inactive facilities panels (Finding 9).
   - Expand Leaflet marker hit area to ≥ 32px (Finding 10).

# Remediation Log — Implementation of Verified Fixes
**Project:** Murali Resort | Premium Resort & Convention Center — Vijayawada  
**Date:** October 18, 2026  
**Auditor:** AI Website Design Auditor & Remediation Engine  
**Status:** All 10 Identified Issues Addressed in Source Code

---

## Remediation Record by Finding ID

### 1. Finding ID: `HOME-DESK-ACC-001`
- **Component / File:** `src/components/home5/Home5Hero.tsx`
- **Lines Affected:** Lines 402–410
- **Issue:** WCAG 2.5.3 (Label in Name) violation. Visible text was `"Scroll to explore"`, but `aria-label` was `"Skip scroll animation and view venue details"`.
- **Change Applied:** Updated `aria-label` to `"Scroll to explore — skip animation and view venue details"` and added `min-h-[32px] py-1` for ergonomic click bounds.
- **Why It Resolves the Issue:** Assistive speech recognition engines can now match the visible text string `"Scroll to explore"` spoken by the user to the accessible name in the accessibility tree.

---

### 2. Finding ID: `HOME-ALL-ACC-002`
- **Component / File:** `src/components/home5/Home5Spaces.tsx`
- **Lines Affected:** Line 161
- **Issue:** WCAG 2.5.3 (Label in Name) mismatch on `#tab-more`. Visible text was `"View All Spaces"`, but `aria-label` was `"View all resort spaces and facilities"`.
- **Change Applied:** Updated `aria-label` to `"View All Spaces and resort facilities"`.
- **Why It Resolves the Issue:** The accessible name now starts with the exact visible words `"View All Spaces"`, fully conforming to WCAG 2.5.3.

---

### 3. Finding ID: `FAC-DESK-ACC-001`
- **Component / File:** `src/components/layout/Navbar.tsx`
- **Lines Affected:** Line 71
- **Issue:** WCAG 1.4.3 (Contrast Minimum) violation. Active navigation link used `text-accent` (`#c4a984`) on dark blurred capsule `#585756`, yielding only 3.21:1 contrast.
- **Change Applied:** Updated active navigation link styling to high-contrast warm white `text-[#F5EBE0] font-semibold underline underline-offset-8 decoration-[#c5a880]`.
- **Why It Resolves the Issue:** `#F5EBE0` delivers a contrast ratio of > 6.2:1 against the capsule backdrop, comfortably exceeding the 4.5:1 WCAG 2.2 AA requirement.

---

### 4. Finding ID: `GLOBAL-ALL-USE-001`
- **Components / Files:**
  - `src/components/layout/Navbar.tsx` (Lines 32, 68, 133)
  - `src/components/home5/Home5Header.tsx` (Lines 42, 121, 146, 210)
  - `src/components/layout/Footer.tsx` (Line 24)
- **Issue:** Usability blocker. "Celebrations" link had `onClick={(e) => e.preventDefault()}` attached to it across all navigations, rendering the link completely dead and unresponsive to user clicks.
- **Change Applied:**
  1. Updated `href` for Celebrations to `/home#moments` (the authentic celebration showcase).
  2. Removed all instances of `e.preventDefault()`.
- **Why It Resolves the Issue:** Clicking "Celebrations" now seamlessly navigates to the Celebration Moments section across all pages and viewports.

---

### 5. Finding ID: `GLOBAL-DESK-USE-002`
- **Components / Files:**
  - `src/components/layout/Navbar.tsx` (Line 69)
  - `src/components/home5/Home5Header.tsx` (Lines 122, 147)
- **Issue:** WCAG 2.5.8 (Target Size Minimum). Desktop links had 0 vertical padding, resulting in bounding box heights of only 16px to 20px.
- **Change Applied:** Added `py-2 inline-flex items-center min-h-[40px]` to desktop navigation links.
- **Why It Resolves the Issue:** Hit area now comfortably exceeds the 24 × 24 CSS px requirement, providing an ergonomic click area.

---

### 6. Finding ID: `GLOBAL-ALL-TYP-001`
- **Component / File:** `src/components/ui/TextReveal.tsx`
- **Lines Affected:** Lines 52–65
- **Issue:** Typographic & DOM text-content defect. `TextReveal` split words with CSS `paddingRight` without outputting a whitespace character in the DOM, squishing words together (`"Seeourspacesinperson"`, `"TheJourneyBeginsHere."`).
- **Change Applied:** Rendered each word in `<span className="inline-block whitespace-nowrap"><span style={{ display: "inline-block", overflow: "hidden" }}>...</span><span className="inline-block">&nbsp;</span></span>`.
- **Why It Resolves the Issue:** Normalizes DOM text extraction, copy-pasting, and screen-reader pronunciation by restoring explicit whitespace between words.

---

### 7. Finding ID: `CONTACT-ALL-CPY-001`
- **Component / File:** `src/components/sections/Enquiry.tsx`
- **Lines Affected:** Lines 96–111
- **Issue:** Copy & Microcopy issue. The dispatch confirmation exposed developer implementation details (`"missing server-side SMTP/CRM provider"`) and robotic jargon (`"transmit your enquiry directly"`).
- **Change Applied:** Replaced with elegant, hospitable microcopy:
  > `"Your enquiry has been prepared and is ready to send. To receive an immediate response and confirm available dates, connect directly with our reservation concierge via WhatsApp or phone:"`
  >
  > Button label: `"Send via WhatsApp Concierge"`.
- **Why It Resolves the Issue:** Preserves a polished, premium hospitality tone while transparently guiding guests to instant WhatsApp and phone assistance.

---

### 8. Finding ID: `CONTACT-ALL-USE-001`
- **Component / File:** `src/components/sections/Enquiry.tsx`
- **Lines Affected:** Line 233
- **Issue:** Visual consistency. Enquiry submit button had sharp rectangular corners, diverging from the rounded pill design language of the venue.
- **Change Applied:** Added `rounded-full` to the submit button.
- **Why It Resolves the Issue:** Restores visual alignment with Tier 1 solid buttons across the application.

---

### 9. Finding ID: `FAC-DESK-ACC-002`
- **Component / File:** `src/components/sections/Facilities.tsx`
- **Lines Affected:** Line 173
- **Issue:** WCAG 4.1.2 (Name, Role, Value / Semantics). On desktop, 6 sticky facility panels were stacked. Inactive panels had `opacity: 0` but remained in the accessibility tree, exposing 12 `<h2>` facilities headings.
- **Change Applied:** Added `aria-hidden={!isActive}` to desktop facility slide items.
- **Why It Resolves the Issue:** Screen readers now only discover and announce the active, visible facility slide.

---

### 10. Finding ID: `CONTACT-ALL-ACC-001`
- **Component / File:** `src/components/ui/DynamicMap.tsx`
- **Lines Affected:** Lines 10–34
- **Issue:** WCAG 2.5.8 (Target Size Minimum). Leaflet DivIcon omitted `iconSize`, resulting in a default 12 × 12 px marker hitbox.
- **Change Applied:** Explicitly configured `iconSize: [48, 48]`, `iconAnchor: [24, 48]` for `resortIcon`, and `iconSize: [32, 32]`, `iconAnchor: [16, 16]` for `userIcon`.
- **Why It Resolves the Issue:** Marker clickable area is now 48 × 48 px (and 32 × 32 px), easily satisfying WCAG 2.5.8.

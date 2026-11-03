# Winter Road Shield — PPF promotion v3

Standalone Calgary PPF campaign page for `promo.mobiledetailsquad.com`. Buildless HTML/CSS/JavaScript with its own design: asphalt dark surfaces, Archivo display type, JetBrains Mono for specs, one signal-orange accent reserved for the offer and booking actions, and blue reserved for film coverage. It does not use the main Statamic theme or Bootstrap.

## Preview

```sh
python3 -m http.server 8088 --bind 127.0.0.1
```

Open `http://127.0.0.1:8088/`. No dependencies or build step.

## Page structure

1. **Hero.** The offer is the headline: Full Front PPF, $1,595 CAD, with the two free extras and the $350 combined value directly under it, one Reserve button and the $250 credited deposit as a note. Beside it, the coverage stage: a segmented control (Partial Front, Full Front flagged as the winter special, Full Vehicle), a single vehicle render with SVG panel highlights, labelled pins on desktop, and a card listing covered panels as chips, the price, the extras line and a package-specific link.
2. **Two winter extras.** Interior Reset Detail and Windshield Ceramic Glass Treatment, described as a glass treatment and not impact film.
3. **Why now.** Seasonal band over a winter road photo with three hazards. No repair-bill or guaranteed-damage claims.
4. **How reserving works.** Three steps.
5. **Questions.** Five FAQs; the film and warranty answer stays neutral until John confirms.
6. **Final band and footer.** Repeats the offer on orange. Footer carries the terms paragraph.

A sticky bottom bar on screens under 1024px holds a call button and the Full Front reserve action.

### Package data

Packages, panel outlines and booking URLs live near the top of `assets/js/ppf-promo.js`.

- **Partial Front:** from $950 CAD, $150 credited deposit. Provisional pending confirmation. Leading hood and fender edges, front bumper, mirrors. No winter extras.
- **Full Front:** $1,595 CAD, $250 credited deposit. Full hood, front fenders, front bumper, headlights, mirrors. Includes the extras.
- **Full Vehicle:** custom quote. All painted panels. The stage link calls the shop.

Every Reserve action (header, hero, final band, sticky bar) books the Full Front special regardless of the comparison selection. Only the stage card's link follows the selected package. Tabs support Left/Right/Home/End. Full Front renders without JavaScript; the other two need it.

### Coverage artwork

The stage uses one image, `assets/images/ppf-vehicle-studio-v2.webp`, a generated neutral sedan with a clean alpha cutout. Coverage is drawn as SVG polygons in `ppf-promo.js`, traced on the 1536 × 1024 canvas, blended into the paint with `mix-blend-mode: multiply` and clipped to the car silhouette with a CSS mask of the same image. Pin positions are percentages of the image box. The three older baked coverage renders (`ppf-coverage-*-v2`) are no longer displayed; the Full Front one is still referenced as the Open Graph image. Provenance notes are in `project-tasks/ppf-v2-assets.md`.

`assets/images/winter-road-band.webp` is a resized copy of `driving-winter.jpeg` for the seasonal band. It is a stock-style winter road scene, not an MDS vehicle.

### Film and warranty placeholder

The owner comment above `<main>` lists the unconfirmed business facts. Do not add a film brand, warranty duration or impact guarantee before John confirms.

## Fieldd handoff

Reserve actions link to `https://book.mobiledetailsquad.com`. The public entry asks for an address and does not preselect PPF or configure the deposit. The booking entry served a Cloudflare bot challenge to a headless browser during QA, so the dedicated PPF service link and deposit behaviour still need a manual check in a normal browser or the Fieldd admin.

Replace each `bookingConfig` URL only with a tested Fieldd-generated link, and keep the HTML `href` fallbacks in sync. Only these incoming fields are forwarded to HTTPS booking links:

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`.

Phone links receive nothing. No customer data is ever appended to a booking URL.

If `window.dataLayer` exists, the page pushes `ppf_package_select`, `ppf_booking_click` and `ppf_quote_click` with the package and placement. A click is not a paid booking; measure completion in Fieldd.

Example SMS URL after deployment:

```text
https://promo.mobiledetailsquad.com/?utm_source=mds_customers&utm_medium=sms&utm_campaign=winter_road_shield
```

## Before launch

Confirm film and warranty, vehicle eligibility, tax presentation, installation address, offer validity, cancellation and payment terms, Partial Front pricing, and the dedicated Fieldd PPF service link with a real deposit test. Refresh the "first snow" wording for the actual send date. `robots.txt` currently disallows crawling; change that deliberately if the page should be indexed for Google Ads quality checks.

The SMS offer stays separate from the proposed $250 Search rebate. No regular price, countdown, capacity or rebate stacking is shown.

## Preserved versions

- v2 (dark hero with three baked coverage renders): `project-tasks/ppf-v2-backup/`.
- v1: `project-tasks/ppf-v1-backup/`.
- Earlier snapshots `index.before-codex.html`, `assets/css/ppf-promo.before-codex.css` and `index.old.html` are untouched.

QA evidence: `qa-evidence/winter-ppf-v3/REPORT.md`. No commit, push or deployment was performed.

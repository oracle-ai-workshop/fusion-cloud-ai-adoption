# PowerPoint workshop website QA

final result: passed

## October 22, 2026 layout update

The fixed shared footer aligns the sidebar brand/copyright area with Previous/Next navigation and keeps the controls visible during scrolling. The header's extra Enable & Test label and all original-slide controls were removed. Repeated slide copyright/page-number footers remain hidden for source-content auditing; one copyright notice is displayed in the shared footer.

Screenshots now stack before their columns fall below 520 CSS pixels, and use the full available content width when the viewport is smaller. Resource-card art and text also stack when the main content area is narrow. Original artwork, instructional wording, fonts and official Redwood CSS are unchanged.

All 45 routes passed at 1244 and 390 CSS pixels; resource and exercise pages also passed at 768, 1024 and 1600 CSS pixels. Checks cover overflow, fixed-footer position, matching desktop footer heights, screenshot column widths, removed controls and one visible copyright notice. Evidence: `../verification_upd/layout-1244.json`, `layout-390.json`, `layout-breakpoints.json` and `layout-side-by-side.png`. The source-content validator still passes all 434 paragraphs, 27 destinations and 110 original assets.

The earlier original-slide interaction and initial deployment notes below describe the October 21 implementation before this update.


Source: `../powerpoint.pptx`, 45 portrait pages. The presentation was inspected in Microsoft PowerPoint and exported locally to PDF with the printing option; no online export service was used. The source presentation was not edited.

Implementation: http://127.0.0.1:4175/
Checked October 21, 2026.

## Findings

No remaining actionable P0/P1/P2 findings.

This is a requested responsive web adaptation, not a pixel-identical slide player. Dark covers retain the deck's actual artwork and backgrounds. Light instructional pages intentionally use the unmodified Oracle JET Redwood theme and web typography. Original-slide views retain native PowerPoint rendering.

## Evidence and normalization

Evidence is saved in the parent project's `verification_upd/` folder:

- `cover-comparison.jpg`: native PowerPoint cover on the left; responsive website on the right.
- `resources-comparison.jpg`: native PowerPoint resource page on the left; corresponding Redwood web page on the right.
- `exercise-comparison.jpg`: original page 13 and the corresponding responsive exercise.
- `cover-typography-comparison.jpg`: focused crops of the original cover text and its web adaptation.
- `cover-desktop.jpg`, `agenda-desktop.jpg`, `resources-desktop.jpg`, `exercise-desktop.jpg`: final rendered desktop states.
- `cover-mobile.jpg`, `lesson-mobile.jpg`, `contents-mobile.jpg`, `page-17-mobile-fixed.jpg`: phone layout, contents drawer and corrected long-identifier state.
- `routes-desktop.json`, `routes-mobile.json`: navigation and overflow checks for every page.
- `repository-prefix.json`: actual browser verification beneath `/future-repository/`.

Source render dimensions are 810 × 1440 pixels, preserving the original portrait composition. Desktop layout checks targeted 1440 CSS pixels; phone checks targeted 390 CSS pixels. The in-app browser's inherited zoom changed capture density during testing. Final captured desktop files are 1572 × 983 pixels; mobile files range from 379 × 822 to 417 × 903 pixels. Comparison montages normalize panel heights to 900 pixels, maintaining each panel's aspect ratio. These montages assess artwork, hierarchy, copy and deliberate reflow; they are not pixel-difference tests between identical viewports. Measured CSS overflow checks are separate from screenshot output sizing.

## Fidelity surfaces

### Fonts and typography

Original Oracle Sans Regular, Light, Semibold and Bold font files are served locally. The cover preserves Oracle Sans Light. Light-page typography uses Oracle Sans with the official Redwood theme. The source deck uses Aptos on many instructional pages; substituting the Redwood type system there is intentional under the design brief. Native original-slide images preserve all original typography. Titles, hierarchy, bold inline words, source spelling, and numbered lists are retained.

### Spacing and layout

A persistent, collapsible Redwood contents tree retains the previous site's navigation structure. Long exercises have page selectors and Previous/Next controls. Portrait source content is reflowed into text and screenshot columns on desktop and a single column on phones. Source divider pages remain green chapter openers. All 45 routes have no horizontal overflow at the tested desktop and phone sizes after the identifier wrapping correction.

### Colors and tokens

Green-page backgrounds and graphics come directly from the supplied deck. Light pages use `vendor/redwood/oj-redwood-min.css` copied without modification from Oracle JET 21.0.1. Official palette, typography, divider, radius and focus tokens are used in the layout stylesheet. Buttons and the navigation list are real Oracle JET components; icon glyphs use the original Redwood icon font. The source Oracle mark is an exact native-render crop. No generated or approximate artwork was substituted.

### Images and backgrounds

All 110 original PowerPoint media assets are included byte-for-byte, with source SHA-256 hashes. Racing-car, flag, texture and feature-strip assets are used directly. Annotated screenshot figures are native slide crops rendered at 1620 pixels wide, retaining source arrows, overlays and screenshot crops. Every page offers its original PowerPoint rendering as a lossless WebP. Original raw screenshot assets are also retained. Both the screenshot viewer and original-slide viewer were exercised successfully.

### Copy and content

All 434 source paragraphs appear verbatim in the HTML, with `data-source` markers. All 27 distinct original external hyperlink destinations are present. The validator compares the generated HTML with the extracted content and the original PPTX XML. It also checks source media hashes, local resource existence and repository-relative URL resolution. Source wording, spelling, identifiers and repeated footer text are preserved. The occluded `ink` object on source page 4 remains hidden and is retained in the audit data and DOM.

## Interaction and acceptance checks

- All 45 pages were traversed in order using the visible Next control on desktop and phone layouts. Exactly one article was visible at a time.
- Contents selection, chapter grouping, long-exercise page selection and phone drawer opening/closing were tested.
- Original-slide and screenshot enlargement dialogs open and close correctly.
- The original source link destinations were preserved, not executed as workshop tasks.
- An actual second preview at `/future-repository/?slide=13` loaded the official theme and navigated to page 14 while retaining the prefix. Its original-slide viewer loaded the correct prefixed image path.
- Browser warning/error logs were empty after the final navigation/viewer checks.
- `python3 scripts/validate-site-upd.py`: passed, checking 45 pages, 434 exact paragraphs, 27 external destinations, 110 original media assets, 45 original-slide views, local resources and repository-relative paths.
- `node --check site_upd/app.js`: passed.

## Comparison and repair history

1. Initial navigation initialization repeatedly followed the selected item's href. The official `oj-navigationlist-nofollow-link` class was added so the local router handles navigation. The full desktop and phone page traversals subsequently completed.
2. The initial source-asset inventory included a decorative feather near the deck's brand mark. The brand mark was resolved against the actual PowerPoint rendering and extracted from page 4. Final screenshots show the correct original Oracle mark.
3. The first mobile sweep found page 17's long agent identifier overflowing its column. `overflow-wrap:anywhere` was applied to instructional text. The same page was rechecked at 390 CSS pixels; document scroll width was 379 pixels and the overflow was resolved. Initial and corrected mobile results are retained separately.
4. Annotated screenshot figures were upgraded from 810 to 1620 pixels wide while preserving the same source crop coordinates. This retains fine UI labels and arrows in the enlargement viewer.
5. The phone cover's original racing-car asset was repositioned so it appears earlier in the page. The source asset and text were unchanged; the final mobile capture was reviewed.

## Implementation checklist

- [x] All 45 source pages preserved and navigable.
- [x] Original artwork, backgrounds, annotated screenshots, fonts and slide previews included locally.
- [x] Official Redwood CSS, tokens, components and icon font used.
- [x] Source text, hyperlinks and media hashes audited against the original PPTX.
- [x] Desktop/phone route and overflow checks completed.
- [x] Original-slide, screenshot and contents controls tested.
- [x] Repository-prefix behavior tested in a live browser.
- [x] Self-contained GitHub Pages workflow, `.nojekyll` and publishing instructions included.

## Limits

No live GitHub repository was configured or deployed. Verification was performed in the in-app Chromium browser; native Safari, Firefox and physical-phone acceptance was not performed. Original external Oracle/demo destinations still require internet access and any access permissions those services require. The bundled workflow assumes `site_upd/` becomes the repository root; the README explains the alternative parent-repository configuration and avoiding conflicting Pages workflows.

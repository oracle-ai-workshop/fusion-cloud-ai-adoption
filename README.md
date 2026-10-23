# Oracle AI Adoption Workshop

A static, responsive website containing all 45 pages of `powerpoint.pptx`, plus two complete Generative AI labs from the saved workshop, Sourcing Command Center and Project Delivery Assurance Workspace image pages, and the Sales Command Center lab. The labs appear after ERP in Let’s Explore AI Agent Studio & Agents; the original PowerPoint pages retain their relative order and direct URLs. Content is reflowed into a workshop with a persistent contents tree, page navigation, exercise page selectors, screenshot enlargement, and fixed Previous/Next navigation.

## Preview

From the parent project folder:

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory site_upd
```

Open http://127.0.0.1:4175/. Every page has a direct URL, such as `?slide=13`. Browser Back/Forward works. On phones, the Contents button opens the navigation drawer. Screenshots stack vertically before their columns fall below 520 CSS pixels (or use the full available width on smaller screens). The fixed footer keeps Previous/Next visible and aligns the sidebar footer with the main navigation.

## GitHub Pages

Repository: https://github.com/oracle-ai-workshop/fusion-cloud-ai-adoption

Website: https://oracle-ai-workshop.github.io/fusion-cloud-ai-adoption/

The repository and website are public. GitHub Pages uses the included GitHub Actions workflow; pushing to `main` automatically deploys updates.

This folder is a complete publishing root. It has no hardcoded username, repository name, host, or absolute asset paths. It works at both `https://USER.github.io/` and `https://USER.github.io/REPOSITORY/`.

1. Copy **the contents of `site_upd/`**, including `.github/` and `.nojekyll`, to the root of the eventual repository.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or `master`, or manually run the included **Publish workshop** workflow.

The workflow inside this folder assumes the folder's contents become the repository root. If the parent project is used as the repository instead, move this workflow to the repository's `.github/workflows/`, set its upload `path` to `site_upd`, and disable the older workflow that publishes `site/`. GitHub Pages provides one site per repository; running both publishing workflows would replace the same deployment.

All CSS, JavaScript, fonts, illustrations, backgrounds, icons, screenshots, and original-slide previews are local. The website itself needs only a static server. Publication also builds the downloadable digital workbook before uploading a single Pages artifact. Each workflow attempt uses a unique artifact name so rerunning a failed deployment cannot select duplicate artifacts. Original external documentation and demo links retain their destinations and require internet access.

## Digital workbook

**Download Workbook** downloads `downloads/oracle-ai-adoption-workbook.pdf`, generated automatically on every publication from the current 50 HTML articles in their reading order. The PDF uses portrait US Letter pages, zero outer page margins, full-page backgrounds, selectable text, clickable external URLs and internal chapter links. Content keeps its own design spacing. Long labs flow across multiple PDF pages; browser navigation and credential popups are excluded.

To generate it locally from this repository root, using Node.js 22 or newer:

```sh
npm ci
npx playwright install chromium
npm run build:workbook
```

The generator checks images, resources, chapter targets and horizontal content bounds. `workbook.css` controls the PDF layout without changing the website. Generated PDFs and build dependencies are ignored by Git; the publishing workflow includes the generated download in its staged website. A local static preview serves the download after the first local build.

## Design sources

- Original artwork: the supplied PowerPoint's racing car, flags, textures, backgrounds, illustrated feature strip, and decorative assets, extracted without modifying their bytes. An Oracle mark was cropped from the PowerPoint's native PDF rendering.
- Green opening pages: the presentation's actual background images and artwork, rearranged for a responsive web layout.
- Light instructional pages: the unmodified **Oracle JET 21.0.1 Redwood theme**, its official design tokens, navigation-list and button components, and original icon font. Layout rules live separately in `styles.css`; the vendor theme is unchanged.
- Fonts: the original installed Oracle Sans Regular, Light, Semibold, and Bold files. The presentation contains no embedded fonts. The deck's cover uses Oracle Sans Light; this web adaptation uses Oracle Sans throughout for consistency with Redwood. The original-slide previews preserve the presentation's native typography, including Aptos.
- Annotated screenshots: extracted from a PDF exported locally by Microsoft PowerPoint, preserving arrows, overlays, and cropping. The individual raw source images are also saved under `assets/presentation/`. Screenshot figures are rendered at 1620 pixels wide for readability.

Oracle's theme documentation: https://docs.oracle.com/en/middleware/developer-tools/jet/19/develop/use-css-themes-oracle-jet-apps.html

## Content preservation

`index.html` contains 50 articles as HTML (45 PowerPoint pages and five lab pages). The Generative AI menu item uses the existing page selector for CX, HCM, Sourcing Command Center and Project Delivery Assurance Workspace. Sales Command Center (Lab 5) is the sole page in the separate How to create Agentic Apps section, following How to Enable AI Agents. Its CX and HCM labs contain all source subsections except acknowledgements, with 22 copied local images; the CX Sales Command Center steps are included even though the saved Markdown commented them out. `lab-provenance.json` records the source and image hashes. Existing `?slide=1` through `?slide=45` URLs retain their content; `?slide=46` and `?slide=47` are the imported labs, and `?slide=48` contains the supplied Sourcing Command Center title and image. `?slide=49` contains the supplied Project Delivery Assurance Workspace title and image. `?slide=50` contains all 27 nonempty body paragraphs from the supplied Sales Command Center Word document and four matching screenshots extracted from the supplied video. The screenshots include only the application area, excluding the presenter tile, browser chrome and desktop taskbar. Displayed page numbers reflect the 50-page reading order. `content.json` records the extracted source paragraphs, runs, hyperlinks, image references and layout coordinates. Every original paragraph is tagged with `data-source` in the HTML. All 434 paragraphs and 27 distinct external link destinations are preserved; source spelling and wording are retained. The occluded `ink` text object on page 4 is retained in the audit data and a hidden DOM element, matching its invisible source state.

`asset-provenance.json` records the source presentation hash, the 110 original media hashes, font provenance and official Redwood package version. Original-slide previews remain archived under `assets/slides/`; the viewer control has been removed. The source presentation itself is unchanged. Repeated source copyright and page-number paragraphs remain in hidden audit markup; the shared fixed footer displays the copyright once.

The parent project's `scripts/validate-site-upd.py` checks the HTML against both the extracted content and original PowerPoint, source asset hashes, links and relative resource paths. Browser QA records are in `../verification_upd/`; the QA report is `design-qa.md` in this folder.

Original content, fonts, artwork and marks remain subject to their respective owners' terms. Oracle JET and its runtime dependencies retain their supplied license notices.

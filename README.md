# Oracle AI Adoption Workshop

A static, responsive website containing all 45 pages of `powerpoint.pptx`, in their original order. Content is reflowed into a workshop with a persistent contents tree, page navigation, exercise page selectors, screenshot enlargement, and fixed Previous/Next navigation.

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

There is no npm install or build step. All CSS, JavaScript, fonts, illustrations, backgrounds, icons, screenshots, and original-slide previews are local. Original external documentation and demo links retain their destinations and require internet access.

## Design sources

- Original artwork: the supplied PowerPoint's racing car, flags, textures, backgrounds, illustrated feature strip, and decorative assets, extracted without modifying their bytes. An Oracle mark was cropped from the PowerPoint's native PDF rendering.
- Green opening pages: the presentation's actual background images and artwork, rearranged for a responsive web layout.
- Light instructional pages: the unmodified **Oracle JET 21.0.1 Redwood theme**, its official design tokens, navigation-list and button components, and original icon font. Layout rules live separately in `styles.css`; the vendor theme is unchanged.
- Fonts: the original installed Oracle Sans Regular, Light, Semibold, and Bold files. The presentation contains no embedded fonts. The deck's cover uses Oracle Sans Light; this web adaptation uses Oracle Sans throughout for consistency with Redwood. The original-slide previews preserve the presentation's native typography, including Aptos.
- Annotated screenshots: extracted from a PDF exported locally by Microsoft PowerPoint, preserving arrows, overlays, and cropping. The individual raw source images are also saved under `assets/presentation/`. Screenshot figures are rendered at 1620 pixels wide for readability.

Oracle's theme documentation: https://docs.oracle.com/en/middleware/developer-tools/jet/19/develop/use-css-themes-oracle-jet-apps.html

## Content preservation

`index.html` contains all 45 articles as HTML. `content.json` records the extracted source paragraphs, runs, hyperlinks, image references and layout coordinates. Every original paragraph is tagged with `data-source` in the HTML. All 434 paragraphs and 27 distinct external link destinations are preserved; source spelling and wording are retained. The occluded `ink` text object on page 4 is retained in the audit data and a hidden DOM element, matching its invisible source state.

`asset-provenance.json` records the source presentation hash, the 110 original media hashes, font provenance and official Redwood package version. Original-slide previews remain archived under `assets/slides/`; the viewer control has been removed. The source presentation itself is unchanged. Repeated source copyright and page-number paragraphs remain in hidden audit markup; the shared fixed footer displays the copyright once.

The parent project's `scripts/validate-site-upd.py` checks the HTML against both the extracted content and original PowerPoint, source asset hashes, links and relative resource paths. Browser QA records are in `../verification_upd/`; the QA report is `design-qa.md` in this folder.

Original content, fonts, artwork and marks remain subject to their respective owners' terms. Oracle JET and its runtime dependencies retain their supplied license notices.

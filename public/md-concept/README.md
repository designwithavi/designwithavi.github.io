# Material Depot — IKEA-style concept redesign

A design-study concept: Material Depot's homepage and a product page for **TL 13131 Ivory Royal Medallion** (Lippan art mirror mural wall tile), rebuilt in an IKEA-style layout using Material Depot's own colours, Outfit typeface and logo.

> Concept only. Not affiliated with or endorsed by Material Depot. The site takes no orders; a banner on every page says so.

## Pages
- `index.html` — homepage: category pills, featured Lippan art mural mosaic, ideas carousel, shop by material, Experience Centres
- `product.html` — product page: image gallery, price per box, key facts, measurements drawing, accordions, room ideas, Experience Centres

## What works
- Gallery thumbnails (and swipe on phones), quantity counter, add to cart (counts in the header for this browser session only), wishlist toggle
- Carousels with arrow buttons and a progress line
- "See all 10 centres" toggle, on-page section links, a pinned Add to cart bar on phones
- Responsive at desktop, tablet and phone widths

## Run it
Open `index.html` in a browser. No build step or dependencies.

To rebuild the HTML after editing `build.py`: `python3 build.py`

## Put it on GitHub Pages
1. Create a repository and upload these files (keep the `assets` folder).
2. Settings → Pages → Deploy from branch → `main` / root.

## Credits
- Product data and store details: materialdepot.com, November 2026
- Room renders and product shot: Avishkar
- Outfit typeface: SIL Open Font License

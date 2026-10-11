# Design QA

- Source visual truth: user-provided inline screenshot `20653F10-41E9-4C9A-AD2B-CCC0B19A8D8F.png`, approximately 1085 × 1058 px.
- Implementation: React/Vite website using the reference's cream, forest-green and sage palette, serif numeric results and generated raster ticket hero.
- Expected content differences: user changed step rule to p / 10; default result is therefore 53.43, not the screenshot's 54.663. Added manual A/B/C input mode and batch results.
- Font choices: Noto Sans TC / PingFang TC / Microsoft JhengHei; Georgia / Noto Serif TC for numeric display. Fallback fonts remain usable without Google Fonts.
- Layout: desktop two-column calculator, four tabs; mobile single-column layout with 16px input text and horizontal scrolling within tables.
- Images: actual generated raster ticket in public/assets/ticket-hero.webp; standard icons from lucide-react. No CSS or handcrafted SVG replacement for the ticket illustration.
- Full-view and focused-region comparison evidence: unavailable. The cloud-browser preview operation timed out, so no browser-rendered screenshot was captured.
- Viewport/density normalization: not performed because browser capture is unavailable.
- Primary interactions tested in browser: not completed. Formula/rate linkage, exact decimal values, rounding/range filtering, budget and random selection validated by six Node.js tests; Vite production build passed.
- Console errors checked: not completed; browser connection timed out.
- Comparison history: no visual pass claimed.
- Blocker: cloud-browser call timed out; no rendered visual QA or browser interaction verification.

final result: blocked

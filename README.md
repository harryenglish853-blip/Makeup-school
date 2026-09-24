# Regina Valenzuela — Salon & Makeup School

The website for Regina Valenzuela Salon & Makeup School. It's a fast static site in plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Deploy by uploading the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any web host). Serve `404.html` as the not-found page.

## Where business facts live

**Every business fact is in [`assets/js/config.js`](assets/js/config.js).** The site never invents a price, phone number, address, course detail, credential or review. Any field left empty (`""`) is never shown as fact.

- `preview: true` (the current setting) shows draft items with a yellow **Draft** badge. A **Launch checklist** button lists everything still missing.
- `preview: false` hides every draft. Empty sections (reviews, student work, before/after, portfolio, Instagram, bridal) are removed, together with every menu link that pointed to them, so visitors never reach a dead end.

## How the calls to action work

| Button | Not yet connected | Connected |
|---|---|---|
| Book Appointment | Opens the appointment-request form | `links.booking` opens your booking system (Square, Vagaro, Fresha…) |
| Explore School / Student Inquiry | Opens the student-inquiry form | The form stays; `links.enrollment` adds an "Enroll / Apply" button |
| Forms | Preview: validates, then says honestly that nothing was sent | `links.formEndpoint` posts JSON (e.g. Formspree). If only `business.email` is set, the visitor's email app opens with the message filled in |
| Call Now / Get Directions / Email | Hidden | Shown when `business.phone`, `business.address` or `business.email` is set |
| Message Us | Opens the form | `business.whatsapp` or `business.sms` link |
| Map | Hidden | Loads when the visitor taps "Show Map", which keeps the page fast and avoids third-party tracking |

## Launch checklist

1. Fill in `business` (phone, email, address, hours, domain) and `links`.
2. Add a form endpoint (`links.formEndpoint`) and send a real test submission.
3. Confirm each service: set `confirmed: true` and add a price and duration if you want them shown. Delete any service you don't offer.
4. Set `bridalOffered` to `true` or `false`.
5. Replace the course placeholders with the real programs, using verified details only.
6. Confirm each "Why study here" point, or delete it.
7. Add Regina's story, her approved quote (`quoteVerified: true`), and verified credentials.
8. Add photography. Every image slot is listed in `media.slots`; use WebP/AVIF at about 1600px wide or less, with descriptive alt text.
9. Add portfolio images, genuine before/after pairs, student work (with permission) and authentic reviews.
10. Optional hero video: short, muted, compressed clips in `media.heroVideo` (about 4 MB or less for desktop, about 1.5 MB or less for mobile, plus a poster image). It never loads for visitors who prefer reduced motion or have data-saver on.
11. Have the Privacy Policy and Terms (`privacy.html`, `terms.html`) reviewed and completed.
12. Add the domain to `robots.txt` and create a `sitemap.xml`.
13. Set `preview: false`.

## SEO

- The page title and description pick up the city automatically once `business.address.city` is set.
- JSON-LD structured data (`BeautySalon`, `EducationalOrganization`, and a `Course` for each confirmed course) is generated from the config. Draft content is never included.
- Open Graph and Twitter share image: `assets/img/og-image.png`.
- Add `schema` to each hours entry (e.g. `"Tu-Sa 10:00-18:00"`) to publish opening hours in structured data.

## Accessibility and performance

- Semantic landmarks, a skip link, a single h1 and a logical heading order.
- Keyboard-operable menu (focus trap, Esc to close), tabs (arrow keys), FAQ accordion, and a before/after slider (a native range input underneath).
- Touch targets are 44px or larger, with no hover-only features.
- `prefers-reduced-motion` turns off the powder animation, the scroll-drawn brush stroke and the reveals.
- Images below the fold are lazy-loaded. The hero animation pauses when off-screen or when the tab is hidden, and video is only fetched when it has been configured.

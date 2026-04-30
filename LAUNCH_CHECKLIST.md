# First Aid Academy — Launch Checklist

## Content (client-supplied — required before public launch)
- [ ] Replace `web/src/lib/nav.ts` `phone.display` and `phone.tel` with the real number (currently `+30 6900 000000`)
- [ ] Replace `phone.email` in `web/src/lib/nav.ts` with the real address (currently `info@firstaidacademy.gr`)
- [ ] Replace `web/src/assets/brand/founder.png` with a real portrait of Σπύρος Τζιρτζιλάκης (currently the brand logo as placeholder)
- [ ] Replace `web/public/og-default.jpg` with a designed 1200×630 OG card (currently a BLS hero photo)
- [ ] Confirm 21 client logos use the best available brand assets (currently the small 200×116 thumbnails imported from the inspiration WordPress site)
- [ ] Replace certificate placeholders (`web/src/assets/certificates/cofat-instructor.jpg`, `community-first-aid-patras.jpg`) with proper PDF page exports
- [ ] Confirm the FAW MDX content matches Spyros's actual training scope (raw `.odt` for FAW was unreadable — current content is synthesized to align with RTI's standard 18-hour First Aid at Work curriculum)
- [ ] Final pricing strategy: decide whether to display prices on program detail pages or keep "request quote" only (current site uses request-quote)

## Technical
- [ ] DNS → Netlify
- [ ] HTTPS certificate active
- [ ] Netlify Forms enabled in site settings; "booking" + "contact" forms appear in dashboard after first deploy
- [ ] Test booking form end-to-end (submit + confirm email arrives)
- [ ] Test contact form end-to-end (submit + ?sent=1 banner shows on return)
- [ ] Verify favicon, apple-touch-icon, og-default render across browsers/devices

## Compliance
- [ ] Add Privacy Policy page (`/aporrhto/`) — required for form submission
- [ ] Add Terms of Service page (`/oroi/`) — best practice for paid bookings
- [ ] Add cookie banner if analytics is added
- [ ] Confirm GDPR consent text on booking + contact forms (booking already has a required consent checkbox; contact does not — add if needed)

## Performance budget (targets)
- [ ] LCP < 2.0s on mobile
- [ ] CLS < 0.05
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Total homepage weight < 1MB

## Out of scope for v1 (deferred per client decision)
- SEO structured data (JSON-LD), robots.txt, advanced meta — to be added in a later phase
- English locale
- Online payment / Stripe checkout

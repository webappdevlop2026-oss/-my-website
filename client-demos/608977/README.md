# ShriPanchang interactive client preview

Source reviewed: `webappdevlop2026-oss/bangla-panjika`, main reference `df5788cc2513614774868f1e2d6a16164491c066`, pubspec version `2.0.9+209`. Reviewed the main feature registry, screen classes, service routing, Sahaj calendar, Bengali calendar and pubspec. This is a web prototype, not a Flutter release build or full source correctness audit.

Entry: `/bangla-calendar-app-project-view.html`, reached through the existing calendar project launcher. Existing invite records and agency admin controls are preserved. No production app, client admin, backend or payment code is modified.

`features.json` contains 178 source-based feature entries, deduplicated by registry key, plus named core screens from the source. Administrative release controls are excluded. Related advanced entries use shared guided preview workflows; these are not 178 independent production implementations.

Interactive: Gregorian month/day selection, two calendar presentation modes, selected-day actions, favourites, local note/reminder/family-entry CRUD, checklists, japa counter, meditation timer, budget totals, date differences, date countdown, year navigation, searchable/category-filtered features, sample lunar/sky/direction controls, sample horoscope selection, share-card text editing, text share, print/PDF, local JSON export, readability preferences.

Explicit preview limitations: No astronomical Bengali solar-date conversion, accurate lunar/auspicious calculation, live weather/GPS/compass, cloud sync, Android widgets/notifications, payment, real booking, external videos, remote feature control or production authentication. All such screens are labelled illustrative or workflow previews. No plaintext project invitation code is embedded. Existing client-side entry check is preserved; static source is not a security boundary.

Data: namespace `shripanchang_client_demo_v1` in localStorage only. No customer submissions or analytics. General cultural stories are illustrative. Initial selected day is a clearly labelled October 25, 2026 demonstration fixture; Go to today uses Asia/Kolkata.

Verification: JS syntax; all 178 routes render; calendar navigation; favourite save; note CRUD and HTML escaping; reminder save/delete/alert preview; checklist persistence; japa; leap-year date difference; budget sum; feature search and share-card text editing. Browser review at desktop and a 375px embedded viewport; fixed grid overflow. Native Android app and astronomical accuracy not tested.

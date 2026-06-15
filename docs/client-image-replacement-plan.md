# Client Image Replacement Plan

## Scan Summary
- **Number of Unsplash references found:** 0
- **Existing stock images:** 0 (All images currently referenced are from the local `client assets` directory)
- **Repeated images:** Yes, heavily repeated. Specifically, `photo_10_...`, `photo_20_...`, `photo_30_...`, `photo_40_...`, and `photo_50_...` from the Aesthetics folder are repeated across almost all generic page heroes and sections.
- **Mismatched images:** Yes. Square (`photo_40`) and Portrait (`photo_10`, `photo_30`, `photo_50`) images are currently mapped to Hero sections which require Landscape orientation on desktop.
- **Images already correctly using client assets:** The individual room pages correctly map to their respective room folders (e.g., Cabin Villa uses Cabin Villa photos). However, the primary card image for every room is `photo_1_...`, which is a "Title Graphic" with baked-in text, making it unsuitable for a clean UI card.
- **Recommended Replacements:** We recommend ~35 specific re-mappings across the generic pages and room cards to fix repeating images, fix hero orientations, and remove text-baked graphics from cards.

## Replacement Mapping

| Priority | Route | Section | Current Image | Recommended Client Asset | Reason | Desktop Crop | Mobile Crop |
|---|---|---|---|---|---|---|---|
| High | `/` | Hero (`homeHero`) | `photo_40_` (Square) | `photo_29_` (Beach sunset) | Hero requires a wide landscape image. Sunset beach is inviting. | Wide 16:9 | 4:5 |
| High | `/` | Intro (`homeIntro`) | `photo_10_` | `photo_17_` (Lobby) | Lobby provides a welcoming introduction to the resort. | Original | Original |
| Medium | `/` | Activities (`homeActivities`) | `photo_30_` | `photo_31_` (ATV on sand) | Visual representation of an activity. | Wide | Original |
| Medium | `/` | Dining (`homeDining`) | `photo_20_` | `photo_42_` (Dining lounge) | Avoids repeating photo 20. | Wide | Original |
| Medium | `/` | Feature Wide (`homeFeatureWide`) | `photo_50_` | `photo_33_` (Resort exterior) | Wide sections require landscape photos. | Wide | Wide |
| Medium | `/` | CTA Overlay (`homeCtaOverlay`) | `photo_30_` | `photo_21_` (Resort exterior trees) | Darker landscape image works well for text overlay. | Wide | Original |
| High | `/rooms` | Hero (`roomsHero`) | `photo_10_` | `photo_24_` (Resort white building) | Hero requires landscape orientation. | Wide 16:9 | 4:5 |
| Medium | `/rooms` | CTA (`roomsCta`) | `photo_30_` | `photo_28_` (Beachfront hut) | Good contextual CTA background. | Wide | Original |
| High | `/rooms/[slug]` | Cabin Suite Card | `photo_1_` (Title Graphic) | `photo_4_` (Bedroom view) | Remove graphic with baked-in text from UI cards. | 16:9 | Original |
| High | `/rooms/[slug]` | Cabin Villa Card | `photo_1_` (Title Graphic) | `photo_4_` (Pool deck) | Highlight the private pool feature. | 16:9 | Original |
| High | `/rooms/[slug]` | Cancun Room Card | `photo_1_` (Title Graphic) | `photo_6_` (Hot tub) | Highlight the outdoor hot tub feature. | 16:9 | Original |
| High | `/rooms/[slug]` | Family Room Card | `photo_1_` (Title Graphic) | `photo_3_` (Roof deck) | Show outdoor family space. | 16:9 | Original |
| High | `/rooms/[slug]` | Ibiza Room Card | `photo_1_` (Title Graphic) | `photo_5_` (Outdoor tub) | Highlight the tub with a view. | 16:9 | Original |
| High | `/restaurants` | Hero (`restaurantsHero`) | `photo_20_` | `photo_20_` (Outdoor dining) | Existing landscape image is actually a perfect fit. | Wide 16:9 | 4:5 |
| Medium | `/restaurants` | Primary (`restaurantsPrimary`) | `photo_50_` | `photo_53_` (Noodles food) | Section should feature actual food. | Original | Original |
| Medium | `/restaurants` | Secondary (`restaurantsSecondary`)| `photo_20_` | `photo_56_` (Sizzling plate) | Add variety with another food dish. | Original | Original |
| Medium | `/restaurants` | Tertiary (`restaurantsTertiary`) | `photo_30_` | `photo_48_` (Tropical drinks) | Drinks match the dining theme. | Original | Original |
| High | `/activities` | Hero (`activitiesHero`) | `photo_40_` | `photo_22_` (ATV sunset) | Hero requires an active landscape image. | Wide 16:9 | 4:5 |
| Medium | `/activities` | Feature (`activitiesFeature`) | `photo_10_` | `photo_18_` (Dipping tub) | Represents a relaxation activity. | Original | Original |
| Medium | `/activities` | Evening (`activitiesEvening`) | `photo_30_` | `photo_36_` (Romantic dinner) | Represents an evening activity. | Original | Original |
| High | `/events` | Hero (`eventsHero`) | `photo_30_` | `photo_39_` (Resort dusk) | Hero needs landscape orientation. | Wide 16:9 | 4:5 |
| Medium | `/events` | Feature (`eventsFeature`) | `photo_50_` | `photo_45_` (Night decorations) | Event/celebration vibe. | Original | Original |
| High | `/about` | Hero (`aboutHero`) | `photo_50_` | `photo_1_` (Staff group photo) | Excellent landscape photo for "About Us". | Wide 16:9 | 4:5 |
| Medium | `/about` | Story Primary | `photo_10_` | `photo_17_` (Lobby) | Fits the resort story introduction. | Original | Original |
| Medium | `/about` | Story Secondary | `photo_30_` | `photo_9_` (Walkway stairs) | Fits the resort tour narrative. | Original | Original |
| High | `/contact` | Hero (`contactHero`) | `photo_1_` | `photo_13_` (Walkway to beach) | Welcoming landscape image. | Wide 16:9 | 4:5 |
| High | `/reserve` | N/A (General bg) | N/A | `photo_25_` (Beach shoreline) | Peaceful landscape for booking background. | Wide 16:9 | 4:5 |

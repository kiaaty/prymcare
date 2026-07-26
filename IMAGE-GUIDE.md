# How to Replace Images — No Code Editing Needed

Every image on the site now lives in the `assets/` folder with a clear,
descriptive filename. To swap in your own photo, **just upload a new file
with the exact same name to the exact same folder** — the website will pick
it up automatically. You never need to open or edit `index.html`.

> Tip: keep the same filename and file extension (`.jpg`). If your new photo
> is a `.png` or `.webp`, either convert it to `.jpg` first, or rename the
> file to end in `.jpg` (most photo editors let you "export as" / "save as"
> a different format).

## Logo
| File | Used in | Recommended size |
|---|---|---|
| `assets/logo.jpg` | Header, footer, hero, About badge, favicon | Square, at least 300×300px |

## Hero & About section
| File | Used in | Recommended size |
|---|---|---|
| `assets/hero-bg.jpg` | Circular graphic behind the logo on the homepage hero | Square, 800×800px |
| `assets/about-photo.jpg` | Photo in the "Who we are" section | Portrait, 900×1125px (4:5 ratio) |

## Featured Products (8 images)
Every product photo now automatically shows a small circular PrymCare logo
watermark in the bottom-right corner — this is done in the page's code
(not baked into the image file), so it happens **automatically** for any
photo you drop in. You never need to add the watermark yourself.

| File | Product shown |
|---|---|
| `assets/products/forever-daily.jpg` | Forever Daily |
| `assets/products/aloe-propolis-creme.jpg` | Forever Aloe Propolis Creme |
| `assets/products/bee-pollen.jpg` | Forever Bee Pollen |
| `assets/products/cardiohealth.jpg` | Forever CardioHealth |
| `assets/products/lite-ultra-shake.jpg` | Forever Lite Ultra Shake |
| `assets/products/royal-jelly.jpg` | Forever Royal Jelly |
| `assets/products/forever-freedom.jpg` | Forever Freedom |
| `assets/products/aloe-vera-gelly.jpg` | Forever Aloe Vera Gelly |

Recommended size: square, 600×600px minimum (a real product photo on a
plain or lightly textured background works best).

## Lifestyle Gallery Banner (4 images)
| File | Caption shown |
|---|---|
| `assets/lifestyle/sourcing.jpg` | "100% Natural Sourcing" |
| `assets/lifestyle/active.jpg` | "Real, Active Living" |
| `assets/lifestyle/routine.jpg` | "Simple Daily Routines" |
| `assets/lifestyle/results.jpg` | "Visible, Lasting Results" |

Recommended size: square, 700×700px minimum.

## Wellness Library / Blog cards (3 images)
| File | Article shown |
|---|---|
| `assets/blog/cardio.jpg` | Blood pressure / cardio health article |
| `assets/blog/aloe.jpg` | Aloe vera supplement article |
| `assets/blog/wellness.jpg` | Hepatitis / wellness awareness article |

Recommended size: 700×438px (16:10 ratio).

---

### Why this setup
Every image used to be pulled from an external photo service, which is why
some weren't showing up reliably. Everything is now hosted directly inside
your own `assets/` folder, so nothing depends on an outside service staying
online — and replacing a photo is as simple as uploading a file with a
matching name.

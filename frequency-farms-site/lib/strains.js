// Single source of truth for per-strain pages AND the QR codes printed on
// bags. The slug is what gets encoded in the QR: once a bag is printed,
// never change a slug (rename the strain by editing `name`, not `slug`).
// If a slug ever has to change, add a redirect from the old one in
// next.config.js so printed bags keep working.
//
// Only fill in what's confirmed. Any field left null is simply not shown
// on the page, so nothing gets invented. `spectrum` must be one of the
// ids in lib/spectrum.js: flow | energy | balance | calm | recovery.
//
// 3D: put the model at public/models/<slug>.glb (and an optional still at
// public/models/<slug>.webp for the loading poster), then set
// `model: true` on that strain.

export const STRAINS = [
  {
    slug: "pink-runtz",
    name: "Pink Runtz",
    spectrum: "balance",
    genetics: "Zkittlez × Gelato",
    flavor: "Strawberry, candy, citrus, cream",
    terpenes: ["Limonene", "Caryophyllene", "Linalool"],
    model: false,
  },
  { slug: "watermelon-gelato", name: "Watermelon Gelato" },
  { slug: "runtz", name: "Runtz" },
  { slug: "russian-cream", name: "Russian Cream" },
  { slug: "bubblegum-runtz", name: "Bubblegum Runtz" },
  { slug: "sakura", name: "Sakura" },
  { slug: "blue-nerds", name: "Blue Nerds" },
  { slug: "push-pop", name: "Push Pop" },
  { slug: "jelly-donut", name: "Jelly Donut" },
  { slug: "higashi", name: "Higashi" },
  { slug: "acai-berry", name: "Açaí Berry" },
  { slug: "cereal-runtz", name: "Cereal Runtz" },
  { slug: "jolly-ranchers", name: "Jolly Ranchers" },
  { slug: "atomic-blow-pop", name: "Atomic Blow Pop" },
  { slug: "party-poppers", name: "Party Poppers" },
  { slug: "sour-og", name: "Sour OG" },
  { slug: "gushers", name: "Gushers" },
  { slug: "zangria", name: "Zangria" },
  { slug: "white-cherry-gelato", name: "White Cherry Gelato" },
  { slug: "snowcones", name: "Snowcones" },
  { slug: "zkillato", name: "Zkillato" },
];

export const SITE_URL = "https://frequencyfarmsfl.com";
export const QR_PATH_PREFIX = "/s/";
export const strainUrl = (slug) => `${SITE_URL}${QR_PATH_PREFIX}${slug}`;

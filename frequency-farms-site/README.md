# Frequency Farms — publish this site

This folder is a ready-to-deploy Next.js project. Your component is
already wired in at `components/FrequencyFarmsLanding.jsx`, and the
real logo lives at `public/frequency-farms-logo.png`.

You do **not** need to install anything on your own computer to
publish this. Everything below happens in a browser.

## Step 1 — Put the code on GitHub

1. Go to [github.com](https://github.com) and create a free account
   if you don't have one.
2. Click the **+** in the top right → **New repository**.
3. Name it `frequency-farms-site`, leave it **Public** or **Private**
   (either works), and click **Create repository**.
4. On the next page, click **uploading an existing file**.
5. Drag this entire folder's contents into the upload box (everything
   inside `frequency-farms-site/`, not the folder itself) and click
   **Commit changes**.

## Step 2 — Deploy it with Netlify

1. Go to [netlify.com](https://netlify.com) and sign up — choose
   **Continue with GitHub** so the two are linked automatically.
2. Click **Add new site → Import an existing project → Deploy with
   GitHub**.
3. Find `frequency-farms-site` in the list and select it.
4. Netlify auto-detects it's a Next.js app and installs its Next.js
   runtime plugin automatically. Leave the build settings as they
   are and click **Deploy site**.
5. Wait about a minute. You'll get a live link that looks like
   `random-name-123.netlify.app` — that's the site, live, right now,
   for free.

## Step 3 — Connect your GoDaddy domain to Netlify

1. In Netlify, open your site → **Domain settings** → **Add a
   domain** → type your domain (e.g. `frequencyfarms.com`) → **Add
   domain**.
2. In that same Domain settings page, find the option to **use
   Netlify DNS**. It will show you 4 nameservers (something like
   `dns1.p0X.nsone.net`, `dns2...`, `dns3...`, `dns4...`).
3. Go to GoDaddy → **My Products** → your domain → **DNS** →
   **Nameservers** → **Change** → choose **"Enter my own
   nameservers (advanced)"** → paste in all 4 of Netlify's
   nameservers, replacing GoDaddy's default ones → **Save**.
4. This hands DNS management to Netlify, which then issues free
   HTTPS for your domain automatically. Propagation usually takes
   10 minutes to a few hours — Netlify's Domain settings page shows
   a green check once it's verified.

That's it — the domain now points straight at your live site.

## Step 4 — Verify it actually works

Once the domain shows verified in Netlify:
- Visit your domain and confirm the age gate shows up.
- Click "Privacy Policy" and "Terms" in the footer and confirm both
  pages load.
- Test that the mailto links open to the right addresses.
- Submit the sign-up form once to see the "Sending…" state (it
  currently simulates success — see the `submitLead` note below for
  wiring it to something real).

---

## Before you consider this launched

Real Privacy Policy and Terms pages are already live at `/privacy`
and `/terms` (`pages/privacy.js` and `pages/terms.js`) — they cover
the SMS/email program, data collection, and site-use terms, but are
a solid starting draft, not a substitute for your own legal review,
especially once you're collecting opt-ins at real volume. The two
business emails they (and the site footer) use are already set in
`lib/site-config.js`: `inquires@frequencyfarmsfl.com` for general
inquiries and `licensing@frequencyfarmsfl.com` for license/compliance
requests — update those there if either address changes.

A few other things are still placeholders — search the component
file for `TODO` to find all of them, but the ones that matter most
before real traffic hits this:

- **`submitLead` and `submitWholesale`** in
  `components/FrequencyFarmsLanding.jsx` currently just fake success
  after half a second. They need to actually send data to your
  email/SMS platform and wherever wholesale inquiries should land.
- **`COA_URL` / `LICENSE_URL` / `LICENSE_NUMBER` / `LICENSE_STATE`** —
  intentionally left unset for now. The Lab & Legal section on the
  page shows an honest "coming soon" note instead of a dead link.
  Once you have a real batch COA and license page, set these four
  constants and swap the note back for the two links (search
  `COA_URL` in the component file for the exact spot, marked with a
  comment).
- **`AGE_GATE_EXIT_URL`** — where someone gets sent if they say
  they're under 21 (currently just Google).
- **`BRAND_PILLARS`** — once you have real, permissioned customer
  reviews, this is a fine spot to switch back to a quote format with
  actual names/initials attached.
- A real **favicon** — drop a `favicon.ico` into `/public` and
  uncomment the line in `pages/index.js`.

## Making changes later

Once this is live, any edit is the same loop: change the file on
GitHub (or re-upload it), and Netlify automatically rebuilds and
redeploys within a minute or two. No re-deploy step to remember.

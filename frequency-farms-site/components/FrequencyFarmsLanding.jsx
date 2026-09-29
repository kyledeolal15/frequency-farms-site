import React, { useState, useEffect } from "react";

/**
 * Frequency Farms - Landing Page
 * -------------------------------------------------
 * Built around the real Frequency Farms logo (embedded below as a
 * base64 PNG so this stays a single, self-contained file) and the
 * brand's own Frequency Spectrum system from the packaging.
 *
 * NOTE ON THE LOGO ASSET: it's inlined as a data URI so this file
 * runs standalone. For a real production build, pull it out into a
 * normal image import instead (e.g. `import logo from "./frequency-
 * farms-logo.png"` and drop the PNG in your assets folder) - inlining
 * ~340KB of base64 in source is fine for a one-off deliverable, not
 * for a repo you'll maintain.
 *
 * GATE FLOW: a full-screen overlay blocks the page on first visit, in
 * two steps: (1) a 21+ check, (2) the lead-capture form (name, phone,
 * email, SMS consent), with a "Skip for now" way out. Completing
 * either step (submitting the form, or skipping it) is remembered in
 * localStorage (wrapped in try/catch so it degrades gracefully if
 * storage is unavailable) so returning visitors aren't re-gated every
 * load. Anyone who says they're under 21 is sent off-site instead of
 * reaching the form or the page.
 *
 * LEAD FORM: the same name/phone/email/consent form appears both in
 * the gate and again further down the page, so a visitor who skips at
 * the gate can still sign up later. Includes an explicit SMS consent
 * checkbox, which is required for TCPA compliance in the US since
 * this site collects phone numbers for marketing texts. Note this age
 * gate is a self-attestation, not ID verification — an unrelated,
 * heavier step you'd need for actual age-restricted transactions.
 *
 * PRIVACY / TERMS: real pages, not placeholders. See pages/privacy.js
 * and pages/terms.js in the deployable project (if you're using the
 * standalone version of this file elsewhere, point PRIVACY_URL /
 * TERMS_URL at wherever you host equivalent pages). They're a solid
 * starting draft, not a substitute for your own legal review.
 *
 * ALSO INCLUDED: a Lab & Legal section (compliance copy, with the
 * COA/license links intentionally left out until you have real ones -
 * see COA_URL/LICENSE_URL below), social proof, an FAQ accordion, and
 * a separate wholesale/retailer inquiry form (kept apart from the
 * consumer signup form so a dispensary reaching out doesn't get
 * lumped in with someone joining the list).
 *
 * NO DIRECT SALES ON THIS SITE: this is a brand/education site, not a
 * storefront. There's no "Shop the store" or "Where to buy" section -
 * actual purchases happen at licensed dispensaries, not here. The
 * consumer signup form exists to build an education + dispensary-
 * availability list (spectrum content, new strain announcements,
 * alerts when a strain lands near the signer), not to push a sale.
 * The wholesale form is separate and is for retailers/dispensaries
 * who want to carry the line, not consumers.
 *
 * PAGE-LEVEL SETUP NOT IN THIS FILE: <title>, meta description, an
 * Open Graph image, and a favicon live in your app's document head or
 * root HTML, not in this component. If you're using this inside
 * Next.js, Vite, or similar, set those in the framework's usual place
 * (e.g. a <Head> component or index.html).
 *
 * Wire-up points (search "TODO"):
 *  - CAUSEWAY_URL
 *  - submitLead - replace with a real signup endpoint (also wire it
 *    into your email/SMS provider - see the domain/hosting/SMS setup
 *    notes discussed separately for picking a cannabis-compliant one)
 *  - submitWholesale - replace with a real wholesale-inquiry endpoint
 *  - INQUIRIES_EMAIL / LICENSING_EMAIL - your real business emails,
 *    used in Privacy/Terms and in the Lab & Legal / footer sections
 *  - COA_URL / LICENSE_URL - currently null on purpose (see below);
 *    once you have a real batch COA and license page, set these and
 *    the trust section will need its links/panel restored (search
 *    "COA_URL" below for the exact spot)
 *  - LICENSE_NUMBER / LICENSE_STATE - your real license disclosure
 *  - AGE_GATE_EXIT_URL - where an underage visitor gets redirected
 *  - BRAND_PILLARS - once you have real, permissioned customer reviews,
 *    feel free to swap this section back to a quote format with real
 *    names/initials attached
 *  - FAQS - review and edit the placeholder answers
 */

const CAUSEWAY_URL = "#"; // TODO: Causeway (Miami sub-brand)
const PRIVACY_URL = "/privacy";
const TERMS_URL = "/terms";
const INQUIRIES_EMAIL = "inquires@frequencyfarmsfl.com";
const LICENSING_EMAIL = "licensing@frequencyfarmsfl.com";
// COA_URL / LICENSE_URL are intentionally unset (null) until there's a
// real batch COA and license/compliance page to link to. The trust
// section below shows an honest "coming soon" note instead of a dead
// link - once you have both, set these to real URLs and swap that
// note back for the two links (see the "COA_URL" comment in the JSX).
const COA_URL = null;
const LICENSE_URL = null;
const LICENSE_NUMBER = null; // TODO: your real license number, once issued
const LICENSE_STATE = null; // TODO: state of licensure
const AGE_GATE_EXIT_URL = "https://www.google.com"; // TODO: where under-21 visitors are sent
const GATE_STORAGE_KEY = "ff_gate_complete";

// No discount code here on purpose: the list isn't a sales funnel, so
// the incentive is early access to content and dispensary alerts, not
// a redeemable percentage. Edit these two strings if you want to
// reframe the offer, they're the only place it's written.
const SIGNUP_HEADLINE = "Get early access";
const SIGNUP_CTA_LABEL = "Join the list";

const LOGO_SRC = "/frequency-farms-logo.png";

// ---------- Why the Spectrum (brand-stated, not attributed quotes) ----------
// This used to be a "social proof" section with invented customer quotes.
// Swapped for real, defensible statements about the brand instead, since
// putting words in the mouth of a fictional "customer" and presenting it
// as a genuine review isn't something to fake, even as a placeholder.
// Once you have real, permissioned customer reviews, this is a fine spot
// to bring a quote format back - just with actual quotes and actual names
// or initials, not invented ones.
const BRAND_PILLARS = [
  {
    title: "Lab-tested, every batch",
    text: "Every batch is tested by a licensed third-party lab before it reaches a shelf. Batch number, THC/terpene totals, and the COA are never optional.",
  },
  {
    title: "Built around the Spectrum, not the label",
    text: "Five states, based on the effect a strain actually produces, not the sativa/indica name printed on the jar next to it.",
  },
  {
    title: "Small-batch by design",
    text: "Grown with intention instead of scaled for volume, so the state a strain produces stays consistent from one batch to the next.",
  },
];

// ---------- FAQ ----------
const FAQS = [
  {
    q: "How does the Frequency Spectrum work?",
    a: "Every strain we grow is placed on a five-point scale, from Flow & Creation (energized and social) to Recovery & Grounding (slow and grounded), based on the state it actually produces rather than just indica/sativa/hybrid labels. All five are equally high-quality flower, just built for different moments. See the Spectrum section above for the full breakdown of all five.",
  },
  {
    q: "What's the difference between Frequency Farms and the THCA line?",
    a: "Same spectrum system and growing standards. Frequency Farms is our main THC lineup; THCA releases are separate drops, typically hemp-derived, and follow different state-by-state legal rules than THC products.",
  },
  {
    q: "Where can I find Frequency Farms products?",
    a: "We don't sell directly through this site. Frequency Farms is carried by licensed dispensaries, and availability depends on your state's cannabis laws. Sign up below for dispensary availability alerts, or use the wholesale form further down if you're a retailer looking to carry the line.",
  },
  {
    q: "What is Causeway?",
    a: "Our Miami-only line: same spectrum system, warmer shelf, built for the retail counter rather than the wholesale pallet. Causeway carries the Frequency Farms name; it's the local face of it, not a spin-off.",
  },
  {
    q: "Are your products lab tested?",
    a: "Every batch is tested by a licensed third-party lab. Batch number, THC/terpene totals, and a link to the full COA are on the bag and in the Lab & Legal section above.",
  },
];

// ---------- The Frequency Spectrum (from packaging), fully detailed ----------
const SPECTRUM = [
  {
    id: "flow",
    label: "Flow & Creation",
    tagline: "Loose · Imaginative · Unforced",
    strainType: "Sativa",
    color: "var(--s-flow)",
    Icon: IconWave,
    description:
      "The most energized and social end of the spectrum. It clears the noise that keeps an idea from moving, without dulling the idea itself. Thoughts connect a little faster, self-editing loosens, and starting feels easier than usual. It's built for output, not for coasting.",
    madeFor: [
      "Builders and designers starting something from a blank page",
      "Writers, musicians, and anyone doing creative work on a deadline",
      "Early-stage brainstorming and solo studio sessions",
    ],
    bestFor: "Daytime, before or during hands-on creative work",
  },
  {
    id: "energy",
    label: "Energy & Expression",
    tagline: "Bright · Talkative · Lifted",
    strainType: "Sativa-leaning hybrid",
    color: "var(--s-energy)",
    Icon: IconBolt,
    description:
      "A cleaner, more social lift than Flow & Creation. Quicker to talk, quicker to move, with a lightness that reads as confidence rather than being wired. It's built to keep you sharp and articulate in front of other people, not to send you inward.",
    madeFor: [
      "Traders who need to stay quick and decisive through market hours",
      "Anyone prepping for a pitch, a call, or a room full of people",
      "Social settings, from client dinners to nights out",
    ],
    bestFor: "Daytime through early evening, ahead of anything social or high-output",
  },
  {
    id: "balance",
    label: "Balance & Harmony",
    tagline: "Centered · Versatile · Smooth", // CONFIRMED - from packaging
    strainType: "Hybrid",
    color: "var(--s-balance)",
    Icon: IconLotus,
    description:
      "The middle of the spectrum, and the most versatile shelf in the lineup. It doesn't push toward energy or toward sedation. It holds you level, which is what makes it work across a whole day rather than one specific moment in it. Smooth in, smooth out, no sharp edges either direction.",
    madeFor: [
      "Anyone who wants one strain that works from midday through evening",
      "Days with a mix of work, people, and downtime, nothing that needs a specific edge",
      "First-time or occasional users who want a predictable middle ground",
    ],
    bestFor: "Any time of day, the default pick when the day itself is mixed",
  },
  {
    id: "calm",
    label: "Calm & Centering",
    tagline: "Slow · Settled · Even",
    strainType: "Indica-leaning hybrid",
    color: "var(--s-calm)",
    Icon: IconSun,
    description:
      "Noticeably slower than Balance & Harmony, but still present. This brings the noise down without pulling you under. Thoughts stop stacking on top of each other, the day loses its edge, and stillness starts to feel available instead of forced.",
    madeFor: [
      "Traders decompressing after the close",
      "Winding down after a high-stress day without being knocked out",
      "Pre-sleep routines for people who still want to be lucid an hour before bed",
    ],
    bestFor: "Evening, once the day's output is done",
  },
  {
    id: "recovery",
    label: "Recovery & Grounding",
    tagline: "Heavy · Quiet · Restorative",
    strainType: "Indica",
    color: "var(--s-recovery)",
    Icon: IconMountain,
    description:
      "The slowest and most grounded end of the spectrum, and the only one built around the body rather than the mind. This is for full shutdown: heavy-bodied, quiet, and unhurried, meant to be used when the plan is to actually rest, not to stay functional afterward.",
    madeFor: [
      "Athletes on training and recovery days, for sleep and inflammation",
      "End-of-day shutdown when tomorrow starts early",
      "Anyone whose body needs the rest more than their mind needs the quiet",
    ],
    bestFor: "Night, with nothing left on the schedule",
  },
];

export default function FrequencyFarmsLanding() {
  // ---------- Gate: 21+ check, then lead capture, then the site unlocks ----------
  // "gateStep" only matters while the gate is showing: 'age' -> 'leads'.
  // "gateComplete" is what actually hides the gate and unlocks the page.
  const [gateComplete, setGateComplete] = useState(() => {
    try {
      return window.localStorage.getItem(GATE_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [gateStep, setGateStep] = useState("age"); // 'age' | 'leads'

  useEffect(() => {
    document.body.style.overflow = gateComplete ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gateComplete]);

  function confirmAge(isOfAge) {
    if (isOfAge) {
      setGateStep("leads");
    } else {
      window.location.href = AGE_GATE_EXIT_URL;
    }
  }

  function completeGate() {
    try {
      window.localStorage.setItem(GATE_STORAGE_KEY, "true");
    } catch {
      // storage unavailable (private browsing, etc.) - gate will just
      // reappear next visit, which is an acceptable fallback
    }
    setGateComplete(true);
  }

  // ---------- Lead capture (name, phone, email, SMS consent) ----------
  // Shared by the gate's lead step and the on-page join section further
  // down, so a visitor who skips at the gate can still sign up later.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done

  function submitLead(e) {
    e.preventDefault();
    if (!name || !email || !consent || status === "sending") return;
    setStatus("sending");
    // TODO: replace with a real lead-capture endpoint. Send { name, phone,
    // email, consent } to your CRM/ESP/SMS provider.
    setTimeout(() => {
      setStatus("done");
      if (!gateComplete) completeGate();
    }, 600);
  }

  // ---------- Wholesale / retailer inquiry ----------
  // Kept separate from the consumer lead form above: a dispensary
  // reaching out to stock the brand isn't the same lead as a shopper
  // signing up for a discount, and shouldn't land in the same list.
  const [wBusiness, setWBusiness] = useState("");
  const [wContact, setWContact] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wPhone, setWPhone] = useState("");
  const [wMessage, setWMessage] = useState("");
  const [wStatus, setWStatus] = useState("idle"); // idle | sending | done

  function submitWholesale(e) {
    e.preventDefault();
    if (!wBusiness || !wContact || !wEmail || wStatus === "sending") return;
    setWStatus("sending");
    // TODO: replace with a real wholesale-inquiry endpoint. Send
    // { business: wBusiness, contact: wContact, email: wEmail, phone: wPhone,
    // message: wMessage } to your CRM or a dedicated wholesale inbox.
    setTimeout(() => setWStatus("done"), 600);
  }

  return (
    <div className="ff-root">
      <style>{CSS}</style>

      {!gateComplete && (
        <div className="ff-agegate" role="dialog" aria-modal="true" aria-label="Age verification">
          {gateStep === "age" ? (
            <>
              <img src={LOGO_SRC} alt="Frequency Farms" className="ff-agegate-logo" />
              <p className="ff-agegate-question">Are you 21 years of age or older?</p>
              <p className="ff-agegate-sub">
                You must be 21+ to enter this site. This product contains THC.
              </p>
              <div className="ff-agegate-actions">
                <button type="button" className="ff-btn ff-btn-primary" onClick={() => confirmAge(true)}>
                  I'm 21 or older
                </button>
                <button type="button" className="ff-btn ff-btn-ghost" onClick={() => confirmAge(false)}>
                  I'm under 21
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={LOGO_SRC} alt="Frequency Farms" className="ff-agegate-logo" />
              <p className="ff-agegate-question">{SIGNUP_HEADLINE}</p>
              <p className="ff-agegate-sub">
                Sign up for spectrum education, new strain announcements,
                and alerts when a strain lands at a dispensary near you.
              </p>

              <form className="ff-join-form ff-agegate-form" onSubmit={submitLead}>
                <div className="ff-join-row">
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Full name"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (for texts)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-label="Phone number"
                  />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />

                <label className="ff-join-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to receive marketing texts and emails from
                    Frequency Farms at the number and address above. Message
                    and data rates may apply, message frequency varies.
                    Reply STOP to unsubscribe at any time. See our{" "}
                    <a href={PRIVACY_URL}>Privacy Policy</a> and{" "}
                    <a href={TERMS_URL}>Terms</a>.
                  </span>
                </label>

                <button type="submit" className="ff-btn ff-btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : SIGNUP_CTA_LABEL}
                </button>
              </form>

              <button type="button" className="ff-agegate-skip" onClick={completeGate}>
                Skip for now
              </button>
            </>
          )}
        </div>
      )}

      {/* ---------- NAV ---------- */}
      <header className="ff-nav">
        <div className="ff-nav-inner">
          <img src={LOGO_SRC} alt="Frequency Farms" className="ff-nav-logo" />
          <nav className="ff-nav-links">
            <a href="#spectrum">The Spectrum</a>
            <a href="#trust">Lab &amp; Legal</a>
            <a href="#faq">FAQ</a>
            <a href="#join" className="ff-nav-cta">
              {SIGNUP_HEADLINE}
            </a>
          </nav>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="ff-hero">
        <div className="ff-hero-top">
          <img src={LOGO_SRC} alt="Frequency Farms" className="ff-hero-logo" />
          <div className="ff-hero-copy">
            <h1>
              Five states.
              <br />
              One spectrum.
            </h1>
            <p className="ff-hero-sub">
              Every bag is grown for a specific state, not a generic high,
              from the loose focus of Flow &amp; Creation to the full
              shutdown of Recovery &amp; Grounding. Grown for entrepreneurs,
              athletes, and traders who need the right state, not just a
              high.
            </p>
            <div className="ff-hero-actions">
              <a href="#join" className="ff-btn ff-btn-primary">
                {SIGNUP_HEADLINE}
              </a>
              <a href="#spectrum" className="ff-btn ff-btn-ghost">
                See the spectrum
              </a>
            </div>
          </div>
        </div>
        <SpectrumDial />
      </section>

      {/* ---------- BRAND STORY ---------- */}
      <section className="ff-story">
        <div className="ff-story-inner">
          <p className="ff-story-lead">
            Attention, mood, and recovery all move in waves. Most
            brands sell one note. We grow for the range, and we mark every
            bag with exactly where on that range it sits.
          </p>
        </div>
      </section>

      {/* ---------- THE SPECTRUM (detailed) ---------- */}
      <section className="ff-spectrum-section" id="spectrum">
        <div className="ff-section-head">
          <h2>The Frequency Spectrum</h2>
          <p>Five states, moving from energized and social to slow and grounded: what each one does, who it's made for, and the strain type that shapes it.</p>
        </div>

        <div className="ff-spectrum-detail-list">
          {SPECTRUM.map((s, i) => (
            <div
              className={`ff-spectrum-detail ${i % 2 === 0 ? "ff-tilt-a" : "ff-tilt-b"}`}
              key={s.id}
              style={{ "--accent": s.color }}
            >
              <span className="ff-spectrum-detail-ghost">{String(i + 1).padStart(2, "0")}</span>
              <div className="ff-spectrum-detail-head">
                <div className="ff-spectrum-detail-icon">
                  <s.Icon color={s.color} />
                </div>
                <div>
                  <h3>{s.label}</h3>
                  <span className="ff-spectrum-detail-tagline">{s.tagline}</span>
                </div>
                <span className="ff-spectrum-detail-strain">{s.strainType}</span>
              </div>

              <p className="ff-spectrum-detail-desc">{s.description}</p>

              <div className="ff-spectrum-detail-foot">
                <div className="ff-spectrum-detail-for">
                  <span className="ff-spectrum-detail-label">Made for</span>
                  <ul>
                    {s.madeFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="ff-spectrum-detail-when">
                  <span className="ff-spectrum-detail-label">Best for</span>
                  <p>{s.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TRUST / LAB & LEGAL ---------- */}
      <section className="ff-trust" id="trust">
        <div className="ff-trust-inner">
          <div className="ff-trust-copy">
            <h2>Every bag is verified</h2>
            <p>
              Batch number, harvest and package dates, lab testing, total
              THC, and total terpenes, printed on the bag and reachable by
              QR code. Nothing about a strain's spectrum placement is a
              guess.
            </p>
            <p>
              Frequency Farms products are cultivated and tested in
              accordance with state licensing requirements. These
              statements have not been evaluated by the FDA. This product
              is not intended to diagnose, treat, cure, or prevent any
              disease.
            </p>
            {/* COA_URL / LICENSE_URL: once you have a real batch COA and
                license page, add them back here as:
                <a href={COA_URL}>View lab results (COA)</a>
                <a href={LICENSE_URL}>License & compliance info</a> */}
            <div className="ff-trust-links">
              <a href={PRIVACY_URL}>Privacy Policy</a>
              <a href={TERMS_URL}>Terms</a>
            </div>
          </div>
          <div className="ff-trust-panel">
            <p className="ff-trust-panel-note">
              Batch-level lab results and our license disclosure are being
              finalized. Once available, they'll be posted here and printed
              on every bag with a scannable QR code.
            </p>
            <p className="ff-trust-panel-contact">
              Questions in the meantime? Email{" "}
              <a href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a>.
            </p>
          </div>
        </div>
        <p className="ff-compliance-note">
          For use only by adults 21 and older or registered qualifying
          patients. Keep out of reach of children and pets. Do not operate a
          vehicle or machinery after use. If pregnant or breastfeeding,
          consult a physician before use. License and lab disclosure details
          will be added here once available.
        </p>
      </section>

      {/* ---------- WHY THE SPECTRUM ---------- */}
      <section className="ff-proof">
        <div className="ff-section-head ff-section-wide">
          <h2>Built with intention</h2>
          <p>What actually sets a batch apart, not marketing copy.</p>
        </div>
        <div className="ff-proof-grid">
          {BRAND_PILLARS.map((p) => (
            <div className="ff-proof-card" key={p.title}>
              <h3 className="ff-proof-title">{p.title}</h3>
              <p className="ff-proof-text">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="ff-proof-disclaimer">
          Individual experiences vary; effects are not guaranteed.
        </p>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="ff-faq" id="faq">
        <div className="ff-section-head">
          <h2>Common questions</h2>
          <p>The stuff people usually ask about the brand and the spectrum.</p>
        </div>
        <div className="ff-faq-list">
          {FAQS.map((item) => (
            <details className="ff-faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <div className="ff-faq-body">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CAUSEWAY ---------- */}
      <section className="ff-causeway" id="causeway">
        <div className="ff-causeway-inner">
          <span className="ff-causeway-tag">A Frequency Farms brand</span>
          <h2>Causeway</h2>
          <p>
            Our Miami-only line: same spectrum system, warmer shelf, built
            for the retail counter rather than the wholesale pallet.
            Causeway carries the Frequency Farms name; it's the local face
            of it, not a spin-off.
          </p>
          <a href={CAUSEWAY_URL} className="ff-btn ff-btn-ghost">
            Visit Causeway
          </a>
        </div>
      </section>

      {/* ---------- WHOLESALE / RETAILER INQUIRY ---------- */}
      <section className="ff-wholesale" id="wholesale">
        <div className="ff-wholesale-inner">
          <h2>Carry Frequency Farms</h2>
          <p>
            Dispensary or retailer interested in stocking the lineup? Tell
            us a bit about your shop and we'll follow up with wholesale
            pricing and availability.
          </p>

          {wStatus === "done" ? (
            <p className="ff-join-success">
              Got it. We'll follow up within a few business days.
            </p>
          ) : (
            <form className="ff-join-form" onSubmit={submitWholesale}>
              <div className="ff-join-row">
                <input
                  type="text"
                  required
                  placeholder="Business name"
                  value={wBusiness}
                  onChange={(e) => setWBusiness(e.target.value)}
                  aria-label="Business name"
                />
                <input
                  type="text"
                  required
                  placeholder="Contact name"
                  value={wContact}
                  onChange={(e) => setWContact(e.target.value)}
                  aria-label="Contact name"
                />
              </div>
              <div className="ff-join-row">
                <input
                  type="email"
                  required
                  placeholder="you@business.com"
                  value={wEmail}
                  onChange={(e) => setWEmail(e.target.value)}
                  aria-label="Business email"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={wPhone}
                  onChange={(e) => setWPhone(e.target.value)}
                  aria-label="Phone number"
                />
              </div>
              <textarea
                placeholder="Location, license type, and what you're looking to carry"
                value={wMessage}
                onChange={(e) => setWMessage(e.target.value)}
                aria-label="Message"
                className="ff-textarea"
              />
              <button type="submit" className="ff-btn ff-btn-primary" disabled={wStatus === "sending"}>
                {wStatus === "sending" ? "Sending…" : "Submit inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---------- FUNNEL / LEAD CAPTURE ---------- */}
      <section className="ff-join" id="join">
        <div className="ff-join-inner">
          <h2>{SIGNUP_HEADLINE}</h2>
          <p>
            Sign up for spectrum education, new strain announcements, and
            alerts when a strain lands at a dispensary near you.
          </p>

          {status === "done" ? (
            <p className="ff-join-success">
              You're in. Watch for spectrum drops and dispensary alerts in
              your inbox.
            </p>
          ) : (
            <form className="ff-join-form" onSubmit={submitLead}>
              <div className="ff-join-row">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Full name"
                />
                <input
                  type="tel"
                  placeholder="Phone (for texts)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="Phone number"
                />
              </div>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />

              <label className="ff-join-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>
                  I agree to receive marketing texts and emails from
                  Frequency Farms at the number and address above. Message
                  and data rates may apply, message frequency varies. Reply
                  STOP to unsubscribe at any time. See our{" "}
                  <a href={PRIVACY_URL}>Privacy Policy</a> and{" "}
                  <a href={TERMS_URL}>Terms</a>.
                </span>
              </label>

              <button type="submit" className="ff-btn ff-btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : SIGNUP_CTA_LABEL}
              </button>
            </form>
          )}

          <div className="ff-join-links">
            <a href="#wholesale">Interested in carrying us? Wholesale inquiry</a>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="ff-footer">
        <div className="ff-footer-inner">
          <div className="ff-footer-top">
            <img src={LOGO_SRC} alt="Frequency Farms" className="ff-footer-logo" />
            <nav className="ff-footer-links">
              <a href={PRIVACY_URL}>Privacy Policy</a>
              <a href={TERMS_URL}>Terms</a>
              <a href="#accessibility">Accessibility</a>
              <a href="#wholesale">Wholesale</a>
              <a href="#faq">FAQ</a>
            </nav>
          </div>
          <p className="ff-footer-legal">
            21+ only. This product contains THC. Not evaluated by the FDA;
            not intended to diagnose, treat, cure, or prevent any disease.
            Keep out of reach of children and pets. Do not drive or operate
            machinery after use. Follow all state and local cannabis laws,
            which vary by jurisdiction, including THCA. License and
            compliance details available on request at{" "}
            <a href={`mailto:${LICENSING_EMAIL}`}>{LICENSING_EMAIL}</a>. ©{" "}
            {new Date().getFullYear()} Frequency Farms. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ---------- Spectrum dial (hero device) - hand-drawn connecting line ----------
function SpectrumDial() {
  return (
    <div className="ff-dial">
      <svg className="ff-dial-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--s-flow)" />
            <stop offset="25%" stopColor="var(--s-energy)" />
            <stop offset="50%" stopColor="var(--s-balance)" />
            <stop offset="75%" stopColor="var(--s-calm)" />
            <stop offset="100%" stopColor="var(--s-recovery)" />
          </linearGradient>
        </defs>
        <path
          d="M10,32 C90,10 150,50 230,28 S370,8 440,34 S590,52 650,26 S800,6 870,32 S950,50 990,30"
          fill="none"
          stroke="url(#dialGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div className="ff-dial-nodes">
        {SPECTRUM.map((s, i) => (
          <div
            className={`ff-dial-node ${i % 2 === 0 ? "ff-tilt-a" : "ff-tilt-b"}`}
            key={s.id}
            style={{ "--accent": s.color }}
          >
            <s.Icon color={s.color} small />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Icons (self-contained, no icon library) ----------
function iconSize(small) {
  return small ? 20 : 28;
}
function IconWave({ color, small }) {
  const n = iconSize(small);
  return (
    <svg width={n} height={n} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0 3.5 4 5 0"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBolt({ color, small }) {
  const n = iconSize(small);
  return (
    <svg width={n} height={n} viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLotus({ color, small }) {
  const n = iconSize(small);
  return (
    <svg width={n} height={n} viewBox="0 0 24 24" fill="none">
      <path d="M12 20c-4-1-6-4-6-8 3 0 5 1.5 6 4 1-2.5 3-4 6-4 0 4-2 7-6 8Z" stroke={color} strokeWidth="1.5" />
      <path d="M12 16c0-4 1.5-7 4-9-1 4-1 7-4 9Z" stroke={color} strokeWidth="1.3" />
      <path d="M12 16c0-4-1.5-7-4-9 1 4 1 7 4 9Z" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
function IconSun({ color, small }) {
  const n = iconSize(small);
  return (
    <svg width={n} height={n} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="14" r="5" stroke={color} strokeWidth="1.6" />
      <path
        d="M12 4v2M5 8l1.5 1.5M19 8l-1.5 1.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMountain({ color, small }) {
  const n = iconSize(small);
  return (
    <svg width={n} height={n} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 18 9 8l3 4 2-3 7 9H3Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap');

.ff-root {
  --true-black: #000000;
  --panel: #130F17;
  --panel-line: rgba(245,241,236,0.14);
  --bone: #F5F1EC;
  --dim: #9C98A2;
  --btn-grey: #3E3D3D;

  --s-flow: #F2A93B;
  --s-energy: #FF5A36;
  --s-balance: #FF2E93;
  --s-calm: #A855F0;
  --s-recovery: #6C3FC9;

  background-color: var(--true-black);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  color: var(--bone);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.55;
  overflow-x: hidden;
}

.ff-root h1, .ff-root h2, .ff-root h3 {
  font-family: 'Anton', 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  margin: 0;
}

.ff-root a { color: inherit; text-decoration: none; }
.ff-root p { margin: 0; color: var(--dim); max-width: 60ch; }
.ff-root ul { margin: 0; padding: 0; list-style: none; }
.ff-tilt-a { transform: rotate(-0.6deg); }
.ff-tilt-b { transform: rotate(0.6deg); }

/* AGE GATE */
.ff-agegate {
  position: fixed; inset: 0; z-index: 999;
  background: var(--true-black);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 18px; padding: 32px; text-align: center;
  overflow-y: auto;
}
.ff-agegate-logo { width: min(260px, 60vw); height: auto; margin-bottom: 6px; }
.ff-agegate-question {
  font-family: 'Anton', sans-serif; font-size: clamp(1.6rem, 4vw, 2.2rem);
  color: var(--bone); max-width: 20ch;
}
.ff-agegate-sub { font-size: 0.9rem; color: var(--dim); max-width: 40ch; }
.ff-agegate-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
.ff-agegate-form {
  width: 100%; max-width: 420px; margin-top: 6px;
  text-align: left;
}
.ff-agegate-form .ff-join-consent { text-align: left; }
.ff-agegate-form .ff-btn { align-self: center; width: 100%; }
.ff-agegate-skip {
  background: none; border: none; color: var(--dim);
  font-size: 0.82rem; text-decoration: underline; text-underline-offset: 3px;
  cursor: pointer; padding: 4px;
}
.ff-agegate-skip:hover { color: var(--bone); }

/* NAV */
.ff-nav {
  position: sticky; top: 0; z-index: 20;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--panel-line);
}
.ff-nav-inner {
  max-width: 1160px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 24px;
}
.ff-nav-logo { height: 34px; width: auto; display: block; }
.ff-nav-links { display: flex; align-items: center; gap: 26px; font-size: 0.9rem; }
.ff-nav-links a:hover { color: var(--s-balance); }
.ff-nav-cta {
  background: var(--btn-grey); color: var(--bone) !important;
  padding: 8px 16px; border-radius: 6px; font-weight: 600;
  border: 2px solid var(--btn-grey);
  box-shadow: 3px 3px 0 var(--s-balance);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.ff-nav-cta:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--s-balance); }

/* HERO */
.ff-hero {
  max-width: 1160px; margin: 0 auto;
  padding: 76px 24px 20px;
}
.ff-hero-top {
  display: flex; align-items: flex-start; gap: 8px;
  flex-wrap: wrap;
}
.ff-hero-logo {
  width: min(320px, 40vw);
  height: auto;
  transform: rotate(-4deg);
  filter: drop-shadow(6px 8px 0 rgba(0,0,0,0.6));
  margin: -12px -8px 0 -18px;
}
.ff-hero-copy { flex: 1; min-width: 280px; padding-top: 18px; }
.ff-hero h1 {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  line-height: 0.98;
}
.ff-hero-sub { margin-top: 22px; font-size: 1.08rem; max-width: 50ch; }
.ff-hero-actions { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; }

.ff-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 13px 26px; border-radius: 6px;
  font-weight: 600; font-size: 0.95rem;
  border: 2px solid transparent;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.ff-btn-primary {
  background: var(--btn-grey); color: var(--bone); border-color: var(--btn-grey);
  box-shadow: 4px 4px 0 var(--s-balance);
}
.ff-btn-primary:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--s-balance); }
.ff-btn-primary:disabled { opacity: 0.55; transform: none; cursor: default; }
.ff-btn-ghost {
  border-color: var(--bone); color: var(--bone);
  box-shadow: 4px 4px 0 var(--s-recovery);
}
.ff-btn-ghost:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--s-recovery); }

/* SPECTRUM DIAL (hero device) */
.ff-dial { padding: 56px 0 8px; }
.ff-dial-line { width: 100%; height: 40px; display: block; }
.ff-dial-nodes { display: flex; justify-content: space-between; gap: 10px; margin-top: -6px; }
.ff-dial-node {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-size: 0.74rem; color: var(--accent); text-align: center; flex: 1;
}
.ff-dial-node > svg {
  background: var(--true-black);
  border: 2px solid var(--accent);
  border-radius: 50%;
  padding: 6px;
}
.ff-dial-node span { color: var(--dim); font-family: 'Inter', sans-serif; font-weight: 500; }

/* STORY */
.ff-story { padding: 72px 24px; border-top: 1px dashed var(--panel-line); }
.ff-story-inner { max-width: 680px; margin: 0 auto; }
.ff-story-lead {
  font-family: 'Anton', sans-serif; font-weight: 400;
  font-size: 1.7rem; color: var(--bone); line-height: 1.35;
}

/* SECTION HEAD */
.ff-section-head { max-width: 900px; margin: 0 auto 48px; padding: 0 24px; }
.ff-section-head h2 { font-size: clamp(2.1rem, 3.6vw, 2.8rem); margin-bottom: 10px; }
.ff-section-wide { max-width: 1160px; }

/* SPECTRUM DETAIL SECTION */
.ff-spectrum-section { padding: 88px 0 96px; border-top: 1px dashed var(--panel-line); }
.ff-spectrum-detail-list {
  max-width: 880px; margin: 0 auto; padding: 0 24px;
  display: flex; flex-direction: column; gap: 40px;
}
.ff-spectrum-detail {
  position: relative;
  background: var(--panel); border: 2px solid var(--accent);
  border-radius: 10px; padding: 32px;
  box-shadow: 7px 7px 0 var(--accent);
  display: flex; flex-direction: column; gap: 20px;
  overflow: hidden;
}
.ff-spectrum-detail-ghost {
  position: absolute; top: -18px; right: 6px;
  font-family: 'Anton', sans-serif; font-size: 7rem; line-height: 1;
  color: var(--accent); opacity: 0.08; pointer-events: none;
}
.ff-spectrum-detail-head { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
.ff-spectrum-detail-strain {
  margin-left: auto; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--accent); border: 1.5px solid var(--accent);
  border-radius: 999px; padding: 5px 12px; white-space: nowrap;
}
.ff-spectrum-detail-icon {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid var(--accent);
  display: flex; align-items: center; justify-content: center;
}
.ff-spectrum-detail-head h3 { font-size: 1.6rem; margin-bottom: 4px; }
.ff-spectrum-detail-tagline { font-size: 0.9rem; color: var(--dim); }
.ff-spectrum-detail-desc { font-size: 1rem; max-width: none; position: relative; }
.ff-spectrum-detail-foot {
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;
  padding-top: 18px; border-top: 1px dashed var(--panel-line);
  position: relative;
}
.ff-spectrum-detail-label {
  display: block; font-size: 0.78rem; color: var(--accent); margin-bottom: 10px;
}
.ff-spectrum-detail-for ul { display: flex; flex-direction: column; gap: 8px; }
.ff-spectrum-detail-for li {
  font-size: 0.9rem; color: var(--bone); padding-left: 14px; position: relative;
}
.ff-spectrum-detail-for li::before {
  content: ""; position: absolute; left: 0; top: 0.6em;
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
}
.ff-spectrum-detail-when p { font-size: 0.9rem; color: var(--bone); }

/* TRUST */
.ff-trust { padding: 88px 24px; border-top: 1px dashed var(--panel-line); }
.ff-trust-inner {
  max-width: 1080px; margin: 0 auto;
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: start;
}
.ff-trust-copy h2 { font-size: clamp(2rem, 3.2vw, 2.6rem); margin-bottom: 14px; }
.ff-trust-copy p { margin-bottom: 14px; }
.ff-trust-links { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 18px; }
.ff-trust-links a { font-size: 0.88rem; border-bottom: 1px solid var(--panel-line); padding-bottom: 2px; }
.ff-trust-links a:hover { color: var(--s-energy); border-color: var(--s-energy); }
.ff-trust-panel {
  background: var(--panel); border: 2px solid var(--panel-line);
  border-radius: 10px; padding: 6px 20px;
  transform: rotate(0.5deg);
}
.ff-trust-panel-note {
  font-size: 0.92rem; color: var(--dim); margin: 10px 0 16px;
}
.ff-trust-panel-contact {
  font-size: 0.85rem; color: var(--dim); padding-top: 14px;
  border-top: 1px dashed var(--panel-line); margin: 0 0 10px;
}
.ff-trust-panel-contact a { color: var(--bone); border-bottom: 1px solid var(--panel-line); }
.ff-trust-panel-contact a:hover { color: var(--s-energy); border-color: var(--s-energy); }
.ff-compliance-note {
  max-width: 1080px; margin: 32px auto 0; padding: 20px 24px 0;
  font-size: 0.78rem; color: var(--dim);
  border-top: 1px dashed var(--panel-line);
}

/* SOCIAL PROOF */
.ff-proof { padding: 88px 0; border-top: 1px dashed var(--panel-line); }
.ff-proof-grid {
  max-width: 1160px; margin: 0 auto; padding: 0 24px;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;
}
.ff-proof-card { background: var(--panel); border: 1px solid var(--panel-line); border-radius: 10px; padding: 26px; }
.ff-proof-title { font-size: 1.05rem; color: var(--bone); margin-bottom: 10px; }
.ff-proof-text { font-size: 0.92rem; color: var(--dim); max-width: none; }
.ff-proof-disclaimer {
  max-width: 1160px; margin: 20px auto 0; padding: 0 24px;
  font-size: 0.74rem; color: var(--dim); opacity: 0.8;
}

/* FAQ */
.ff-faq { padding: 88px 0; border-top: 1px dashed var(--panel-line); }
.ff-faq-list { max-width: 760px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 12px; }
.ff-faq-item { background: var(--panel); border: 1px solid var(--panel-line); border-radius: 8px; overflow: hidden; }
.ff-faq-item summary {
  padding: 18px 20px; cursor: pointer; font-weight: 600; font-size: 0.98rem;
  list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px;
  color: var(--bone);
}
.ff-faq-item summary::-webkit-details-marker { display: none; }
.ff-faq-item summary::after { content: "+"; font-size: 1.3rem; color: var(--s-balance); flex-shrink: 0; transition: transform 0.15s ease; }
.ff-faq-item[open] summary::after { transform: rotate(45deg); }
.ff-faq-body { padding: 0 20px 20px; font-size: 0.9rem; }

/* WHOLESALE */
.ff-wholesale { padding: 88px 24px; border-top: 1px dashed var(--panel-line); background: var(--panel); }
.ff-wholesale-inner { max-width: 640px; margin: 0 auto; }
.ff-wholesale-inner h2 { font-size: clamp(1.9rem, 3vw, 2.3rem); margin-bottom: 12px; }
.ff-wholesale-inner > p { margin-bottom: 26px; }
.ff-textarea {
  min-height: 90px; resize: vertical; font-family: inherit;
  background: var(--panel); border: 2px solid var(--panel-line);
  border-radius: 6px; padding: 13px 18px; color: var(--bone); font-size: 0.95rem;
}
.ff-textarea:focus { outline: none; border-color: var(--s-balance); }

/* CAUSEWAY */
.ff-causeway { padding: 88px 24px; border-top: 1px dashed var(--panel-line); }
.ff-causeway-inner { max-width: 640px; margin: 0 auto; }
.ff-causeway-tag { display: inline-block; font-size: 0.85rem; color: var(--s-energy); margin-bottom: 14px; }
.ff-causeway-inner h2 { font-size: clamp(2rem, 3.4vw, 2.6rem); margin-bottom: 16px; }
.ff-causeway-inner p { margin-bottom: 24px; }

/* JOIN */
.ff-join {
  padding: 96px 24px;
  border-top: 1px dashed var(--panel-line);
}
.ff-join-inner { max-width: 540px; margin: 0 auto; }
.ff-join-inner h2 { font-size: clamp(2rem, 3.4vw, 2.6rem); margin-bottom: 14px; }
.ff-join-inner > p { margin-bottom: 30px; }
.ff-join-form { display: flex; flex-direction: column; gap: 12px; }
.ff-join-row { display: flex; gap: 12px; flex-wrap: wrap; }
.ff-join-form input[type="text"],
.ff-join-form input[type="tel"],
.ff-join-form input[type="email"] {
  flex: 1; min-width: 200px;
  background: var(--panel); border: 2px solid var(--panel-line);
  border-radius: 6px; padding: 13px 18px; color: var(--bone); font-size: 0.95rem;
}
.ff-join-form input:focus { outline: none; border-color: var(--s-balance); }
.ff-join-consent {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 0.78rem; color: var(--dim); line-height: 1.5;
  padding: 4px 2px;
}
.ff-join-consent input[type="checkbox"] {
  margin-top: 3px; width: 16px; height: 16px; flex-shrink: 0; accent-color: var(--s-balance);
}
.ff-join-consent a { color: var(--bone); border-bottom: 1px solid var(--panel-line); }
.ff-join-consent a:hover { color: var(--s-energy); border-color: var(--s-energy); }
.ff-join-form .ff-btn { align-self: flex-start; }
.ff-join-success { color: var(--s-flow); font-weight: 500; }
.ff-join-links { display: flex; gap: 24px; margin-top: 26px; font-size: 0.92rem; }
.ff-join-links a { border-bottom: 1px solid var(--panel-line); padding-bottom: 2px; }
.ff-join-links a:hover { color: var(--s-energy); border-color: var(--s-energy); }

/* FOOTER */
.ff-footer { padding: 40px 24px 28px; border-top: 1px dashed var(--panel-line); }
.ff-footer-inner { max-width: 1160px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.ff-footer-top { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
.ff-footer-logo { height: 26px; width: auto; opacity: 0.85; }
.ff-footer-links { display: flex; gap: 20px; flex-wrap: wrap; font-size: 0.82rem; color: var(--dim); }
.ff-footer-links a:hover { color: var(--bone); }
.ff-footer-legal {
  font-size: 0.76rem; color: var(--dim); opacity: 0.85; max-width: none;
  border-top: 1px solid var(--panel-line); padding-top: 20px;
}

/* ACCESSIBILITY */
.ff-root a:focus-visible, .ff-root button:focus-visible, .ff-root input:focus-visible {
  outline: 2px solid var(--s-balance); outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { .ff-btn, .ff-nav-cta { transition: none; } }

/* RESPONSIVE */
@media (max-width: 860px) {
  .ff-trust-inner { grid-template-columns: 1fr; }
  .ff-spectrum-detail-foot { grid-template-columns: 1fr; gap: 16px; }
  .ff-dial-node span { display: none; }
}
@media (max-width: 640px) {
  .ff-nav-links { gap: 12px; font-size: 0.78rem; }
  .ff-nav-logo { height: 26px; }
  .ff-hero { padding: 56px 20px 12px; }
  .ff-hero-logo { width: 54vw; margin: 0 0 -8px -10px; }
  .ff-story, .ff-spectrum-section, .ff-causeway, .ff-join, .ff-trust,
  .ff-proof, .ff-faq, .ff-wholesale {
    padding: 56px 20px;
  }
  .ff-spectrum-detail-list, .ff-section-head, .ff-proof-grid, .ff-compliance-note {
    padding-left: 0; padding-right: 0;
  }
  .ff-spectrum-detail { padding: 24px; }
  .ff-spectrum-detail-ghost { font-size: 4.5rem; }
  .ff-tilt-a, .ff-tilt-b { transform: none; }
}
`;

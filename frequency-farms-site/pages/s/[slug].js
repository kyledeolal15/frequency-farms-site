import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import StrainAgeGate from "../../components/StrainAgeGate";
import { STRAINS, strainUrl } from "../../lib/strains";
import { SPECTRUM_STATES } from "../../lib/spectrum";

export async function getStaticPaths() {
  return {
    paths: STRAINS.map((s) => ({ params: { slug: s.slug } })),
    fallback: false, // unknown slug -> normal 404
  };
}

export async function getStaticProps({ params }) {
  const strain = STRAINS.find((s) => s.slug === params.slug);
  if (!strain) return { notFound: true };
  return { props: { strain } };
}

export default function StrainPage({ strain }) {
  const st = strain.spectrum ? SPECTRUM_STATES[strain.spectrum] : null;
  const accent = st ? st.color : "#9C98A2";

  return (
    <>
      <Head>
        <title>{strain.name} — Frequency Farms</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={`${strain.name} from Frequency Farms${st ? ` — ${st.label} on the Frequency Spectrum` : ""}.`}
        />
        <link rel="canonical" href={strainUrl(strain.slug)} />
      </Head>
      <style>{CSS}</style>

      <StrainAgeGate>
        {strain.model && (
          <Script
            type="module"
            src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
            strategy="afterInteractive"
          />
        )}
        <main className="ff-sp" style={{ "--accent": accent }}>
          <img src="/frequency-farms-logo.png" alt="Frequency Farms" className="ff-sp-logo" />

          <div className="ff-sp-viewer">
            {strain.model ? (
              <model-viewer
                src={`/models/${strain.slug}.glb`}
                poster={`/models/${strain.slug}.webp`}
                alt={`3D rendering of ${strain.name}`}
                camera-controls
                auto-rotate
                loading="lazy"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="ff-sp-viewer-empty">3D rendering coming soon</div>
            )}
          </div>

          <h1>{strain.name}</h1>
          {st && (
            <div className="ff-sp-badges">
              <span className="ff-sp-badge ff-sp-badge-accent">{st.label}</span>
              <span className="ff-sp-badge">{st.strainType}</span>
            </div>
          )}

          <dl className="ff-sp-facts">
            {strain.genetics && (<><dt>Genetics</dt><dd>{strain.genetics}</dd></>)}
            {strain.flavor && (<><dt>Flavor &amp; aroma</dt><dd>{strain.flavor}</dd></>)}
            {strain.terpenes && (<><dt>Dominant terpenes</dt><dd>{strain.terpenes.join(" · ")}</dd></>)}
          </dl>

          <p className="ff-sp-note">
            Batch lab results (COA) will be available here once finalized.
          </p>

          <Link href="/" className="ff-sp-back">← Explore the Frequency Spectrum</Link>
          <p className="ff-sp-legal">
            For adults 21+. Individual experiences vary; effects are not guaranteed.
            Not medical advice. <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
          </p>
        </main>
      </StrainAgeGate>
    </>
  );
}

const CSS = `
html, body { margin: 0; background: #000; color: #F5F1EC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
.ff-sg-blank { min-height: 100vh; background: #000; }
.ff-sg { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 32px; text-align: center; background: #000; }
.ff-sg-logo { width: min(240px, 60vw); height: auto; }
.ff-sg h1 { font-size: clamp(1.5rem, 5vw, 2rem); font-weight: 600; margin: 0; }
.ff-sg p { color: #9C98A2; margin: 0; font-size: 0.9rem; }
.ff-sg-actions { display: flex; gap: 12px; margin-top: 8px; }
.ff-sg-btn { background: #3E3D3D; color: #F5F1EC; border: 1px solid #3E3D3D; border-radius: 6px; padding: 12px 22px; font-size: 0.95rem; cursor: pointer; }
.ff-sg-btn-ghost { background: transparent; border-color: rgba(245,241,236,0.4); }
.ff-sp { max-width: 520px; margin: 0 auto; padding: 28px 20px 48px; display: flex; flex-direction: column; gap: 16px; }
.ff-sp-logo { width: 150px; height: auto; align-self: center; }
.ff-sp-viewer { width: 100%; aspect-ratio: 1 / 1; border: 1px solid rgba(245,241,236,0.14); border-radius: 12px; background: #130F17; overflow: hidden; }
.ff-sp-viewer-empty { height: 100%; display: flex; align-items: center; justify-content: center; color: #9C98A2; font-size: 0.9rem; }
.ff-sp h1 { font-family: 'Anton', 'Inter', sans-serif; font-weight: 400; font-size: 2.4rem; margin: 4px 0 0; letter-spacing: 0.01em; }
.ff-sp-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.ff-sp-badge { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(245,241,236,0.25); color: #F5F1EC; }
.ff-sp-badge-accent { border-color: var(--accent); color: var(--accent); }
.ff-sp-facts { display: grid; grid-template-columns: 1fr; gap: 2px; margin: 4px 0; }
.ff-sp-facts dt { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9C98A2; margin-top: 12px; }
.ff-sp-facts dd { margin: 0; font-size: 1rem; }
.ff-sp-note { color: #9C98A2; font-size: 0.85rem; border-top: 1px solid rgba(245,241,236,0.14); padding-top: 16px; margin: 8px 0 0; }
.ff-sp-back { color: #F5F1EC; border-bottom: 1px solid rgba(245,241,236,0.3); align-self: flex-start; padding-bottom: 2px; text-decoration: none; font-size: 0.95rem; }
.ff-sp-legal { color: #9C98A2; font-size: 0.75rem; margin: 8px 0 0; }
.ff-sp-legal a { color: #F5F1EC; }
`;

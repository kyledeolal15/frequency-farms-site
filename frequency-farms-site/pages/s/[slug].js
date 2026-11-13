import { useEffect } from "react";
import Head from "next/head";
import StrainAgeGate from "../../components/StrainAgeGate";
import { MARKUP, CSS } from "../../components/strainPageView";
import { initStrainPage } from "../../components/strainPageClient";
import { STRAINS, strainUrl } from "../../lib/strains";

const THREE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

export async function getStaticPaths() {
  return {
    paths: STRAINS.map((s) => ({ params: { slug: s.slug } })),
    fallback: false, // unknown slug -> normal 404
  };
}

export async function getStaticProps({ params }) {
  if (!STRAINS.find((s) => s.slug === params.slug)) return { notFound: true };
  return { props: { slug: params.slug, strains: STRAINS } };
}

function loadThree() {
  return new Promise((resolve) => {
    if (window.THREE) return resolve();
    const el = document.createElement("script");
    el.src = THREE_SRC;
    el.onload = () => resolve();
    el.onerror = () => resolve(); // page still works; 3D pane shows a note
    document.head.appendChild(el);
  });
}

// Only mounted after the 21+ gate passes, so the page markup (and the
// effect that fills it in) never runs for an unverified visitor.
function StrainBody({ slug, strains }) {
  useEffect(() => {
    loadThree().then(() => initStrainPage(strains, slug));
  }, [slug, strains]);
  return <div dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}

export default function StrainPage({ slug, strains }) {
  const strain = strains.find((s) => s.slug === slug);
  return (
    <>
      <Head>
        <title>{strain.name} — Frequency Farms</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={`${strain.name} from Frequency Farms. Strain details, Frequency Spectrum placement and batch information.`}
        />
        <link rel="canonical" href={strainUrl(slug)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style>{CSS}</style>
      <StrainAgeGate>
        <StrainBody slug={slug} strains={strains} />
      </StrainAgeGate>
    </>
  );
}

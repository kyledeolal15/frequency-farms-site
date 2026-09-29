import Head from "next/head";

// Shared styling + chrome (a way back to the homepage, a footer) for the
// standalone legal pages (Privacy Policy, Terms). Kept as its own small
// component rather than reusing FrequencyFarmsLanding's CSS, since these
// pages are plain text documents, not the marketing page.
const CSS = `
.ff-legal-root {
  --true-black: #0A0908;
  --bone: #F5F1EC;
  --dim: #9C98A2;
  --panel: #130F17;
  --panel-line: rgba(245,241,236,0.14);
  --s-energy: #FF5A36;
  background: var(--true-black);
  color: var(--bone);
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
}
.ff-legal-inner { max-width: 720px; margin: 0 auto; padding: 56px 24px 96px; }
.ff-legal-back {
  display: inline-block; margin-bottom: 32px; font-size: 0.88rem;
  color: var(--dim); text-decoration: none; border-bottom: 1px solid var(--panel-line);
  padding-bottom: 2px;
}
.ff-legal-back:hover { color: var(--s-energy); border-color: var(--s-energy); }
.ff-legal-inner h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); margin-bottom: 6px; }
.ff-legal-updated { font-size: 0.82rem; color: var(--dim); margin-bottom: 40px; }
.ff-legal-inner h2 {
  font-size: 1.15rem; margin: 40px 0 12px; color: var(--bone);
  border-top: 1px dashed var(--panel-line); padding-top: 28px;
}
.ff-legal-inner h2:first-of-type { border-top: none; padding-top: 0; }
.ff-legal-inner p, .ff-legal-inner li { font-size: 0.95rem; color: var(--dim); margin-bottom: 12px; }
.ff-legal-inner ul { padding-left: 20px; margin-bottom: 12px; }
.ff-legal-inner a { color: var(--bone); border-bottom: 1px solid var(--panel-line); }
.ff-legal-inner a:hover { color: var(--s-energy); border-color: var(--s-energy); }
.ff-legal-inner strong { color: var(--bone); }
`;

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="ff-legal-root">
      <style>{CSS}</style>
      <Head>
        <title>{title} — Frequency Farms</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="ff-legal-inner">
        <a href="/" className="ff-legal-back">← Back to Frequency Farms</a>
        <h1>{title}</h1>
        <p className="ff-legal-updated">Last updated: {updated}</p>
        {children}
      </div>
    </div>
  );
}

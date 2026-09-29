import Head from "next/head";
import FrequencyFarmsLanding from "../components/FrequencyFarmsLanding";

// TODO: replace this description with your real one-liner, and set a
// real Open Graph image once you have one (og:image below is a stub).
export default function Home() {
  return (
    <>
      <Head>
        <title>Frequency Farms</title>
        <meta
          name="description"
          content="Frequency Farms grows for the Frequency Spectrum, five states from Flow & Creation to Recovery & Grounding, for entrepreneurs, athletes, and traders who need the right state."
        />
        <meta property="og:title" content="Frequency Farms" />
        <meta
          property="og:description"
          content="Every strain has a place on the spectrum."
        />
        <meta property="og:type" content="website" />
        {/* TODO: add a real favicon.ico to /public, then uncomment:
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <FrequencyFarmsLanding />
    </>
  );
}

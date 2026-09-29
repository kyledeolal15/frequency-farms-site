export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background: #000;
        }
        button {
          -webkit-appearance: none;
          appearance: none;
          background-color: transparent;
          color: inherit;
          font: inherit;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
